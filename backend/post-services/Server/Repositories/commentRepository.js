const { default: mongoose } = require("mongoose");
const Comment = require("../Models/commentSchema");
const Post = require("../Models/PostSchema");

const createcomment = async (data) => {
  const comment = new Comment(data);
  await comment.save();
  return true;
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
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true,
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
        "userDetails.firstName": 1,
        "userDetails.profilePicture": 1,
      },
    },
  ]);

  console.log(posts);
  return posts;
};

const handleLikes = async (postId, userId) => {
  console.log(userId);
  try {
    const post = await Comment.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return post;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update like status");
  }
};

module.exports = { createcomment, fetchComments, handleLikes };
