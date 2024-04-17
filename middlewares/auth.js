const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

const authorizationMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED)
      .json({ message: "Unauthorized: Missing or invalid token" });
  }

  const token = authorizationHeader.replace("Bearer ", "");

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Unauthorized: Invalid token" });
    }

    req.user = payload;
    next();
  });
};

module.exports = authorizationMiddleware;
