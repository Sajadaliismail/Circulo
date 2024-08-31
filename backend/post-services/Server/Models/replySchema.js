const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  likes: [{ type: String }],
  likesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

replySchema.pre("save", function (next) {
  this.likesCount = this.likes.length;
  next();
});

const Reply = mongoose.model("replies", replySchema);

module.exports = Reply;
