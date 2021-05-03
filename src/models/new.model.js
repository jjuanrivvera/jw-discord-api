const mongoose = require("mongoose");

const newSchema = new mongoose.Schema({
  title: "string",
  link: "string",
  pubDate: "string",
  isoDate: "string",
  last: "boolean",
});

module.exports = mongoose.model("new", newSchema);
