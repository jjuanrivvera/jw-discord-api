const { Router } = require('express');

const { AuthMiddleware } = require('../middlewares');

module.exports = function ({ TextController }) {
    const router = Router();

    // Public routes (no auth required for reading)
    router.get('/', TextController.list);
    router.get('/today', TextController.getToday);
    router.get('/:date', TextController.getByDate);

    // Admin routes
    router.post('/import', AuthMiddleware, TextController.bulkImport);

    return router;
};
