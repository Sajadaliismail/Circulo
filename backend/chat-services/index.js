const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { httpServer } = require("./Server/Services/socket_io");
const connectDb = require("./Server/Database/mongodb");
const route = require("./Server/Routes/routes");
const { subscribeMessage } = require("./Server/Services/rabbitmq");
const {
  handleIncomingRequestNotification,
  handleRequestAccepetedNotification,
  newCommentNotification,
  newReplyNotification,
  newLikeNotification,
} = require("./Server/Services/services");
require("dotenv").config();

const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const SOCKET_PORT = process.env.SOCKET_PORT;

const app = express();

app.use(cookieParser());
const corsOption = {
  origin: CORS_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/chats", route);
subscribeMessage("request_accepted", handleRequestAccepetedNotification);
subscribeMessage("newComment", newCommentNotification);
subscribeMessage("newReply", newReplyNotification);
subscribeMessage("newLike", newLikeNotification);
app.listen(PORT, () => {
  console.log(`Chat services connected to port : ${PORT}`);
});

httpServer.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO server listening on ${SOCKET_PORT}`);
});

connectDb();
