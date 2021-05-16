const { sign } = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

module.exports.generateToken = function(user) {
  console.log(`The secret is ${JWT_SECRET}`);
  return sign({ user }, JWT_SECRET, { expiresIn: "4h" });
};
