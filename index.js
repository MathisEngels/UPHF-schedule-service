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
app.use(express.static(path.join(__dirname, "build")));
const authGuard = (req, res, next) => {
    let token = req.headers['authorization'];
    if (typeof token !== 'undefined') {
        try {
            token = jwt.verify(token, process.env.JWT_SECRET);
            req.token = token;
    
            return next();
        } catch(err) {
            return res.status(401).end();
        }
    } else {
        res.status(401).end();
    }
}
const roleGuard = (req, res, next) => {
    switch (req.params.classname.toLowerCase()) {
        case "cdsi":
            if (req.token.role === "cdsi" || req.token.role === "admin") return next();
            break;
        case "meef":
            if (req.token.role === "meef" || req.token.role === "admin") return next();
            break;
        default: 
            return res.status(400).end();
    }
    return res.status(401).end();
}
const adminOnly = (req, res, next) => {
    if (req.token.role === "admin") return next();
    return res.status(401).end();
}

app.post("/api/auth", async (req, res) => {
    const { password } = req.body;

    const adminMatch = await bcrypt.compare(password, process.env.ADMIN_HASH);
    const cdsiMatch = await bcrypt.compare(password, process.env.CDSI_HASH);
    const meefMatch = await bcrypt.compare(password, process.env.MEEF_HASH);

    if (adminMatch || cdsiMatch || meefMatch) {
        let role;
        if (adminMatch) role = "admin";
        if (cdsiMatch) role = "cdsi";
        if (meefMatch) role = "meef";

        const token = jwt.sign({ uuid: uuidv4(), role: role }, process.env.JWT_SECRET, { expiresIn: "365 days" });
        res.status(200).json({ token: token });
    }
    res.status(401).end();
});
app.post("/api/verify", authGuard, (_, res) => {
    return res.status(200).end();
});
app.get("/api/get/:classname", authGuard, roleGuard, async (req, res) => {
    let data;
    switch (req.params.classname.toLowerCase()) {
        case "cdsi":
            data = await CDSI.getData();
            break;
        case "meef":
            data = await MEEF.getData();
            break;
        default:
            data = null;
            break;
    }

    return res.status(200).json(data);
});
app.post("/api/update/:classname", authGuard, adminOnly, async (req, res) => {
    switch (req.params.classname.toLowerCase()) {
        case "cdsi":
            await CDSI.updateAndResetLoop();
            break;
        case "meef":
            await MEEF.updateAndResetLoop();
            break;
        default:
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
    // await CDSI.run();
    // await MEEF.run();
});