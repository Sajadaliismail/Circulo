const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: { type: String },
  image: { type: String },
  imageId:{type:String},
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: String }],
  likesCount: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

postSchema.pre("save", function (next) {
  this.likesCount = this.likes.length;
  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
