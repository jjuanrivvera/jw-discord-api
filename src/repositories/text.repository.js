const BaseRepository = require('./base.repository');

class TextRepository extends BaseRepository {
    constructor({ Text }) {
        super(Text);
    }

    async findByDate(date) {
        return await this.model.findOne({ date });
    }

    async findByDateRange(startDate, endDate) {
        return await this.model.find({
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });
    }
}

module.exports = TextRepository;
