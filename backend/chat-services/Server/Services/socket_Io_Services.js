const { Message, Rooms } = require("../Models/mongoDb");
const { publishMessage } = require("./rabbitmq");
const { pubClient, subClient, userClient } = require("./redis");
const USER_TTL = 3600;

const authorize = async (user, socket) => {
  socket.userId = user;
  try {
    await userClient.setEx(user, USER_TTL, socket.id);
    console.log("User autherized", user);
    const message = { _id: user, onlineStatus: true };
    if (user) await publishMessage("userStatus", message);
  } catch (error) {
    console.log(error);
  }
};

const joinRoom = async (userId, socket) => {
  try {
    if (!socket.user || !userId) {
      console.error("Invalid user data:", { socketUser: socket.user, userId });
      return;
    }

    const roomId = [socket.user, userId].sort().join("");
    await Message.updateMany(
      { roomId: roomId, senderId: userId, hasRead: false },
      { $set: { hasRead: true } }
    );
    if (!Object.values(socket.rooms).includes(roomId)) {
      socket.join(roomId);
      console.log(`joined room ${roomId}`);
    }
  } catch (error) {
    console.log(error);
  }
};
const SendEmoji = async (id, emoji, friendId, io, socket, roomId) => {
  try {
    const message = await Message.findById(id);
    message.emoji = emoji;
    await message.save();
    const receiverSocketId = await userClient.get(friendId);
    const roomId = [socket.user, friendId].sort().join("");

    io.to(roomId).emit("emoji_recieved", { id, emoji, roomId });
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("emoji_notification", { message: message });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleMessage = async (userId, message, type, io, socket) => {
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

    let newMessage = new Message({
      roomId: roomId,
      senderId: socket.user,
      receiverId: userId,
    });
    if (type === "text") {
      newMessage.message = message;
    } else if (type === "image") {
      newMessage.imageUrl = message;
    }
    await newMessage.save();

    room.messages.push(newMessage);
    room.hasOpened = false;
    const senderSocketId = await userClient.get(socket.user);
    const receiverSocketId = await userClient.get(userId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        senderId: socket.user,
        message: message,
        timestamp: Date.now(),
        roomId: roomId,
      });
    }

    io.to(roomId).emit("newMessageNotification", {
      senderId: socket.user,
      message: message,
      type: type,
      timestamp: Date.now(),
      roomId: roomId,
      _id: newMessage._id,
    });
    // }
    await room.save();
  } catch (error) {
    console.error("Error emitting message:", error);
  }
};
const handleCallStart = async (userId, offer, io, socket) => {
  try {
    const receiverSocketId = await userClient.get(userId);
    const senderSocketId = await userClient.get(socket.user);
    if (receiverSocketId) {
      const data = {
        offer,
        senderId: socket.user,
      };
      io.to(receiverSocketId).emit("incomingCall", data);
    } else if (senderSocketId) {
      io.to(senderSocketId).emit("callFailed");
    }
  } catch (error) {
    console.log(error.message);
  }
};
const handleLogout = async (socket) => {
  const userId = socket.userId;
  if (userId) {
    await userClient.del(userId);
  }
  console.log(`Socket ${socket.id} disconnected`);
  const message = { _id: userId, onlineStatus: false };
  if (userId) await publishMessage("userStatus", message);
};

const handleTyping = async (socket, io, id, roomId, userIsTyping) => {
  const userId = socket.userId;
  const message = {
    id,
    roomId,
    userIsTyping,
  };
  const receiverSocketId = await userClient.get(id);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("typingAlert", message);
  }
};

module.exports = {
  authorize,
  joinRoom,
  SendEmoji,
  handleMessage,
  handleLogout,
  handleCallStart,
  handleTyping,
};
