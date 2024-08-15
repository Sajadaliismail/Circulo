const path = require("path");
const fs = require("fs");
const cloudinary = require("../Services/cloudinaryCloud");
const postRepository = require("../Repositories/postRepository");

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
  }
  const postData = {
    content: post,
    image: imageUrl,
    author: userId,
  };

  return await postRepository.createPost(postData);
};

const handleLikeInteractor = async (postId, userId) => {
  return await postRepository.handleLikes(postId, userId);
};

const fetchPostInteractor = async (id, page, limit, friends) => {
  return await postRepository.fetchPosts(id, page, limit, friends);
};

module.exports = {
  createPostInteractor,
  handleLikeInteractor,
  fetchPostInteractor,
};
