const otpInteractor = require("../Interactors/otpInteractor");

const sendOtpEmail = async (req, res) => {
  try {
    const { email } = req.body;
    await otpInteractor.sendOtpInteractor(email);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(404).json({ error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { inputOtp, email } = req.body;

    const result = await otpInteractor.verifyOtpInteractor(inputOtp, email);

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);

    return res.status(404).json({ error: err.message });
  }
};

module.exports = { sendOtpEmail, verifyOtp };
