const { default: mongoose } = require("mongoose");
const Reply = require("../Models/replySchema");
const Comment = require("../Models/commentSchema");

const createReply = async (data) => {
  const comment = new Reply(data);
  await comment.save();
  const comments = await Comment.findById({ _id: data.comment });
  comments.replies.push(comments._id);
  await comments.save();
  const reply = comment.toObject();
  return { ...reply, hasLiked: false };
};

const fetchReplies = async (userId, commentId) => {
  const commentObjectId = new mongoose.Types.ObjectId(commentId);
  console.log(commentObjectId);
  const replies = await Reply.aggregate([
    {
      $match: { comment: commentObjectId },
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
        comment: 1,
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

  return replies;
};

const handleLikes = async (replyId, userId) => {
  try {
    const replydata = await Reply.findById(replyId);
    if (!replydata) {
      throw new Error("Reply not found");
    }

    const hasLiked = replydata.likes.includes(userId);

    if (hasLiked) {
      replydata.likes = replydata.likes.filter((id) => id !== userId);
    } else {
      replydata.likes.push(userId);
    }

    await replydata.save();
    const data = replydata.toObject();
    return { ...data, hasLiked: !hasLiked };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update like status");
  }
};

const deleteAllReplyComment = async (commentId, userId) => {
  const reply = await Reply.deleteMany({ comment: commentId });
  if (reply == null) throw new Error("Unauthorized access");
  return reply;
};

const deleteAllReplyPost = async (postId, userId) => {
  const reply = await Reply.deleteMany({ post: postId });
  if (reply == null) throw new Error("Unauthorized access");
  return reply;
};

const deleteReply = async (id, userId) => {
  const reply = await Reply.findByIdAndDelete({ _id: id });
  if (reply == null) throw new Error("Unauthorized access");
  return reply;
};

module.exports = {
  createReply,
  fetchReplies,
  handleLikes,
  deleteAllReplyComment,
  deleteAllReplyPost,
  deleteReply,
};
