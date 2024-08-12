const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const authenticate = (socket, next) => {
  const token = socket.handshake.auth.token.split(" ")[1];
  if (!token) return next(new Error("Authentication error"));

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return next(new Error("Authentication error"));
    socket.user = user.userId;
    return next();
  });
};

module.exports = authenticate;
