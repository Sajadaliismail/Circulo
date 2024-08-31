const path = require("path");
const fs = require("fs");
const cloudinary = require("../Services/cloudinaryCloud");
const postRepository = require("../Repositories/postRepository");
const commentRepository = require("../Repositories/commentRepository");
const repliesRepostiory = require("../Repositories/repliesRepostiory");

const createPostInteractor = async (fileName, post, userId) => {
  let imageUrl = "";
  if (fileName) {
    const filePath = path.join(
      __dirname,
      "../../assets/imgs/uploads/",
      fileName
    );
    const result = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath);
    imageUrl = result.secure_url;
    imagePublicId = result.public_id;
  }
  const postData = {
    content: post,
    image: imageUrl,
    author: userId,
    imageId: imagePublicId,
  };

  return await postRepository.createPost(postData, userId);
};

const handleLikeInteractor = async (postId, userId) => {
  return await postRepository.handleLikes(postId, userId);
};

const fetchPostInteractor = async (id, friends) => {
  return await postRepository.fetchPosts(id, friends);
};
const fetchUserPostInteractor = async (id) => {
  return await postRepository.fetchUserPosts(id);
};

const fetchPostDataInteractor = async (id, postId) => {
  return await postRepository.fetchPost(id, postId);
};

const postDeleteInteractor = async (id, userId) => {
  const result = await postRepository.deletePosts(id, userId);
  if (result?.imageId) {
    await cloudinary.uploader.destroy(result.imageId, (err, res) => {
      if (err) throw new Error("Error during post or image deletion:");
    });
  }

  await commentRepository.deletePostComments(id);
  await repliesRepostiory.deleteAllReplyPost(id);
  return true;
};
module.exports = {
  createPostInteractor,
  handleLikeInteractor,
  fetchPostInteractor,
  fetchPostDataInteractor,
  postDeleteInteractor,
  fetchUserPostInteractor,
};
