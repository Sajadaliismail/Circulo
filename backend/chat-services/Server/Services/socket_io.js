const { createServer } = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { pubClient, subClient, userClient } = require("./redis");
const { Rooms, Message } = require("../Models/mongoDb");
const authenticate = require("../Middlewares/SocketIoJWT");
const {
  authorize,
  joinRoom,
  SendEmoji,
  handleMessage,
  handleLogout,
  handleCallStart,
} = require("./socket_Io_Services");
require("dotenv").config();

const SOCKET_IO_PORT = process.env.SOCKET_IO_PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    credentials: true,
  },
});

io.adapter(createAdapter(pubClient, subClient));

io.use((socket, next) => {
  authenticate(socket, next);
});

io.on("connection", (socket) => {
  socket.on("authenticate", async (user) => {
    await authorize(user, socket);
  });

  socket.on("join_room", ({ userId }) => {
    joinRoom(userId, socket);
  });

  socket.on("emoji_send", async ({ id, emoji, friendId, roomId }) => {
    await SendEmoji(id, emoji, friendId, io, socket, roomId);
  });

  socket.on("message", async ({ userId, message, type, roomId }) => {
    await handleMessage(userId, message, type, io, socket, roomId);
  });

  socket.on("start-call", async ({ recipientId, offer }) => {
    await handleCallStart(recipientId, offer);
  });

  socket.on("logout", async () => {
    await handleLogout(socket);
  });
});

module.exports = { io, httpServer };
