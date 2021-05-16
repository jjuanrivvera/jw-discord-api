const { Router } = require("express");

const { AuthMiddleware } = require("../middlewares");

module.exports = function ({ GuildController }) {
  const router = Router();

  router.get("/", AuthMiddleware, GuildController.get);

  return router;
};
