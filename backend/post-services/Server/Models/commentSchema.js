const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  likes: [{ type: String }],
  likesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "replies" }],
});

commentSchema.pre("save", function (next) {
  this.likesCount = this.likes.length;
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
