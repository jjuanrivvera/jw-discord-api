const BaseRepository = require('./base.repository');

class ScheduleRepository extends BaseRepository {
    constructor({ Schedule }) {
        super(Schedule);
    }

    async findByGuild(guildId) {
        return await this.model.find({ guild: guildId });
    }

    async findByGuildAndAction(guildId, action) {
        return await this.model.find({ guild: guildId, action });
    }

    async findByGuildAndTime(guildId, time) {
        return await this.model.find({ guild: guildId, time });
    }
}

module.exports = ScheduleRepository;
