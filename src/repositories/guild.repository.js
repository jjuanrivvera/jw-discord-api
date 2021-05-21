let _client = null;
const { DiscordApi } = require('../api');

class GuildRepository {
    constructor({client}) {
        _client = client;
    }

    async get(guildId) {
        return await _client.guilds.cache.find(guild => guild.id === guildId);
    }

    async getAll(user) {
        const discordApi = new DiscordApi(user);
        return await discordApi.getGuilds();
    }

    async getBotGuilds() {
        return await _client.guilds.cache;
    }

    async create() {}

    async update() {}

    async delete() {}
}

module.exports = GuildRepository;
