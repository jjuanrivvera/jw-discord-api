const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  guild: "string",
  time: "string",
  channel: "string",
  action: "string",
  last: "string",
});

module.exports = mongoose.model("schedule", scheduleSchema);
