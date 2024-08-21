const { default: mongoose } = require("mongoose");
const Comment = require("../Models/commentSchema");
const Post = require("../Models/PostSchema");

const createcomment = async (data) => {
  const comment = new Comment(data);
  await comment.save();
  console.log(comment);

  return comment;
};

const fetchComments = async (userId, postId) => {
  const postObjectId = new mongoose.Types.ObjectId(postId);
  console.log(postObjectId);
  const posts = await Comment.aggregate([
    {
      $match: { post: postObjectId },
    },
    {
      $addFields: {
        hasLiked: { $in: [userId, "$likes"] },
        likesCount: { $size: "$likes" },
      },
    },
    {
      $project: {
        _id: 1,
        post: 1,
        content: 1,
        likes: 1,
        likesCount: 1,
        hasLiked: 1,
        user: 1,
        createdAt: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return posts;
};

const handleLikes = async (commentId, userId) => {
  console.log(userId);
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("comment not found");
    }

    const hasLiked = comment.likes.includes(userId);

    if (hasLiked) {
      comment.likes = comment.likes.filter((id) => id !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    const data = comment.toObject();
    return { ...data, hasLiked: !hasLiked };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update like status");
  }
};

module.exports = { createcomment, fetchComments, handleLikes };
