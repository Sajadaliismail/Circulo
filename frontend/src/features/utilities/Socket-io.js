import io from "socket.io-client";

const CHAT_SERVER_URL = process.env.REACT_APP_CHAT_SERVER_URL;

const chatSocket = io(CHAT_SERVER_URL, {
  withCredentials: true,
});

export default chatSocket;
