import io from "socket.io-client";

const CHAT_SERVER_URL = process.env.REACT_APP_CHAT_SERVER_URL;

const chatSocket = io(CHAT_SERVER_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

chatSocket.on("newAccessToken", (newAccessToken) => {
  document.cookie = `accessToken=${newAccessToken}; Path=/; Secure; HttpOnly; SameSite=Strict`;

  chatSocket.disconnect();
  chatSocket.connect();
});
export default chatSocket;
