const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const ical = require("node-ical");
const logger = require("../logger");
const { sleep, capitalizeTheFirstLetterOfEachWord, capitalizeFirstLetter } = require("./utils");

// TODO Switch to TS fast
class UPHFScheduleScraper {
    constructor(downloadPath, dataFolderPath, classname, retryInterval, successInterval) {
        this.downloadFolderPath = path.join(downloadPath, classname);
        this.dataFolderPath = dataFolderPath;
        this.dataFilePath = path.join(dataFolderPath, `${classname}.json`);
        this.classname = classname;
        this.timeoutID = null;
        this.retryInterval = Math.max(5, retryInterval);
        this.successInterval = Math.max(60, successInterval);
        this.data = null;
    }

    async init() {
        logger.info(`Scraper | ${this.getClassname()} | Initializing`);
        await this.createFoldersIfNeeded();
        await this.loadData();
    }

    async start() {
        logger.info(`Scraper | ${this.getClassname()} | Starting`);
        await this.run();
    }

    stop() {
        logger.info(`Scraper | ${this.getClassname()} | Stoping`);
        this.stopTimeout();
    }

    async restart() {
        logger.info(`Scraper | ${this.getClassname()} | Restarting`);
        this.stop();
        await this.start();
    }

    async run() {
        if (!process.env[`${this.classname}_USERNAME`] || !process.env[`${this.classname}_PASSWORD`]) {
            logger.error(`Scraper | ${this.getClassname()} | Missing credidentials. Stoping`);
            this.stop();
            return;
        }

        const success = await this.downloadFile();
        if (success) {
            try {
                const filename = (await fs.promises.readdir(this.downloadFolderPath))[0];
                const events = await this.parseICS(path.join(this.downloadFolderPath, filename));
    
                await this.updateDB(events);
                await this.clearDownloadFolder();
                this.setNextTimeout();
            } catch (err) {
                logger.error(`Scraper | ${this.getClassname()} | Error while reading downloaded file`);
                logger.error(err);
            }
        } else {
            await this.updateDB();
            this.setNextTimeout("RETRY");
        }
    }

    getClassname() {
        return this.classname;
    }

    toObject() {
        return {
            name: this.classname,
            retryInterval: this.retryInterval,
            successInterval: this.successInterval,
            ...this.data,
        };
    }

    setNextTimeout(type) {
        const intervalTime = type === "RETRY" ? this.retryInterval : this.successInterval;
        this.timeoutID = setTimeout(() => this.run(), intervalTime * 1000 * 60);
        logger.info(`Scraper | ${this.getClassname()} | New timeout set. Trigger each ${intervalTime} min`);
    }

    stopTimeout() {
        clearTimeout(this.timeoutID);
        this.timeoutID = null;
    }

    async loadData() {
        try {
            await fs.promises.access(this.dataFilePath);
            this.data = JSON.parse(await fs.promises.readFile(this.dataFilePath));
            logger.info(`Scraper | ${this.getClassname()} | Data loaded`);
        } catch {
            logger.info(`Scraper | ${this.getClassname()} | DB is empty`);
            this.data = null;
        }
    }

    async updateDB(events) {
        try {
            if (events) {
                const now = new Date().toJSON();
                this.data = {
                    lastUpdate: now,
                    lastTry: now,
                    events: events,
                };
            } else {
                const now = new Date().toJSON();
                this.data = {
                    ...this.data,
                    lastTry: now,
                };
            }
            await fs.promises.writeFile(this.dataFilePath, JSON.stringify(this.data));
            logger.info(`Scraper | ${this.getClassname()} | Updated DB`);
        } catch (err) {
            logger.error(`Scraper | ${this.getClassname()} | Error while writing to DB`);
            logger.error(err);
        }
    }

    async parseICS(filePath) {
        const rawEvents = await ical.async.parseFile(filePath);

        const events = [];
        for (const rawEvent of Object.values(rawEvents)) {
            let name = "";
            let type = "";
            let teacher = "";
            let location = "";

            const descriptionRaw = rawEvent.description.split("\n");
            const headerRaw = descriptionRaw[0].split(" : ");

            // Name and Type
            if (headerRaw.length > 1) {
                const temp = headerRaw[1].split("-");
                const nameRaw = temp[0].split(" (")[0];
                const typeRaw = temp[1] ? temp[1] : nameRaw;
                if (typeRaw.includes("CM")) {
                    type = "CM";
                } else if (typeRaw.includes("TD")) {
                    type = "TD";
                } else if (typeRaw.includes("TP")) {
                    type = "TP";
                }
                name = capitalizeFirstLetter(nameRaw.trim());
            } else {
                if (headerRaw[0].includes("Reservation")) {
                    name = "Reservation";
                    type = "RES";
                } else {
                    type = "UKN";
                }
            }

            // Location
            const locationRaw = rawEvent.location.split(" (")[0].trim();
            if (locationRaw === "") {
                location = "Non défini";
            } else location = locationRaw;

            // Teacher
            if (descriptionRaw[1] !== "") teacher = capitalizeTheFirstLetterOfEachWord(descriptionRaw[1].split(": ")[1].trim());

            const event = {
                start: rawEvent.start,
                end: rawEvent.end,
                name,
                type,
                location,
                teacher,
            };
            events.push(event);
        }
        return events;
    }

    async downloadFile() {
        await this.clearDownloadFolder();
        const browser = await puppeteer.launch({
            headless: true,
        });
        const page = await browser.newPage();
        await page._client.send("Page.setDownloadBehavior", {
            behavior: "allow",
            downloadPath: this.downloadFolderPath,
        });
        await page.goto("https://cas.uphf.fr/cas/login?service=https://portail.uphf.fr/uPortal/Login", { waitUntil: "networkidle2" });
        await page.type("#username", process.env[`${this.classname}_USERNAME`].toString());
        await page.type("#password", process.env[`${this.classname}_PASSWORD`].toString());
        await page.keyboard.press("Enter");
        await sleep(1000);
        try {
            await page.goto("https://vtmob.uphf.fr/esup-vtclient-up4/stylesheets/desktop/welcome.xhtml", { waitUntil: "networkidle2" });
            await sleep(1000);
            await page.waitForSelector("a[title^='Export iCal']");
            const hrefElement = await page.$("a[title^='Export iCal']");
            await hrefElement.click();
            await sleep(5000);
        } catch {
            logger.warn(`Scraper | ${this.getClassname()} | Failed to download ICS. Vtmob must be down`);
            return false;
        }
        await browser.close();
        logger.info(`Scraper | ${this.getClassname()} | Succesfully downloaded new ICS`)
        return true;
    }

    async createFoldersIfNeeded() {
        try {
            await fs.promises.access(this.downloadFolderPath);
        } catch {
            try {
                await fs.promises.mkdir(this.downloadFolderPath, { recursive: true });
            } catch (err) {
                logger.error("Scraper | " + this.getClassname() + " | Error while writing to DB");
                logger.error(err);
            }
        }

        try {
            await fs.promises.access(this.dataFolderPath);
        } catch {
            try {
                await fs.promises.mkdir(this.dataFolderPath, { recursive: true });
            } catch (err) {
                logger.error("Scraper | " + this.getClassname() + " | Error while writing to DB");
                logger.error(err);
            }
        }
    }

    async clearDownloadFolder() {
        try {
            const files = await fs.promises.readdir(this.downloadFolderPath);
            for (const file of files) {
                await fs.promises.unlink(path.join(this.downloadFolderPath, file));
            }
        } catch (err) {
            logger.error("Scraper | " + this.getClassname() + " | Error while writing to DB");
            logger.error(err);
        }
    }
}

module.exports = UPHFScheduleScraper;
