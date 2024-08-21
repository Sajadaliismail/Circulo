const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const authenticateToken = async (req, res, next) => {
  const token = await req?.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;

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

        const newAccessToken = jwt.sign(
          { userId: req.userId },
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
module.exports = authenticateToken;
