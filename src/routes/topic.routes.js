const { Router } = require('express');

const { AuthMiddleware } = require('../middlewares');

module.exports = function ({ TopicController }) {
    const router = Router();

    // Public routes
    router.get('/', TopicController.list);
    router.get('/random', TopicController.getRandom);
    router.get('/search', TopicController.search);
    router.get('/:id', TopicController.getById);

    // Admin routes
    router.post('/', AuthMiddleware, TopicController.create);
    router.put('/:id', AuthMiddleware, TopicController.update);
    router.delete('/:id', AuthMiddleware, TopicController.delete);

    return router;
};
