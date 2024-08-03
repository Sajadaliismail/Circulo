const path = require("path");
const fs = require("fs");

const cloudinary = require("../Services/cloudinaryCloud");
const userRepository = require("../Repositories/userRepository");
const filterUserData = require("../Utilities/filterUserData");

const userUpdateInteractor = async (id, userData) => {
  return await userRepository.findAndUpdate(id, userData);
};

const fetchUserInteractor = async (id) => {
  const result = await userRepository.findUser(id);
  const filteredUserData = filterUserData(result);
  return filteredUserData;
};

const uploadInteractor = async (userId, fileName) => {
  const filePath = path.join(__dirname, "../../assets/imgs/uploads/", fileName);
  const result = await cloudinary.uploader.upload(filePath);
  fs.unlinkSync(filePath);
  return await userRepository.findAndUpdate(userId, {
    profilePicture: result.secure_url,
  });
};

module.exports = {
  userUpdateInteractor,
  fetchUserInteractor,
  uploadInteractor,
};
