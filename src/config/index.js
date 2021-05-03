if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = {
  PORT: process.env.APP_PORT || process.env.PORT,
  MONGO_DSN: process.env.MONGO_DSN,
  APP_NAME: process.env.APP_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
  CACHE_KEY: process.env.CACHE_KEY,
  CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  REDIRECT: process.env.DISCORD_REDIRECT,
  SCOPES: process.env.SCOPES,
  OAUTH: process.env.DISCORD_OAUTH,
  DISCORD_API: process.env.DISCORD_API,
};
