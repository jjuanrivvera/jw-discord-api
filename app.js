require("dotenv").config();

const express = require("express");
const passport = require("passport");

const PORT = process.env.APP_PORT || 3000;

const app = express();
const authRoutes = require("./src/routes/auth.routes");
const discordEstrategy = require("./src/strategies/discord-strategy");

passport.use(discordEstrategy);

app.use(express.json);
app.use(passport.initialize());
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});
