const path = require("path");
const repliesRepostiory = require("../Repositories/repliesRepostiory");
const commentRepository = require("../Repositories/commentRepository");

const createReplyInteractor = async (reply, userId, commentId, postId) => {
  const commentData = {
    content: reply,
    user: userId,
    comment: commentId,
    post: postId,
  };
  return await repliesRepostiory.createReply(commentData);
};

const handleLikeInteractor = async (commentId, userId) => {
  return await repliesRepostiory.handleLikes(commentId, userId);
};

const fetchReplyInteractor = async (id, commentId) => {
  return await repliesRepostiory.fetchReplies(id, commentId);
};

const replyDeleteInteractor = async (id, userId) => {
  const result = await repliesRepostiory.deleteReply(id, userId);
  const commentId = result.comment;
  return await commentRepository.deleteReplies(commentId, id);
};

module.exports = {
  createReplyInteractor,
  handleLikeInteractor,
  fetchReplyInteractor,
  replyDeleteInteractor,
};
