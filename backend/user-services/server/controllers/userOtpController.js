const generateOTP = require("../utilities/generateOtp");
const otpInteractor = require("../interactors/otpInteractor");

const sendOtpEmail = async (req, res) => {
  try {
    const { email } = req.body;
    await otpInteractor.sendOtpInteractor(email);

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(404).json({ success: false, message: err.message });
  }
};

const verifyOtp = async (req, res) => {
  console.log(req.body);
  try {
    const { inputOtp, email } = req.body;
    const result = await otpInteractor.verifyOtpInteractor(inputOtp, email);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

module.exports = { sendOtpEmail, verifyOtp };
