const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const ical = require("node-ical");
const { sleep, capitalizeTheFirstLetterOfEachWord, capitalizeFirstLetter } = require("./utils");


class UPHFScheduleScraper {
    constructor(downloadPath, dataFolderPath, classname) {
        this.downloadFolderPath = path.join(downloadPath, classname);
        this.dataFolderPath = dataFolderPath;
        this.dataFilePath = path.join(dataFolderPath, `${classname}.json`);
        this.classname = classname;
        this.intervalID = null;
        this.data = null;
    }

    async init() {
        await this.createFoldersIfNeeded();
        await this.loadData();
    }

    async run() {
        await this.loop();
    }

    async loop() {
        const success = await this.downloadFile();

        if (success) {
            const filename = (await fs.promises.readdir(this.downloadFolderPath))[0];
            const events = this.parseICS(path.join(this.downloadFolderPath, filename));
            
            await this.updateDB(events);
            this.clearDownloadFolder();
            this.setNextInterval();
        } else {
            this.setNextInterval("RETRY");
        }
    }

    async updateAndResetLoop() {
        clearInterval(this.intervalID);
        this.intervalID = null;
        await this.loop();
    }

    async loadData() {
        try {
            await fs.promises.access(this.dataFilePath);
            this.data = JSON.parse(await fs.promises.readFile(this.dataFilePath));
        } catch {
            this.data = null;
        }
    }

    async getData() {
        return this.data;
    }

    async updateDB(events) {
        try {
            await fs.promises.writeFile(this.dataFilePath, JSON.stringify(events));
            this.data = events;
        } catch {
        }
    }

    parseICS(filePath) {
        const rawEvents = ical.sync.parseFile(filePath);
    
        const events = [];
        for (const rawEvent of Object.values(rawEvents)) {
            let name = "";
            let type = "";
            let teacher = "";
            let location = "";
    
            const descriptionRaw = rawEvent.description.split("\n");
            const headerRaw = descriptionRaw[0].split(" : ");
    
            if (headerRaw.length > 1) {
                const temp = headerRaw[1].split("-");
                const nameRaw = temp[0].split(" (")[0];
                const typeRaw = temp[1];
                if (typeRaw.includes("CM") !== -1) {
                    type = "CM";
                } else if (typeRaw.includes("TD") !== -1) {
                    type = "TD";
                } else if (typeRaw.includes("TP") !== -1) {
                    type = "TP";
                }
                name = capitalizeFirstLetter(nameRaw.trim());
            } else {
                if (headerRaw[0].includes("Reservation") !== -1) {
                    name = "Reservation";
                    type = "RES";
                } else {
                    type = "UKN"
                } 
            }
            location = rawEvent.location.split(" (")[0];
            if (descriptionRaw[1] !== '') teacher = capitalizeTheFirstLetterOfEachWord(descriptionRaw[1].split(": ")[1]);
            
    
            const event = {
                start: rawEvent.start,
                end: rawEvent.end,
                name,
                type,
                location,
                teacher
            }
            events.push(event);
        };
        return events;
    }

    setNextInterval(type) {
        let intervalTime;
        if (type === "RETRY") {
            intervalTime = 1000 * 60 * 2;
        } else {
            intervalTime = 1000 * 60 * 24;
        }
        this.intervalID = setInterval(() => {
            this.loop();
        }, intervalTime);
    }

    async downloadFile() {
        this.clearDownloadFolder();
        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage();
        await page._client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: this.downloadFolderPath
        });
        await page.goto("https://cas.uphf.fr/cas/login?service=https://portail.uphf.fr/uPortal/Login", { waitUntil: 'networkidle2' });
        await page.type("#username", process.env[`${this.classname}_USERNAME`]);
        await page.type("#password", process.env[`${this.classname}_PASSWORD`]);
        await page.keyboard.press("Enter");
        await sleep(1000);
        try {
            await page.goto("https://vtmob.uphf.fr/esup-vtclient-up4/stylesheets/desktop/welcome.xhtml", { waitUntil: 'networkidle2' });
            await sleep(1000);
            await page.waitForSelector('a[title^="Export iCal"]');
            const hrefElement = await page.$('a[title^="Export iCal"]');
            await hrefElement.click();
            await sleep(5000);
        } catch {
            return false;
        }
        await browser.close();
        return true;
    }

    async createFoldersIfNeeded() {
        try {
            await fs.promises.access(this.downloadFolderPath);
        } catch {
            try {
                await fs.promises.mkdir(this.downloadFolderPath, { recursive: true });
            } catch {
                process.exit(1);
            }
        }
        
        try {
            await fs.promises.access(this.dataFolderPath);
        } catch {
            try {
                await fs.promises.mkdir(this.dataFolderPath, { recursive: true });
            } catch {
                process.exit(1);
            }
        }
    }

    clearDownloadFolder() {
        fs.readdir(this.downloadFolderPath, (err, files) => {
            if (err) throw err;
        
            for (const file of files) {
                fs.unlink(path.join(this.downloadFolderPath, file), err => {
                    if (err) throw err;
                });
            }
        });
    }
}

module.exports = UPHFScheduleScraper;