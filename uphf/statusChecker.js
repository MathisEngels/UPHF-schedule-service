const fs = require("fs");
const path = require("path");
const axios = require("axios");
const logger = require("../logger");

// TODO Switch to TS fast
class UPHFStatusChecker {
    constructor(dataFolderPath, interval) {
        this.dataFolderPath = dataFolderPath;
        this.dataFilePath = path.join(dataFolderPath, "status.json");
        this.interval = Math.max(5, interval);
        this.intervalID = null;
        this.data = [];
    }

    async start() {
        logger.info(`StatusChecker | Starting`);
        await this.createFoldersIfNeeded();
        await this.loadDB();

        await this.check();
        this.startInterval();
    }

    async stop() {
        logger.info(`StatusChecker | Stoping`);
        this.stopInterval();
    }

    toObject() {
        return this.data;
    }

    async check() {
        const alive = await this.request();

        this.updateDB(alive);
    }

    async request() {
        try {
            await axios.get("https://vtmob.uphf.fr/esup-vtclient-up4/stylesheets/home.xhtml?m=false", { timeout: 1000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    startInterval() {
        logger.info(`StatusChecker | Interval set to ${this.interval} minutes`);
        this.intervalID = setInterval(() => this.check(), this.interval * 1000 * 60);
    }

    stopInterval() {
        clearInterval(this.intervalID);
        this.intervalID = null;
    }

    async loadDB() {
        try {
            await fs.promises.access(this.dataFilePath);
            this.data = JSON.parse(await fs.promises.readFile(this.dataFilePath));
            logger.info(`StatusChecker | Data loaded`);
        } catch {
            logger.warn(`StatusChecker | DB empty`);
            this.data = [];
        }
    }

    async updateDB(status) {
        try {
            // TODO I should just append to the file and not rewriting it.
            // Maybe just keep the past 3 months too.
            this.data.push({ date: new Date().toJSON(), alive: status });
            await fs.promises.writeFile(this.dataFilePath, JSON.stringify(this.data));
        } catch (err) {
            logger.error(`StatusChecker | Error while trying to write to DB`);
            logger.error(err);
        }
    }

    async createFoldersIfNeeded() {
        try {
            await fs.promises.access(this.dataFolderPath);
        } catch {
            try {
                await fs.promises.mkdir(this.dataFolderPath, { recursive: true });
            } catch (err) {
                logger.error(`StatusChecker | Error while creating data folder`);
                logger.error(err);
            }
        }
    }
}

module.exports = UPHFStatusChecker;
