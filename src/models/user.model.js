const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: "string",
  username: "string",
  discriminator: "string",
  avatar: "string",
  email: "string",
  access_token: "string",
  refresh_token: "string",
});

module.exports = mongoose.model("user", userSchema);
