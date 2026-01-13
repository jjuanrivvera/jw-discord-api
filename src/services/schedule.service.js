const BaseService = require('./base.service');

class ScheduleService extends BaseService {
    constructor({ ScheduleRepository }) {
        super(ScheduleRepository);
        this.repository = ScheduleRepository;
    }

    async getByGuild(guildId) {
        return await this.repository.findByGuild(guildId);
    }

    async findByGuildAndAction(guildId, action) {
        return await this.repository.findByGuildAndAction(guildId, action);
    }
}

module.exports = ScheduleService;
