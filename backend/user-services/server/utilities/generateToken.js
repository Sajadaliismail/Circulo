const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const generateToken = (Id) => {
  const token = jwt.sign({ userId: Id }, secret, {
    expiresIn: "1d",
  });
  return token;
};

module.exports = generateToken;
