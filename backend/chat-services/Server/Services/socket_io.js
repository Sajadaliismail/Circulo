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
    await handleCallStart(recipientId, offer, io, socket);
  });

  socket.on("userIsTyping", async ({ id, roomId, userIsTyping }) => {
    await handleTyping(socket, io, id, roomId, userIsTyping);
  });

  socket.on("ice-candidate", async (data) => {
    const { recipientId, candidate, type } = data;

    try {
      const receiverSocketId = await userClient.get(recipientId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit(`ice-candidate-${type}`, { candidate });
      } else {
        console.log("ayachattilla");
      }
    } catch (error) {
      console.error("Error forwarding ICE candidate:", error.message);
    }
  });

  socket.on("answer", async (data) => {
    const { recipientId, answer } = data;
    try {
      const receiverSocketId = await userClient.get(recipientId);
      console.log(recipientId, socket.user);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("callAnswered", answer);
      } else {
        console.log("not found");
      }
    } catch (error) {
      console.error("Error forwarding answer:", error.message);
    }
  });

  socket.on("call_ended", async (data) => {
    console.log(data);

    try {
      const { recipientId } = data;
      const receiverSocketId = await userClient.get(recipientId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("call_hangup", recipientId);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("call_status", async ({ recipientId, message }) => {
    console.log(recipientId, socket.user);

    const receiverSocketId = await userClient.get(recipientId);
    if (receiverSocketId) {
      const data = { recipientId, message };
      io.to(receiverSocketId).emit("user_status", data);
      console.log("emitted");
    }
  });

  socket.on("logout", async () => {
    await handleLogout(socket);
  });

  socket.on("handleRelation", async (data) => {
    const { user, change } = data;

    const receiverSocketId = await userClient.get(user);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("relationChanged", {
        change,
        user: socket.user,
      });
    }
  });
});

module.exports = { io, httpServer };
