const mongoose = require("mongoose");

const commandSchema = new mongoose.Schema({
  name: "string",
  group: "string",
  description: "string",
  usage: "string",
});

module.exports = mongoose.model("command", commandSchema);
