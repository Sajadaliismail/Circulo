const path = require("path");
const fs = require("fs");
const cloudinary = require("../Services/cloudinaryCloud");
const commentRepository = require("../Repositories/commentRepository");
const repliesRepostiory = require("../Repositories/repliesRepostiory");
const postRepository = require("../Repositories/postRepository");

const createCommentInteractor = async (comment, userId, postId) => {
  const commentData = {
    content: comment,
    user: userId,
    post: postId,
  };
  return await commentRepository.createcomment(commentData);
};

const handleLikeInteractor = async (commentId, userId) => {
  return await commentRepository.handleLikes(commentId, userId);
};

const fetchCommentInteractor = async (id, postId) => {
  return await commentRepository.fetchComments(id, postId);
};

const commentDeleteInteractor = async (id, userId) => {
  const result = await commentRepository.deleteComments(id, userId);
  const postId = result.post;
  await repliesRepostiory.deleteAllReplyComment(id);
  return await postRepository.deleteComments(postId, id);
};

module.exports = {
  createCommentInteractor,
  handleLikeInteractor,
  fetchCommentInteractor,
  commentDeleteInteractor,
};
