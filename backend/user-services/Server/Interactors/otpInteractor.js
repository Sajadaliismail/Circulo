const otpRepository = require("../Repositories/otpRepository");
const userRepository = require("../Repositories/userRepository");

const generateOTP = require("../Utilities/generateOtp");
const sendMail = require("../Services/emailService");
const {
  generateToken,
  generateRefreshToken,
} = require("../Utilities/generateToken");

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
  const result = await otpRepository.findOtp(email);
  if (!result) {
    throw new Error("OTP not found");
  }

  if (result?.otp?.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  const user = await userRepository.updateUserFields(
    email,
    {
      isEmailVerified: true,
    },
    { new: true }
  );
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return {
    refreshToken,
    token,
    email,
    isEmailVerified: user.isEmailVerified,
    isSetupComplete: user.isSetupComplete,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};

module.exports = { sendOtpInteractor, verifyOtpInteractor };
