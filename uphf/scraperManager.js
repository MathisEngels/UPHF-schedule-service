const logger = require("../logger");

class ScraperManager {
    constructor() {
        this.scrapers = [];
    }

    register(scraper) {
        logger.info(`ScraperManager | New scraper registered (${scraper.getClassname()})`);
        this.scrapers.push(scraper);
    }

    async init() {
        for (const [index, scraper] of this.scrapers.entries()) {
            logger.info(`ScraperManager | Initilization begins (${index+1}/${this.scrapers.length})`);
            await scraper.init();
            logger.info(`ScraperManager | Initilization done (${index+1}/${this.scrapers.length})`);
        }
    }

    async run() {
        for (const [index, scraper] of this.scrapers.entries()) {
            logger.info(`ScraperManager | Starting begins (${index+1}/${this.scrapers.length})`);
            await scraper.run();
            logger.info(`ScraperManager | Starting completed (${index+1}/${this.scrapers.length})`);
        }
    }

    get(classname) {
        for (const scraper of this.scrapers) {
            if (classname === scraper.getClassname()) return scraper;
        }
    }

    list() {
        const classnames = [];
        for (const scraper of this.scrapers) {
            classnames.push(scraper.getClassname());
        }
        return classnames;
    }
}

module.exports = ScraperManager;
