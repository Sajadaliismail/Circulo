const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  messages: [messageSchema],
  hasOpened: { type: Boolean, default: false },
});

const Rooms = mongoose.model("room", roomSchema);

module.exports = Rooms;
