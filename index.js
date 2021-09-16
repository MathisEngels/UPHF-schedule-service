const path = require("path");
const fs = require('fs');
const puppeteer = require("puppeteer");
const ical = require("node-ical");
require("dotenv").config();
const { sleep, capitalizeTheFirstLetterOfEachWord, capitalizeFirstLetter } = require("./utils");


const downloadPath = path.join(__dirname, "download");
let intervalID;
run();

async function run() {
    await createDownloadFolderIfNeeded();
    loop();
}

async function loop() {
    //const success = await downloadFile();

    if (true) {
        const filename = fs.readdirSync(downloadPath)[0];
        const events = parseICS(path.join(downloadPath, filename));
        // Update DB
        fun(events);
        //clearDownloadFolder();
        //setNextInterval();
    } else {
        setNextInterval("RETRY");
    }
}

function fun(events) {
    let totalMinutes = 0;
    let totalMinutesSpent = 0;
    for (const event of events) {
        const millis = (new Date(event.end)  - new Date(event.start));
        const minutes = millis / 1000 / 60;
        totalMinutes += minutes;

        if (new Date(event.end) - new Date() < 0) {
            totalMinutesSpent += minutes;
        } else if (new Date(event.end) - new Date() > 0 && new Date() - new Date(event.start) < minutes) {
            totalMinutesSpent += minutes / 2;
        }
    }
    console.log(totalMinutesSpent / totalMinutes);
};

function setNextInterval(type) {
    let intervalTime;
    if (type === "RETRY") {
        intervalTime = 1000 * 60 * 12;
    } else {
        intervalTime = 1000 * 60 * 24;
    }
    intervalID = setInterval(() => {
        loop();
    }, intervalTime);
}

function parseICS(filePath) {
    const rawEvents = ical.sync.parseFile(filePath);

    const events = [];
    for (const rawEvent of Object.values(rawEvents)) {
        let name = "";
        let type;
        let teacher;

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
            name = capitalizeFirstLetter(nameRaw)
        } else {
            if (headerRaw[0].includes("Reservation") !== -1) {
                name = "Reservation";
                type = "RES";
            } else {
                type = "UKN"
            } 
        }
        location = rawEvent.location.split(" (")[0];
        teacher = capitalizeTheFirstLetterOfEachWord(descriptionRaw[1].split(": ")[1]);

        const event = {
            uid: rawEvent.uid,
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

async function createDownloadFolderIfNeeded() {
    try {
        await fs.promises.access(downloadPath);
    } catch {
        try {
            await fs.promises.mkdir(downloadPath);
        } catch {
            process.exit(1);
        }
    }
}

function clearDownloadFolder() {
    fs.readdir(downloadPath, (err, files) => {
        if (err) throw err;
      
        for (const file of files) {
          fs.unlink(path.join(downloadPath, file), err => {
            if (err) throw err;
          });
        }
      });
}

async function downloadFile() {
    clearDownloadFolder();
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath 
    });
    await page.goto("https://cas.uphf.fr/cas/login?service=https://portail.uphf.fr/uPortal/Login", { waitUntil: 'networkidle2' });
    await page.type("#username", process.env._USER);
    await page.type("#password", process.env._PASSWORD);
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