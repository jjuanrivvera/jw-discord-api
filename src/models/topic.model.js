const mongoose = require("mongoose");

const topictSchema = new mongoose.Schema({
  name: "string",
  discussion: "string",
  query: "string",
});

module.exports = mongoose.model("topic", topictSchema);
