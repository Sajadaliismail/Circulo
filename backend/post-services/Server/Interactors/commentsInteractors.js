const path = require("path");
const fs = require("fs");
const cloudinary = require("../Services/cloudinaryCloud");
const commentRepository = require("../Repositories/commentRepository");

const createCommentInteractor = async (comment, userId, postId) => {
  const commentData = {
    content: comment,
    user: userId,
    post: postId,
  };
  return await commentRepository.createcomment(commentData);
};

const handleLikeInteractor = async (commentId, userId) => {
  await commentRepository.handleLikes(commentId, userId);
};

const fetchCommentInteractor = async (id, postId) => {
  return await commentRepository.fetchComments(id, postId);
};

module.exports = {
  createCommentInteractor,
  handleLikeInteractor,
  fetchCommentInteractor,
};
