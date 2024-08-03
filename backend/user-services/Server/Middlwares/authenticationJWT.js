const jwt = require("jsonwebtoken");
const userRepository = require("../Repositories/userRepository");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;

    // Fetch user data from repository
    const userdata = await userRepository.findUser(req.userId);

    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is blocked
    if (userdata.isBlocked) {
      return res.status(403).json({ error: "User is blocked" });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;
