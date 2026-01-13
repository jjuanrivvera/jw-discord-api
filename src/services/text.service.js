const BaseService = require('./base.service');
const { paginate } = require('../utils/pagination');

class TextService extends BaseService {
    constructor({ TextRepository, Text }) {
        super(TextRepository);
        this.repository = TextRepository;
        this.model = Text;
    }

    async list(options = {}) {
        return await paginate(this.model, {}, {
            page: options.page,
            limit: options.limit,
            sort: { date: -1 }
        });
    }

    async getByDate(date) {
        return await this.repository.findByDate(date);
    }

    async getByDateRange(startDate, endDate) {
        return await this.repository.findByDateRange(startDate, endDate);
    }

    async bulkImport(texts) {
        const operations = texts.map(text => ({
            updateOne: {
                filter: { date: text.date },
                update: { $set: text },
                upsert: true
            }
        }));

        const result = await this.model.bulkWrite(operations);

        return {
            imported: result.upsertedCount,
            updated: result.modifiedCount,
            total: texts.length
        };
    }
}

module.exports = TextService;
