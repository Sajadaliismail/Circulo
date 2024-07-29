const express = require("express");

const userAuthController = require("../controllers/userAuthController");
const userOtpController = require("../controllers/userOtpController");
const userProfileController = require("../controllers/userProfileController");
const validateForm = require("../middlwares/signupValidator");
const verifyToken = require("../middlwares/authenticationJWT");
const upload = require("../middlwares/multerUpload");

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

module.exports = route;
