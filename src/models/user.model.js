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

userSchema.methods.toJSON = function() {
  let user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("user", userSchema);
