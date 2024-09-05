const postsInteractor = require("../Interactors/postsInteractor");
const { publishMessage } = require("../Services/rabbitmq");
const FRIENDS_BACKEND = process.env.FRIENDS_BACKEND;

const addPosts = async (req, res) => {
  console.log("ethy");

  try {
    const { post } = req.body;
    const fileName = req.file?.filename;
    const userId = req.userId;
    const result = await postsInteractor.createPostInteractor(
      fileName,
      post,
      userId
    );

    // const message = {
    //   _id: userId,
    //   postId: result._id,
    // };
    // publishMessage("post_created", message);
    return res.status(200).json({ result });
  } catch (error) {
    console.log(error);

    return res.status(401).json({ error: error.message });
  }
};

const fetchPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const cookies = req.headers.cookie;
    const response = await fetch(
      `http://localhost:3006/friends/api/friendsListUser`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Cookie: cookies,
        },
      }
    );

    const friends = await response.json();

    if (response.ok) {
      const { page, limits } = req.query;

      const data = await postsInteractor.fetchPostInteractor(
        userId,
        friends.friends
      );

      return res.status(200).json({ posts: data.posts, count: data.count });
    }
    return res.status(400).json({ error: "Error fetching posts" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Error fetching posts" });
  }
};

const fetchUserPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const cookies = req.headers.cookie;

    const response = await fetch(
      `http://localhost:3006/friends/relation/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Cookie: cookies || "", // Handle if cookies is undefined
        },
      }
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch relation data" });
    }

    const relation = await response.json();

    if (!relation.relation) {
      return res.status(400).json({ error: "Invalid User" });
    }

    const { relation: relationShip, friendsCount } = relation.relation;
    const data = await postsInteractor.fetchUserPostInteractor(id);

    let responseBody = {
      posts:
        relationShip === "FRIENDS" || relationShip === "SELF"
          ? data.posts
          : null,
      count: data.count,
      relation: relationShip,
      friendsCount,
    };

    return res.status(200).json(responseBody);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: error.message });
  }
};

const fetchPostData = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const data = await postsInteractor.fetchPostDataInteractor(userId, id);

    return res.status(200).json({ data });
  } catch (error) {
    console.log(error.message);
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

const deletePosts = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const result = await postsInteractor.postDeleteInteractor(id, userId);
    // const message = {
    //   _id: userId,
    //   postId: id,
    // };
    // publishMessage("post_deleted", message);
    return res.status(200).json({ postId: id });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: error.message });
  }
};
module.exports = {
  addPosts,
  fetchPosts,
  handleLike,
  fetchPostData,
  deletePosts,
  fetchUserPosts,
};
