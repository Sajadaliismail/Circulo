const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const generateToken = (Id) => {
  const token = jwt.sign({ userId: Id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

module.exports = generateToken;
