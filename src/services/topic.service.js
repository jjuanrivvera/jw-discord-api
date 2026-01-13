const BaseService = require('./base.service');
const { paginate } = require('../utils/pagination');

class TopicService extends BaseService {
    constructor({ TopicRepository, Topic }) {
        super(TopicRepository);
        this.repository = TopicRepository;
        this.model = Topic;
    }

    async list(options = {}) {
        return await paginate(this.model, {}, {
            page: options.page,
            limit: options.limit,
            sort: { createdAt: -1 }
        });
    }

    async getRandom() {
        return await this.repository.findRandom();
    }

    async search(query) {
        return await this.repository.search(query);
    }
}

module.exports = TopicService;
