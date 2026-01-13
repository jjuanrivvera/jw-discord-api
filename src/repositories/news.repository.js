const BaseRepository = require('./base.repository');

class NewsRepository extends BaseRepository {
    constructor({ New }) {
        super(New);
    }

    async findLatestByLanguage(language) {
        return await this.model.findOne({
            language,
            last: true
        });
    }

    async findByLanguage(language, limit = 20) {
        return await this.model.find({ language })
            .sort({ pubDate: -1 })
            .limit(limit);
    }
}

module.exports = NewsRepository;
