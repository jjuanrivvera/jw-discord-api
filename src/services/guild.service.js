const { ChannelType } = require('discord.js');

let _guildRepository = null;
let _client = null;

class GuildService {
    constructor({ GuildRepository, client }) {
        _guildRepository = GuildRepository;
        _client = client;
    }

    async get(guildId) {
        return await _guildRepository.get(guildId);
    }

    async getAll(user) {
        return await _guildRepository.getAll(user);
    }

    async getBotGuilds() {
        return await _guildRepository.getBotGuilds();
    }

    async getConfig(guildId) {
        return await _guildRepository.findByGuildId(guildId);
    }

    async updateConfig(guildId, config) {
        return await _guildRepository.upsertByGuildId(guildId, config);
    }

    async userHasAccess(user, guildId) {
        const userGuilds = await this.getAll(user);
        return userGuilds.some(g => g.id === guildId);
    }

    async userHasAdminAccess(user, guildId) {
        const userGuilds = await this.getAll(user);
        const guild = userGuilds.find(g => g.id === guildId);
        if (!guild) return false;

        // Check if owner or has ADMINISTRATOR permission (0x8)
        return guild.owner || (guild.permissions & 0x8) !== 0;
    }

    async getGuildChannels(guildId) {
        try {
            const guild = await _client.guilds.fetch(guildId);
            const channels = await guild.channels.fetch();

            return channels
                .filter(ch => ch && ch.type === ChannelType.GuildText)
                .map(ch => ({
                    id: ch.id,
                    name: ch.name,
                    position: ch.position
                }))
                .sort((a, b) => a.position - b.position);
        } catch (error) {
            console.error('Error fetching channels:', error);
            return [];
        }
    }
}

module.exports = GuildService;
