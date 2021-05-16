const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

module.exports = function(req, res, next) {
  const token = req.headers["authorization"];
  if (!token || !token.startsWith(`Bearer `)) {
    const error = new Error();
    error.message = "Token must be sent";
    error.status = 400;
    throw error;
  }

  jwt.verify(token.replace("Bearer ", ""), JWT_SECRET, function(err, decodedToken) {
    if (err) {
      const error = new Error();
      error.message = "Unauthorized";
      error.status = 401;
      throw error;
    }

    req.user = decodedToken.user;
    next();
  });
};
