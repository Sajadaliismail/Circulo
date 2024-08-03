const commentsInteractors = require("../Interactors/commentsInteractors");

const addComment = async (req, res) => {
  console.log(req.body);
  try {
    const { comment, postId } = req.body;
    const userId = req.userId;
    await commentsInteractors.createCommentInteractor(comment, userId, postId);

    return res.status(200).json({ success: true });
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
    await commentsInteractors.handleLikeInteractor(_id, userId);
    return res.status(200);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addComment,
  fetchComment,
  handleLike,
};
