const express = require("express");

const userAuthController = require("../Controllers/userAuthController");
const userOtpController = require("../Controllers/userOtpController");
const userProfileController = require("../Controllers/userProfileController");
const validateForm = require("../Middlwares/signupValidator");
const verifyToken = require("../Middlwares/authenticationJWT");
const upload = require("../Middlwares/multerUpload");

const route = express.Router();

route.post("/signup", validateForm, userAuthController.signupUser);
route.post("/signin", userAuthController.signInUser);
route.post("/sendotp", userOtpController.sendOtpEmail);
route.post("/verifyotp", userOtpController.verifyOtp);

route.patch("/updatepassword", userAuthController.updatePassword);

route.post(
  "/uploadImage",
  verifyToken,
  upload.single("image"),
  userProfileController.uploadImage
);
route.post("/updateaddress", verifyToken, userProfileController.addressSetup);
route.get("/fetchuser", verifyToken, userProfileController.fetchUser);

route.get(
  "/fetchUserData",
  verifyToken,
  userProfileController.fetchUserDetails
);

module.exports = route;
