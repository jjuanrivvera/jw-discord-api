const { Router } = require("express");

module.exports = function ({ AuthController }) {
  const router = Router();

  router.get("/discord", AuthController.discord);

  router.post("/login", AuthController.exchangeCode);

  return router;
};
