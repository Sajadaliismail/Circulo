const replyInteractors = require("../Interactors/replyInteractors");
const { publishMessage } = require("../Services/rabbitmq");

const addReply = async (req, res) => {
  try {
    const { reply, commentId, postId } = req.body;
    const userId = req.userId;
    const result = await replyInteractors.createReplyInteractor(
      reply,
      userId,
      commentId,
      postId
    );
    // console.log(result);
    const message = {
      post: result.postId,
      commentAuthor: result.commentAuthor,
      commentedBy: result.replyDetails.user,
      activity: "has replied to your comment.",
    };
    if (
      result.commentAuthor.toString() !== result.replyDetails.user.toString()
    ) {
      publishMessage("newReply", message);
    }

    return res.status(200).json({ result: result.replyDetails });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error.message });
  }
};

const fetchReply = async (req, res) => {
  try {
    const userId = req.userId;
    const { commentId } = req.query;
    console.log(req.query);
    const Replies = await replyInteractors.fetchReplyInteractor(
      userId,
      commentId
    );
    return res.status(200).json({ Replies });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "error fetching replies" });
  }
};

const handleLike = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id } = req.body;
    console.log(_id, userId);

    const comment = await replyInteractors.handleLikeInteractor(_id, userId);
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
  }
};
const deleteReply = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const result = await replyInteractors(id, userId);

    return res.status(200).json({ commentId: id });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: error.message });
  }
};
module.exports = {
  addReply,
  fetchReply,
  handleLike,
  deleteReply,
};
