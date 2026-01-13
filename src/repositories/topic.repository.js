const BaseRepository = require('./base.repository');

class TopicRepository extends BaseRepository {
    constructor({ Topic }) {
        super(Topic);
    }

    async findRandom() {
        const count = await this.model.countDocuments();
        if (count === 0) return null;

        const random = Math.floor(Math.random() * count);
        return await this.model.findOne().skip(random);
    }

    async search(query) {
        return await this.model.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { discussion: { $regex: query, $options: 'i' } }
            ]
        });
    }
}

module.exports = TopicRepository;
