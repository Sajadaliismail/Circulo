const OTP = require("../models/otpModel");

const otpSave = async (email, otp) => {
  try {
    const findOTP = await findOtp({ email });
    if (findOTP !== null) {
      await findAndUpdate({ email, otp });
    } else {
      const dbOTP = new OTP({
        email,
        otp,
      });
      await dbOTP.save();
    }
    return true;
  } catch (error) {
    throw new Error("Server error, Please try again later");
  }
};

const findOtp = async ({ email }) => {
  try {
    const otp = await OTP.findOne({ email: email });
    return otp;
  } catch (error) {
    throw new Error("Error fetching OTP");
  }
};

const findAndUpdate = async ({ email, otp }) => {
  try {
    await OTP.findOneAndUpdate({ email: email }, { otp: otp });
    return true;
  } catch (error) {
    throw new Error("Error updating OTP");
  }
};
module.exports = { otpSave, findOtp };
