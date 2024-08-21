const jwt = require("jsonwebtoken");
const userRepository = require("../Repositories/userRepository");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const verifyToken = async (req, res, next) => {
  const token = req?.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;

    const userdata = await userRepository.findUser(req.userId);

    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userdata.isBlocked) {
      return res.status(403).json({ error: "User is blocked" });
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);

    if (error.name === "TokenExpiredError") {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(403).json({ error: "Refresh token is missing" });
      }

      try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        req.userId = decoded.userId;

        const userdata = await userRepository.findUser(req.userId);

        if (!userdata) {
          return res.status(404).json({ message: "User not found" });
        }

        if (userdata.isBlocked) {
          return res.status(403).json({ error: "User is blocked" });
        }

        const newAccessToken = jwt.sign(
          { userId: userdata._id },
          ACCESS_TOKEN_SECRET,
          { expiresIn: "60m" }
        );

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        next();
      } catch (refreshError) {
        console.error("Refresh token verification error:", refreshError);
        return res.status(403).json({ error: "Invalid refresh token" });
      }
    } else {
      return res.status(403).json({ error: "Invalid token" });
    }
  }
};

module.exports = verifyToken;
