const commentsInteractors = require("../Interactors/commentsInteractors");

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
      _id: result._id,
      post: result.post,
      user: result.user,
      content: result.content,
      likes: result.likes,
      hasLiked: false,
      createdAt: result.createdAt,
      likesCount: 0,
    };

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
    console.log(req.query);
    const posts = await commentsInteractors.fetchCommentInteractor(
      userId,
      postId
    );
    // console.log(posts);
    return res.status(200).json({ posts: posts });
  } catch (error) {
    console.log(error);
  }
};

const handleLike = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id } = req.body;
    console.log(_id, userId);

    const comment = await commentsInteractors.handleLikeInteractor(_id, userId);
    return res.status(200).json(comment);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addComment,
  fetchComment,
  handleLike,
};
