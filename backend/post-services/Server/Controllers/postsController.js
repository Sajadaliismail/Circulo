const postsInteractor = require("../Interactors/postsInteractor");
const { publishMessage } = require("../Services/rabbitmq");
const FRIENDS_BACKEND = process.env.FRIENDS_BACKEND;

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
      `${FRIENDS_BACKEND}/friends/api/friendsListUser`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Cookie: cookies,
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Error from friends service: ${response.status} ${response.statusText}`
      );
      return res.status(response.status).json({
        error: `Failed to fetch friends: ${response.statusText}`,
      });
    }

    // Attempt to parse JSON response
    let friends;
    try {
      friends = await response.json();
    } catch (err) {
      console.error("Error parsing JSON response:", err);
      return res.status(500).json({
        error: "Failed to parse response from friends service",
      });
    }

    // Ensure the response contains the expected structure
    if (!friends || !friends.friends) {
      console.error("Invalid response structure from friends service");
      return res.status(500).json({
        error: "Invalid response from friends service",
      });
    }

    const data = await postsInteractor.fetchPostInteractor(
      userId,
      friends.friends
    );

    // Respond with the fetched posts
    return res.status(200).json({ posts: data.posts, count: data.count });
  } catch (error) {
    // Handle unexpected errors
    console.error("Unexpected error in fetchPosts:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while fetching posts",
    });
  }
};

const fetchUserPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const cookies = req.headers.cookie;

    const response = await fetch(`${FRIENDS_BACKEND}/friends/relation/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: cookies || "",
      },
    });

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
    return res.status(401).json({ error: "error fetching data" });
  }
};

const handleLike = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id } = req.body;
    const post = await postsInteractor.handleLikeInteractor(_id, userId);
    if (!post.isLiked) {
      const message = {
        post: post.post._id,
        postAuthor: post.post.author,
        likedBy: userId,
        activity: "has liked your post.",
      };
      if (post.post.author.toString() !== userId.toString()) {
        publishMessage("newLike", message);
      }
    }
    return res.status(200).json({ post: post.post });
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
