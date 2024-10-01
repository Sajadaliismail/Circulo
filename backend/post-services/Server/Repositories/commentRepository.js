const { default: mongoose } = require("mongoose");
const Comment = require("../Models/commentSchema");
const Post = require("../Models/PostSchema");

const createcomment = async (data) => {
  const comment = new Comment(data);
  await comment.save();
  const post = await Post.findById({ _id: data.post });
  post.comments.push(comment._id);
  await post.save();
  return { comment, postAuthor: post.author };
};

const deleteComments = async (id, userId) => {
  const comment = await Comment.findOneAndDelete({
    _id: id,
  });
  if (comment == null) throw new Error("Unauthorized access");
  return comment;
};

const deleteReplies = async (commentId, replyId) => {
  const comment = await Comment.findByIdAndUpdate(
    { _id: commentId },
    { $pull: { replies: replyId } }
  );
  if (comment == null) throw new Error("Error deleting the comment");
  return comment;
};

const deletePostComments = async (postId, userId) => {
  const comment = await Comment.deleteMany({ post: postId });
  if (comment == null) throw new Error("Unauthorized access");
  return comment;
};
const fetchComments = async (userId, postId) => {
  const postObjectId = new mongoose.Types.ObjectId(postId);
  const posts = await Comment.aggregate([
    {
      $match: { post: postObjectId },
    },
    {
      $addFields: {
        hasLiked: { $in: [userId, "$likes"] },
        likesCount: { $size: "$likes" },
        replyCount: { $size: "$replies" },
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
        replyCount: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
  return posts;
};

const handleLikes = async (commentId, userId) => {
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
    return { ...data, hasLiked: !hasLiked, replyCount: comment.replies.length };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update like status");
  }
};

module.exports = {
  createcomment,
  fetchComments,
  handleLikes,
  deleteComments,
  deletePostComments,
  deleteReplies,
};
