const { Router } = require("express");
const passport = require("passport");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

module.exports = function ({ AuthController }) {
  const router = Router();

  router.get("/discord", AuthController.discord);

  router.post("/login", AuthController.exchangeCode);

  return router;
};
