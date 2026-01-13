const { DiscordApi } = require('../api');

let _client = null;
let _Guild = null;

class GuildRepository {
    constructor({ client, Guild }) {
        _client = client;
        _Guild = Guild;
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

    async findByGuildId(guildId) {
        return await _Guild.findOne({ id: guildId });
    }

    async upsertByGuildId(guildId, data) {
        return await _Guild.findOneAndUpdate(
            { id: guildId },
            { $set: data },
            { new: true, upsert: true }
        );
    }

    async create(data) {
        return await _Guild.create(data);
    }

    async update(guildId, data) {
        return await _Guild.findOneAndUpdate(
            { id: guildId },
            { $set: data },
            { new: true }
        );
    }

    async delete(guildId) {
        await _Guild.findOneAndDelete({ id: guildId });
        return true;
    }
}

module.exports = GuildRepository;
