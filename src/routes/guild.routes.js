const { Router } = require('express');

const { AuthMiddleware } = require('../middlewares');

module.exports = function ({ GuildController }) {
    const router = Router();

    router.get('/', AuthMiddleware, GuildController.get);
    router.get('/:guildId', AuthMiddleware, GuildController.find);

    // Guild configuration
    router.get('/:guildId/config', AuthMiddleware, GuildController.getConfig);
    router.put('/:guildId/config', AuthMiddleware, GuildController.updateConfig);

    // Guild channels (for dropdown selection)
    router.get('/:guildId/channels', AuthMiddleware, GuildController.getChannels);

    return router;
};
