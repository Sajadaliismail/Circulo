const User = require("../Models/userModel");
const haversineDistance = require("../Utilities/distanceCalculator");

const createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  return user;
};

const findUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const searchUsers = async (input) => {
  try {
    const regex = new RegExp(input, "i");

    const users = await User.aggregate([
      {
        $match: {
          $or: [
            { firstName: { $regex: regex } },
            { lastName: { $regex: regex } },
            { email: { $regex: regex } },
          ],
        },
      },
      {
        $project: {
          profilePicture: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
        },
      },
    ]);

    return users;
  } catch (error) {
    console.error("Error searching for users:", error);
    throw error;
  }
};

async function getDistanceBetweenUsers(userId1, userId2) {
  try {
    if (!userId1 || !userId2) throw new Error("invalid userId");
    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);

    if (!user1 || !user2) {
      throw new Error("One or both users not found");
    }

    const distance = haversineDistance(
      user1.location.coordinates,
      user2.location.coordinates
    );

    return distance;
  } catch (error) {
    console.error("Error calculating distance:", error.message);
  }
}

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

const deletePost = async (data) => {
  try {
    const { _id, postId } = data;
    const user = await User.findByIdAndUpdate(
      _id,
      { $pull: { posts: postId } },
      { new: true, useFindAndModify: false }
    );
    console.log("Db updated");
  } catch (error) {
    console.error("Error deleting post:", error.message);
  }
};

const updateStatus = async (data) => {
  try {
    const { _id, onlineStatus } = data;
    if (!_id) throw new Error("Id undefined");
    await User.findByIdAndUpdate(
      { _id },
      { onlineStatus: onlineStatus, onlineTime: Date.now() }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  updateUserFields,
  findAndUpdate,
  findUser,
  updatePost,
  deletePost,
  updateStatus,
  getDistanceBetweenUsers,
  searchUsers,
};
