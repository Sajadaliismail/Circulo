const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
  hasRead: { type: Boolean, default: false },
  hasDeleted: { type: Boolean, default: false },
  deletedFor: [{ type: String }],
  emoji: { type: String, default: "" },
  imageUrl: { type: String },
});

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  user1: { type: mongoose.Types.ObjectId, ref: "user" },
  user2: { type: mongoose.Types.ObjectId, ref: "user" },
  messages: [{ type: mongoose.Types.ObjectId, ref: "message", required: true }],
  hasOpened: { type: Boolean, default: false },
});

const Message = mongoose.model("message", messageSchema);
const Rooms = mongoose.model("room", roomSchema);

module.exports = { Rooms, Message };
