const userInteractor = require("../interactors/userInteractor");

const addressSetup = async (req, res) => {
  try {
    const userAddress = req.body;
    const userId = req.userId;
    await userInteractor.userUpdateInteractor(userId, {
      ...userAddress,
      isSetupComplete: true,
    });
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

const uploadImage = async (req, res) => {
  try {
    const userId = req.userId;
    const fileName = req.file.filename;
    await userInteractor.uploadInteractor(userId, fileName);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

module.exports = { addressSetup, fetchUser, uploadImage };
