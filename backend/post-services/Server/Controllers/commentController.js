const commentsInteractors = require("../Interactors/commentsInteractors");
const { publishMessage } = require("../Services/rabbitmq");

const addComment = async (req, res) => {
  try {
    const { comment, postId } = req.body;
    const userId = req.userId;
    const result = await commentsInteractors.createCommentInteractor(
      comment,
      userId,
      postId
    );

    const data = {
      _id: result.comment._id,
      post: result.comment.post,
      user: result.comment.user,
      content: result.comment.content,
      likes: result.comment.likes,
      hasLiked: false,
      createdAt: result.comment.createdAt,
      likesCount: 0,
    };

    const message = {
      post: result.comment.post,
      postAuthor: result.postAuthor,
      commentedBy: result.comment.user,
      activity: "has commented on your post.",
    };
    if (result.postAuthor.toString() !== result.comment.user.toString()) {
      publishMessage("newComment", message);
    }
    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error.message });
  }
};

const fetchComment = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.query;

    const posts = await commentsInteractors.fetchCommentInteractor(
      userId,
      postId
    );
    // console.log(posts);
    return res.status(200).json({ posts: posts });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

const handleLike = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id } = req.body;
    console.log(_id, userId);

    const comment = await commentsInteractors.handleLikeInteractor(_id, userId);
    if (comment.hasLiked) {
      const message = {
        post: comment.post,
        postAuthor: comment.user,
        likedBy: userId,
        activity: "has liked your comment.",
      };
      if (comment.user.toString() !== userId.toString()) {
        publishMessage("newLike", message);
      }
    }
    return res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const result = await commentsInteractors.commentDeleteInteractor(
      id,
      userId
    );

    return res.status(200).json({ commentId: id });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: error.message });
  }
};
module.exports = {
  addComment,
  fetchComment,
  handleLike,
  deleteComment,
};
