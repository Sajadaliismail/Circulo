const otpRepository = require("../repositories/otpRepository");
const userRepository = require("../repositories/userRepository");

const generateOTP = require("../utilities/generateOtp");
const sendMail = require("../services/emailService");
const generateToken = require("../utilities/generateToken");

const sendOtpInteractor = async (email) => {
  const otp = generateOTP();
  console.log(otp);
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error("Email is not registered.");
  }

  await sendMail({ to: email, OTP: otp });

  return otpRepository.otpSave(email, otp);
};

const verifyOtpInteractor = async (otp, email) => {
  const result = await otpRepository.findOtp({ email });
  if (!result) {
    throw new Error("OTP not found");
  }

  if (result.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  const user = await userRepository.updateUserFields(email, {
    isEmailVerified: true,
  });
  const token = generateToken(user._id);

  return {
    token,
    message: "OTP verified",
    isEmailVerified: true,
    isSetupComplete: user.isSetupComplete,
    firstName: user.firstName,
    email: user.email,
  };
};

module.exports = { sendOtpInteractor, verifyOtpInteractor };
