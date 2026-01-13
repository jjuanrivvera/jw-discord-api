const BaseService = require('./base.service');
const { paginate } = require('../utils/pagination');

class NewsService extends BaseService {
    constructor({ NewsRepository, New }) {
        super(NewsRepository);
        this.repository = NewsRepository;
        this.model = New;
    }

    async list(options = {}) {
        const query = {};

        if (options.language) {
            query.language = options.language;
        }

        return await paginate(this.model, query, {
            page: options.page,
            limit: options.limit,
            sort: { pubDate: -1 }
        });
    }

    async getLatest(language = 'es') {
        return await this.repository.findLatestByLanguage(language);
    }

    async getByLanguage(language, limit) {
        return await this.repository.findByLanguage(language, limit);
    }
}

module.exports = NewsService;
