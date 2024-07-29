const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const userRepository = require("../repositories/userRepository");
const secret = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401);
  }
  console.log(token);
  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.userId;
    const userdata = await userRepository.findUser(req.userId);
    if (!userdata.isBlocked) {
      next();
    } else {
      res.clearCookie("jwt");
      return res.status(402).json({ error: "User Blocked" });
    }
  } catch (error) {
    // console.log(error);
    return res.status(404).json({ error: error.message });
  }
};

module.exports = verifyToken;
