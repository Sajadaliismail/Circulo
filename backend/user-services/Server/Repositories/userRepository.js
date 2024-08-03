const User = require("../Models/userModel");

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
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }

  // Update user fields
  Object.assign(user, updateData);

  // Save the updated user (triggers pre-save hook)
  await user.save();

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

const updatePost = async (data) => {
  try {
    const { _id, postId } = data;
    const user = await User.findByIdAndUpdate(
      _id,
      { $push: { posts: postId } },
      { new: true, useFindAndModify: false }
    );
    console.log("Db updated");
  } catch (error) {}
};

module.exports = {
  createUser,
  findUserByEmail,
  updateUserFields,
  findAndUpdate,
  findUser,
  updatePost,
};
