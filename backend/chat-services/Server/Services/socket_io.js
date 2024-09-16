const { createServer } = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { pubClient, subClient, userClient } = require("./redis");
const authenticate = require("../Middlewares/SocketIoJWT");
const {
  authorize,
  joinRoom,
  SendEmoji,
  handleMessage,
  handleLogout,
  handleCallStart,
  handleTyping,
} = require("./socket_Io_Services");
require("dotenv").config();

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
    // console.log(recipientId);

    await handleCallStart(recipientId, offer, io, socket);
  });

  socket.on("userIsTyping", async ({ id, roomId, userIsTyping }) => {
    // console.log("typing ");
    await handleTyping(socket, io, id, roomId, userIsTyping);
  });

  socket.on("ice-candidate", async (data) => {
    const { recipientId, candidate } = data;

    try {
      const receiverSocketId = await userClient.get(recipientId);
      ``;
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("ice-candidate", { candidate });
      }
    } catch (error) {
      console.error("Error forwarding ICE candidate:", error.message);
    }
  });

  socket.on("answer", async (data) => {
    const { recipientId, answer } = data;
    console.log(answer);

    console.log("answer recieved", recipientId);
    try {
      // Get the recipient's (User 1) socket ID from Redis
      const receiverSocketId = await userClient.get(recipientId);

      if (receiverSocketId) {
        // Forward the answer to User 1
        io.to(receiverSocketId).emit("callAnswered", answer);
      } else {
      }
    } catch (error) {
      console.error("Error forwarding answer:", error.message);
    }
  });
  socket.on("logout", async () => {
    await handleLogout(socket);
  });
});

module.exports = { io, httpServer };
