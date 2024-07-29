const path = require("path");
const fs = require("fs");
const { User } = require("../../Database/MongoDb/userSchema");
const { filterUserData } = require("../../services/utilities");
const cloudinary = require("../../services/cloudinary");

const addressSetup = async (req, res) => {
  try {
    const { city, state, country, postalCode } = req.body;
    const userId = req.userId;
    await User.findByIdAndUpdate(userId, {
      city,
      state,
      country,
      postalCode,
      isSetupComplete: true,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(404)
      .json({
        error: "Error updating the address, please try again later",
        success: false,
      });
  }
};

const fetchUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const filteredUserData = filterUserData(user);

    return res.status(200).json({ userData: filteredUserData });
  } catch (error) {}
};

const uploadImage = async (req, res) => {
  try {
    const userId = req.userId;
    const filePath = path.join("assets/imgs/uploads/", req.file.filename);
    const result = await cloudinary.uploader.upload(filePath);
    const user = await User.findById(userId)
    user.profilePicture = result.secure_url
    await user.save()
    await fs.unlinkSync(filePath);
    return res.status(200).json({success:true})
  } catch (error) {
    console.log(error);
    return res.status(404).json({error:'error uploading image'})
  }
};

module.exports = { addressSetup, fetchUser, uploadImage };
