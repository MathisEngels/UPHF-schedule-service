class ScraperManager {
    constructor() {
        this.scrapers = [];
    }

    register(scraper) {
        this.scrapers.push(scraper);
    }

    async init() {
        for (const scraper of this.scrapers) {
            await scraper.init();
        }
    }

    async run() {
        for (const scraper of this.scrapers) {
            await scraper.run();
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
