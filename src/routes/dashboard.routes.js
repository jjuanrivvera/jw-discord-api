const { Router } = require('express');

const { AuthMiddleware } = require('../middlewares');

module.exports = function ({ DashboardController }) {
    const router = Router();

    router.use(AuthMiddleware);

    router.get('/stats', DashboardController.getStats);
    router.get('/guilds', DashboardController.getUserGuilds);

    return router;
};
