const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  id: "string",
  name: "string",
  newsNotificationChannel: "string",
  prefix: "string",
});

module.exports = mongoose.model("server", serverSchema);
