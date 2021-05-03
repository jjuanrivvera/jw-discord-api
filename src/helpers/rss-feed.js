const Parser = require('rss-parser');
const parser = new Parser();

class RssFeed {
    constructor(link) {
        this.link = link;
    }

    async requestFeed() {
        const feed = await parser.parseURL(this.link);

        this.title = feed.title;
        this.description = feed.description;
        this.items = feed.items;

        return this;
    }

    getItemsSortedByDate() {
        return this.items.sort(((a, b) => {
            return new Date(b.isoDate) - new Date(a.isoDate)
        }));
    }
}

module.exports = RssFeed;