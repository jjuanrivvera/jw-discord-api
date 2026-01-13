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
        // First, check if bot is in the guild using local cache (no API call)
        const botGuild = _client.guilds.cache.get(guildId);
        if (!botGuild) {
            // Bot isn't in this guild, so we can't provide access
            return false;
        }

        // Try to get member from cache first to avoid API call
        const member = botGuild.members.cache.get(user.discordId);
        if (member) {
            return true;
        }

        // If not in cache, try to fetch the member (this is one API call, much better than getAll)
        try {
            await botGuild.members.fetch(user.discordId);
            return true;
        } catch {
            // User is not a member of this guild
            return false;
        }
    }

    async userHasAdminAccess(user, guildId) {
        // First, check if bot is in the guild using local cache (no API call)
        const botGuild = _client.guilds.cache.get(guildId);
        if (!botGuild) {
            return false;
        }

        // Try to get member from cache or fetch
        let member = botGuild.members.cache.get(user.discordId);
        if (!member) {
            try {
                member = await botGuild.members.fetch(user.discordId);
            } catch {
                return false;
            }
        }

        // Check if owner or has ADMINISTRATOR permission
        return botGuild.ownerId === user.discordId || member.permissions.has('Administrator');
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
