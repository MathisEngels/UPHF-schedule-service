const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const UPHFScheduleScraper = require("./uphf/scraper");
const UPHFStatusChecker = require("./uphf/statusChecker");
const ScraperManager = require("./uphf/scraperManager");
require("dotenv").config();

const downloadPath = path.join(__dirname, "download");
const dataPath = path.join(__dirname, "data");
const statusChecker = new UPHFStatusChecker(dataPath, 5);
const scraperManager = new ScraperManager();
scraperManager.register(new UPHFScheduleScraper(downloadPath, dataPath, "CDSI", 30, 12 * 60));
scraperManager.register(new UPHFScheduleScraper(downloadPath, dataPath, "MEEF", 30, 12 * 60));

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));
const authGuard = (req, res, next) => {
    let token = req.headers["authorization"];
    if (typeof token !== "undefined") {
        try {
            token = jwt.verify(token, process.env.JWT_SECRET);
            req.token = token;

            return next();
        } catch (err) {
            return res.status(401).end();
        }
    } else {
        res.status(401).end();
    }
};
const roleGuard = (req, res, next) => {
    if (req.token.role) return next();
    switch (req.params.classname.toLowerCase()) {
        case "cdsi":
            if (req.token.role === "cdsi") return next();
            break;
        case "meef":
            if (req.token.role === "meef") return next();
            break;
        default:
            return res.status(400).end();
    }
    return res.status(401).end();
};
const adminOnly = (req, res, next) => {
    if (req.token.role === "admin") return next();
    return res.status(401).end();
};

app.post("/api/auth", async (req, res) => {
    const { password } = req.body;

    const adminMatch = await bcrypt.compare(password, process.env.ADMIN_HASH);
    const cdsiMatch = await bcrypt.compare(password, process.env.CDSI_HASH);
    const meefMatch = await bcrypt.compare(password, process.env.MEEF_HASH);

    if (adminMatch || cdsiMatch || meefMatch) {
        let role;
        let schedules;
        if (adminMatch) {
            role = "admin";
            schedules = scraperManager.list();
        } else if (cdsiMatch) {
            role = "cdsi";
            schedules = ["CDSI"];
        } else if (meefMatch) {
            role = "meef";
            schedules = ["MEEF"];
        }

        const token = jwt.sign({ uuid: uuidv4(), role: role, schedules: schedules }, process.env.JWT_SECRET, { expiresIn: "365 days" });
        return res.status(200).json({ token: token });
    }
    return res.status(401).end();
});
app.post("/api/verify", authGuard, (_, res) => {
    return res.status(200).end();
});
app.get("/api/status", authGuard, (_, res) => {
    const data = statusChecker.toObject();
    return res.status(200).json(data);
});
app.get("/api/get/:classname", authGuard, roleGuard, (req, res) => {
    let data;
    switch (req.params.classname.toLowerCase()) {
        case "cdsi":
            data = scraperManager.get("CDSI").toObject();
            break;
        case "meef":
            data = scraperManager.get("MEEF").toObject();
            break;
        default:
            data = null;
            break;
    }

    return res.status(200).json(data);
});
app.post("/api/update/:classname", authGuard, adminOnly, async (req, res) => {
    let scraper;
    switch (req.params.classname.toLowerCase()) {
        case "cdsi":
            scraper = scraperManager.get("CDSI");
            await scraper.restart();
            break;
        case "meef":
            scraper = scraperManager.get("MEEF");
            await scraper.restart();
            break;
        default:
            break;
    }
    return res.status(200).end();
});
app.get("*", (_, res) => {
    return res.sendFile(path.join(__dirname, "build/index.html"));
});

app.listen(process.env.PORT, async () => {
    console.log(`Server running on port ${process.env.PORT}`);
    await statusChecker.start();
    await scraperManager.init();
    // await scraperManager.run();
});
