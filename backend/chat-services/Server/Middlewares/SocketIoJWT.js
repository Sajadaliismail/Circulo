const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const authenticate = (socket, next) => {
  const cookieHeader = socket.request.headers.cookie;
  if (!cookieHeader) {
    return next(new Error("No cookies found"));
  }

  const cookies = cookie.parse(cookieHeader);
  const accessToken = cookies.accessToken;
  const refreshToken = cookies.refreshToken;

  if (!accessToken) {
    return next(new Error("Access token not found"));
  }

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    socket.user = decoded.userId;
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      if (!refreshToken) {
        return next(new Error("Refresh token not found"));
      }

      try {
        const decodedRefresh = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        socket.user = decodedRefresh.userId;

        if (!decodedRefresh) {
          return next(new Error("Invalid refresh token"));
        }

        // Generate a new access token
        const newAccessToken = jwt.sign(
          { userId: socket.user },
          ACCESS_TOKEN_SECRET,
          { expiresIn: "60m" }
        );

        socket.request.headers.cookie = cookie.serialize(
          "accessToken",
          newAccessToken,
          { httpOnly: true }
        );

        return next();
      } catch (refreshErr) {
        return next(new Error("Refresh token error"));
      }
    }
    return next(new Error("Authentication error"));
  }
};

module.exports = authenticate;
