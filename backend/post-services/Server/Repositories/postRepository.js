const Post = require("../Models/PostSchema");

const createPost = async (data) => {
  const post = new Post(data);
  await post.save();
  return post._id;
};

const fetchPosts = async (id, page, limit) => {
  const posts = await Post.aggregate([
    {
      $addFields: {
        hasLiked: { $in: [id, "$likes"] },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    {
      $unwind: "$authorDetails",
    },
    {
      $lookup: {
        from: "comments",
        let: { postId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$post", "$$postId"] } } },
          { $sort: { createdAt: -1 } },
          { $limit: 10 },
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
              content: 1,
              likes: 1,
              likesCount: 1,
              createdAt: 1,
              "userDetails.firstName": 1,
            },
          },
        ],
        as: "comments",
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        image: 1,
        likes: 1,
        likesCount: 1,
        createdAt: 1,
        updatedAt: 1,
        hasLiked: 1,
        "authorDetails.profilePicture": 1,
        "authorDetails.firstName": 1,
        comments: 1,
      },
    },
  ])
    .skip((page - 1) * limit)
    .limit(limit);
  const count = await Post.countDocuments();
  console.log(posts);
  return { posts, count };
};

const handleLikes = async (postId, userId) => {
  console.log(userId, postId);
  try {
    const post = await Post.findById(postId._id);
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

module.exports = { createPost, fetchPosts, handleLikes };
