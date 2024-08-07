// src/socket.js
import io from "socket.io-client";

const CHAT_SERVER_URL = process.env.REACT_APP_CHAT_SERVER_URL;
const token = localStorage.getItem("jwt");

const chatSocket = io(CHAT_SERVER_URL, {
  auth: { token: `Bearer ${token}` },
});

export default chatSocket;
