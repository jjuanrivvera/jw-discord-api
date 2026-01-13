let _guildService = null;
let _config = null;

class GuildController {
    constructor({ GuildService, config }) {
        _guildService = GuildService;
        _config = config;
    }

    async get(req, res) {
        let guilds = await _guildService.getAll(req.user);
        const botGuilds = await _guildService.getBotGuilds();
        const botGuildsArray = Array.from(botGuilds.values());

        guilds = guilds.map(guild => {
            if (guild.icon) {
                guild.icon = `${_config.DISCORD_CDN}/icons/${guild.id}/${guild.icon}.png`;
            }

            const hasBot = botGuildsArray.find(botGuild => botGuild.id === guild.id);

            guild.hasBot = !!hasBot;

            guild.redirect = hasBot
                ? '#'
                : `https://discord.com/api/oauth2/authorize?client_id=${_config.CLIENT_ID}&permissions=8&redirect_uri=${encodeURIComponent(_config.REDIRECT)}&scope=bot%20applications.commands`;

            return guild;
        });

        return res.send(guilds);
    }

    async find(req, res) {
        const { guildId } = req.params;

        const guild = await _guildService.get(guildId);

        if (!guild) {
            return res.sendStatus(404);
        }

        return res.send(guild);
    }

    async getConfig(req, res) {
        const { guildId } = req.params;

        const hasAccess = await _guildService.userHasAccess(req.user, guildId);
        if (!hasAccess) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const config = await _guildService.getConfig(guildId);

        if (!config) {
            return res.json({
                id: guildId,
                language: null,
                newsNotificationChannelId: null,
                prefix: null
            });
        }

        return res.json(config);
    }

    async updateConfig(req, res) {
        const { guildId } = req.params;
        const { language, newsNotificationChannelId, prefix, name } = req.body;

        const hasAccess = await _guildService.userHasAdminAccess(req.user, guildId);
        if (!hasAccess) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        if (language && !['es', 'en', 'pt'].includes(language)) {
            return res.status(400).json({ error: 'Invalid language. Must be one of: es, en, pt' });
        }

        const updateData = { id: guildId };
        if (language !== undefined) updateData.language = language;
        if (newsNotificationChannelId !== undefined) updateData.newsNotificationChannelId = newsNotificationChannelId;
        if (prefix !== undefined) updateData.prefix = prefix;
        if (name !== undefined) updateData.name = name;

        const updated = await _guildService.updateConfig(guildId, updateData);

        return res.json(updated);
    }

    async getChannels(req, res) {
        const { guildId } = req.params;

        const hasAccess = await _guildService.userHasAccess(req.user, guildId);
        if (!hasAccess) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const channels = await _guildService.getGuildChannels(guildId);

        return res.json(channels);
    }
}

module.exports = GuildController;
