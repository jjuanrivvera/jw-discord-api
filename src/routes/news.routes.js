const { Router } = require('express');

module.exports = function ({ NewsController }) {
    const router = Router();

    // All news routes are public (read-only)
    router.get('/', NewsController.list);
    router.get('/latest', NewsController.getLatest);

    return router;
};
