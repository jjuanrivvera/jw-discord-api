const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('express-async-errors');
const { NotFoundMiddleware, ErrorMiddleware } = require('../middlewares');

module.exports = function ({
    AuthRoutes,
    GuildRoutes,
    UserRoutes,
    ScheduleRoutes,
    TextRoutes,
    NewsRoutes,
    TopicRoutes,
    DashboardRoutes
}) {
    const router = express.Router();
    const apiRoutes = express.Router();

    // Rate limiting
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        message: { error: 'Too many requests, please try again later' }
    });

    apiRoutes
        .use(express.json())
        .use(cors())
        .use(helmet())
        .use(compression())
        .use(apiLimiter);

    // Routes
    apiRoutes.use('/auth', AuthRoutes);
    apiRoutes.use('/guilds', GuildRoutes);
    apiRoutes.use('/users', UserRoutes);
    apiRoutes.use('/schedules', ScheduleRoutes);
    apiRoutes.use('/texts', TextRoutes);
    apiRoutes.use('/news', NewsRoutes);
    apiRoutes.use('/topics', TopicRoutes);
    apiRoutes.use('/dashboard', DashboardRoutes);

    // Health check
    apiRoutes.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    router.use('/api/v1', apiRoutes);

    router.use(NotFoundMiddleware);
    router.use(ErrorMiddleware);

    return router;
};
