const userInteractor = require("../Interactors/userInteractor");
const { searchUsers } = require("../Repositories/userRepository");
const { publishMessage } = require("../Services/rabbitmq");

const addressSetup = async (req, res) => {
  try {
    const userAddress = req.body;
    const userId = req.userId;
    const user = await userInteractor.userUpdateInteractor(userId, {
      ...userAddress,
      isSetupComplete: true,
    });
    const message = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      postalCode: user.postalCode,
      email: user.email,
    };
    await publishMessage("User_signup_queue", message);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(404).json({
      error: error.message,
    });
  }
};

const fetchUser = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await userInteractor.fetchUserInteractor(userId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const fetchUserDetails = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = req.userId;

    const result = await userInteractor.fetchUserInteractor(userId, user);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ error: error.message });
  }
};

const fetchUserStatus = async (req, res) => {
  try {
    const { userId } = req.query;
    const result = await userInteractor.fetchUserStatusInteractor(userId);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ error: error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    const userId = req.userId;
    const fileName = req.file.filename;
    const result = await userInteractor.uploadInteractor(userId, fileName);
    const message = {
      _id: result._id,
      profilePicture: result.profilePicture,
    };
    await publishMessage("User_imageUpdate_que", message);

    return res.status(200).json({ success: true, message });
  } catch (error) {
    console.log(error);

    return res.status(404).json({ error: error.message });
  }
};

const searchController = async (req, res) => {
  try {
    const { search } = req.query;
    const result = await searchUsers(search);
    return res.status(200).json({ result });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ Error: "Error fetching users " });
  }
};

module.exports = {
  addressSetup,
  fetchUser,
  uploadImage,
  fetchUserDetails,
  fetchUserStatus,
  searchController,
};
