const postsInteractor = require("../Interactors/postsInteractor");
const { publishMessage } = require("../Services/rabbitmq");

const addPosts = async (req, res) => {
  try {
    const { post } = req.body;
    const fileName = req.file?.filename;
    const userId = req.userId;
    const result = await postsInteractor.createPostInteractor(
      fileName,
      post,
      userId
    );
    const message = {
      _id: userId,
      postId: result._id,
    };
    publishMessage("post_created", message);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);

    return res.status(401).json({ error: error.message });
  }
};

const fetchPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const response = await fetch(
      `http://localhost:3006/friends/api/friendsListUser/${userId}`
    );

    const friends = await response.json();
    if (response.ok) {
      const { page, limits } = req.query;
      const data = await postsInteractor.fetchPostInteractor(
        userId,
        parseInt(page),
        parseInt(limits),
        friends.friends
      );
      return res.status(200).json({ posts: data.posts, count: data.count });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleLike = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id } = req.body;
    const post = await postsInteractor.handleLikeInteractor(_id, userId);
    return res.status(200).json({ post });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false });
  }
};
module.exports = {
  addPosts,
  fetchPosts,
  handleLike,
};
