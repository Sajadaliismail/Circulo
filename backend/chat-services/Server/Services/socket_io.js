// socket_io.js
const { createServer } = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { createAdapter } = require("@socket.io/redis-adapter");
const { pubClient, subClient, userClient } = require("./redis");
const Rooms = require("../Models/mongoDb");
require("dotenv").config();

const SOCKET_IO_PORT = process.env.SOCKET_IO_PORT;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const USER_TTL = 3600;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
  },
});

io.adapter(createAdapter(pubClient, subClient));

io.use((socket, next) => {
  const token = socket.handshake.auth.token.split(" ")[1];
  if (!token) return next(new Error("Authentication error"));

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return next(new Error("Authentication error"));
    socket.user = user.userId;
    return next();
  });
});

io.on("connection", (socket) => {
  socket.on("authenticate", async (user) => {
    socket.userId = user;
    await userClient.setEx(user, USER_TTL, socket.id);
  });

  socket.on("join_room", ({ userId }) => {
    if (!socket.user || !userId) {
      console.error("Invalid user data:", { socketUser: socket.user, userId });
      return;
    }

    const roomId = [socket.user, userId].sort().join("");
    if (!Object.values(socket.rooms).includes(roomId)) {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    }
  });

  socket.on("message", async ({ userId, message }) => {
    if (!socket.user || !userId || !message) {
      console.error("Invalid message data:", {
        socketUser: socket.user,
        userId,
        message,
      });
      return;
    }

    const roomId = [socket.user, userId].sort().join("");

    try {
      let room = await Rooms.findOne({ roomId: roomId });
      if (!room) {
        room = new Rooms({
          roomId: roomId,
          messages: [],
        });
      }
      room.messages.push({
        senderId: socket.user,
        receiverId: userId,
        message: message,
      });

      room.hasOpened = false;

      io.to(roomId).emit("receiveMessage", {
        roomId: roomId,
        hasOpened: false,
        messages: [
          {
            senderId: socket.user,
            message: message,
            timestamp: Date.now(),
          },
        ],
      });

      const receiverSocketId = await userClient.get(userId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessageNotification", {
          senderId: socket.user,
          message: message,
        });
      }

      await room.save();
      console.log("emitted");
    } catch (error) {
      console.error("Error emitting message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

module.exports = { io, httpServer };
