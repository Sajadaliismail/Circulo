const OTP = require("../Models/otpModel");

const otpSave = async (email, otp) => {
  try {
    const findOTP = await findOtp(email);
    if (findOTP.otp !== null) {
      await findAndUpdate({ email, otp });
    } else {
      const dbOTP = new OTP({
        email: email,
        otp: otp,
      });
      await dbOTP.save();
    }

    return true;
  } catch (error) {
    throw new Error("Server error, Please try again later");
  }
};

const findOtp = async (email) => {
  try {
    const otp = await OTP.findOne({ email: email });

    return { otp, email };
  } catch (error) {
    console.log(error);

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
