const { default: mongoose } = require("mongoose");
const Post = require("../Models/PostSchema");

const createPost = async (data, id) => {
  const post = new Post(data);
  await post.save();
  if (!post) {
    throw new Error("Error creating new Post");
  }
  const postData = await fetchPostCreated(id, post._id);
  return postData;
};

const fetchPostCreated = async (id, postId) => {
  const posts = await Post.aggregate([
    {
      $match: { _id: postId },
    },
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
      $sort: { createdAt: -1 },
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
        "authorDetails._id": 1,
        comments: 1,
      },
    },
  ]);
  if (!posts[0]) {
    throw new Error("Error fetching the Post data");
  }
  return posts[0];
};

const fetchPosts = async (id, page, limit, friends) => {
  let friendsObjectIdArray = friends.map(
    (id) => new mongoose.Types.ObjectId(id)
  );
  friendsObjectIdArray = [
    ...friendsObjectIdArray,
    new mongoose.Types.ObjectId(id),
  ];

  const posts = await Post.aggregate([
    {
      $match: { author: { $in: friendsObjectIdArray } },
    },
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
          { $sort: { createdAt: 1 } },
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
      $sort: { createdAt: -1 },
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
        "authorDetails._id": 1,
        comments: 1,
      },
    },
  ])
    .skip((page - 1) * limit)
    .limit(limit);
  const count = await Post.countDocuments({
    author: { $in: friendsObjectIdArray },
  });

  return { posts, count };
};

const handleLikes = async (postId, userId) => {
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
