import io from "socket.io-client";

const CHAT_SERVER_URL = process.env.REACT_APP_CHAT_SERVER_URL;

const chatSocket = io(CHAT_SERVER_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  auth: {
    token: document.cookie.replace(
      /(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    ),
  },
});

chatSocket.on("newAccessToken", (newAccessToken) => {
  document.cookie = `accessToken=${newAccessToken}; Path=/; Secure; SameSite=Strict`;

  chatSocket.auth.token = newAccessToken;
  chatSocket.connect();
});

export default chatSocket;
