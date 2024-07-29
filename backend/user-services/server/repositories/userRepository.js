const User = require("../models/userModel");

const createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  return user;
};

const findUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const findAndUpdate = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(id, { updateData });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const updateUserFields = async (email, updateData) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  Object.assign(user, updateData);
  await user.save();
  return user;
};

module.exports = {
  createUser,
  findUserByEmail,
  updateUserFields,
  findAndUpdate,
  findUser,
};
