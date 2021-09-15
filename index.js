const path = require("path");
const fs = require('fs');
const puppeteer = require("puppeteer");
const ical = require("node-ical");
require("dotenv").config();
const { sleep, capitalizeTheFirstLetterOfEachWord } = require("./utils");


const downloadPath = path.join(__dirname, "download");

async function loop() {
    //const success = await downloadFile();

    if (true) {
        const filename = fs.readdirSync(downloadPath)[0];
        const events = parseICS(path.join(downloadPath, filename));
    } else {

    }

}

loop();

function parseICS(filePath) {
    const rawEvents = ical.sync.parseFile(filePath);

    const events = [];
    for (const rawEvent of Object.values(rawEvents)) {
        const descriptionRaw = rawEvent.description.split("\n");
        const name = descriptionRaw[0].split(" : ");
        console.log(name);
        const teacher = capitalizeTheFirstLetterOfEachWord(descriptionRaw[1].split(": ")[1]);

        // const name = rawEvent.description.splice();
        // const type = rawEvent.description.splice();
        // const teacher = rawEvent.description.splice();
        // const event = {
        //     uid: rawEvent.uid,
        //     start: rawEvent.start,
        //     end: rawEvent.end,
        //     name,
        //     type: "TD / TP / AUTRE / CM / Partiel",
        //     location: rawEvent.location,
        //     teacher: ""
        // }
    };
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
        headless: false
    });
    const page = await browser.newPage();
    await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath 
    });
    await page.goto("https://cas.uphf.fr/cas/login?service=https://portail.uphf.fr/uPortal/Login", { waitUntil: 'networkidle2' });
    await page.type("#username", process.env.USR);
    await page.type("#password", process.env.PWD);
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