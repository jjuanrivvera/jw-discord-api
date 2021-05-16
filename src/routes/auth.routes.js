const { Router } = require("express");

module.exports = function ({ AuthController }) {
  const router = Router();

  router.post("/discord", AuthController.discord);

  router.post("/login", AuthController.exchangeCode);

  return router;
};
