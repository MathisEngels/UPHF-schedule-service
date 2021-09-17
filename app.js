const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const UPHFScheduleScraper = require("./scraper");
require("dotenv").config();

const downloadPath = path.join(__dirname, "download");
const dataPath = path.join(__dirname, "data");
const CDSI = new UPHFScheduleScraper(downloadPath, dataPath, "CDSI");
const MEEF = new UPHFScheduleScraper(downloadPath, dataPath, "MEEF");

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "..", "build")));
const guard = (req, res, next) => {
    const header = req.headers['authorization'];
    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        try {
            jwt.verify(token, process.env.JWT_SECRET);
    
            return next();
        } catch(err) {
            return res.status(401).end();
        }
    } else {
        res.status(401).end();
    }
}

app.post("/api/auth", async (req, res) => {
    const { password } = req.body;

    const match = await bcrypt.compare(password, process.env.HASH);

    if (match) {
        const token = jwt.sign({ uuid: uuidv4() }, process.env.JWT_SECRET, { expiresIn: "365 days" });
        res.status(200).json(token);
    }
    res.status(401).end();
});
app.post("/api/verify", guard, (_, res) => {
    return res.status(200).end();
});
app.get("/api/get/:classname", guard, async (req, res) => {
    let data;
    switch (req.params.classname.toLowerCase()) {
        case "cdsi":
            data = await CDSI.getData();
            break;
        case "meef":
            data = await MEEF.getData();
            break;
    }

    return res.status(200).json(data);
});
app.post("/api/update/:classname", guard, async (req, res) => {
    switch (req.params.classname.toLowerCase()) {
        case "cdsi":
            await CDSI.updateAndResetLoop();
            break;
        case "meef":
            await MEEF.updateAndResetLoop();
            break;
        case "all":
            await CDSI.updateAndResetLoop();
            await MEEF.getData();
            break;
    }
    res.status(200).end();
});
app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "build/index.html"));
});

app.listen(process.env.PORT, async () => {
    console.log(`Server running on port ${process.env.PORT}`);
    await CDSI.init();
    await MEEF.init();
    await CDSI.run();
    await MEEF.run();
});