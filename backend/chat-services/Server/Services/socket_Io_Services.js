const { Message, Rooms } = require("../Models/mongoDb");
const { pubClient, subClient, userClient } = require("./redis");
const USER_TTL = 3600;

const authorize = async (user, socket) => {
  socket.userId = user;
  await userClient.setEx(user, USER_TTL, socket.id);
  console.log("User autherized", user);
};

const joinRoom = (userId, socket) => {
  try {
    if (!socket.user || !userId) {
      console.error("Invalid user data:", { socketUser: socket.user, userId });
      return;
    }

    const roomId = [socket.user, userId].sort().join("");
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
    // const roomId = [socket.user, friendId].sort().join("");

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("emoji_recieved", { id, emoji, roomId });
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
    if (senderSocketId) {
      io.to(senderSocketId).emit("sentMessageNotification", {
        senderId: socket.user,
        message: message,
        type: type,
        timestamp: Date.now(),
        roomId: roomId,
        _id: newMessage._id,
      });
    }

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessageNotification", {
        senderId: socket.user,
        message: message,
        type: type,
        timestamp: Date.now(),
        roomId: roomId,
        _id: newMessage._id,
      });
    }
    await room.save();
  } catch (error) {
    console.error("Error emitting message:", error);
  }
};
module.exports = { authorize, joinRoom, SendEmoji, handleMessage };
