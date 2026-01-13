const { Router } = require('express');

const { AuthMiddleware } = require('../middlewares');

module.exports = function ({ ScheduleController }) {
    const router = Router();

    // All routes require authentication
    router.use(AuthMiddleware);

    // Guild schedules
    router.get('/guild/:guildId', ScheduleController.getByGuild);
    router.post('/guild/:guildId', ScheduleController.create);
    router.put('/:scheduleId', ScheduleController.update);
    router.delete('/:scheduleId', ScheduleController.delete);

    return router;
};
