const { User, OTP } = require("../../Database/MongoDb/userSchema");
const bcrypt = require("bcrypt");
const sendMail = require("../../services/nodeMailer");
const generateOTP = require("../../services/generateOTP");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, birthMonth, birthYear } =
      req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      birthMonth,
      birthYear,
    });
    await user.save();
    return res.status(200).json({ success: "Account created", email: user.email });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(401).json({ error: "Email already registered" });
    }
    return res.status(404).json({ error: "Server error, Try after some time" });
  }
};

const signin = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email: email });
    if (!userData) {
      return res.status(404).json({ error: "Email is not registered" });
    }
    if (userData) {
      if (userData.isBlocked) {
        return res.status(404).json({ error: "User is banned from the site" });
      }
      if (!userData.isEmailVerified) {
        return res.status(200).json({ message: "Email is not verified" });
      }
      const isValid = await bcrypt.compare(password, userData.password);

      const token = jwt.sign({ userId: userData.id }, secret, {
        expiresIn: "1d",
      });
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      return res.status(200).json({ success: true });
    }
  } catch (error) {
   
    return res.status(404).json({ error: "Server error, Try after some time" });
  }
};

const sendOtpEmail = async (req, res) => {
  console.log(req.body);
  try {
    const otpUser = generateOTP();
    const { email } = req.body;
    console.log(otpUser);
    await sendMail({
      to: email,
      OTP: otpUser,
    });

    const findOTP = await OTP.findOne({ email: email });
    if (findOTP !== null) {
      await OTP.findOneAndUpdate({ email: email }, { otp: otpUser });
    } else {
      const otp = new OTP({
        email: email,
        otp: otpUser,
      });
      await otp.save();
    }
    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

const verifyOtp = async (req, res) => {
  console.log(req.cookies);
  console.log(req.body);

  try {
    const { inputOtp, email } = req.body;
    const findOtp = await OTP.findOne({ email: email });
    if (inputOtp === findOtp.otp) {
      const user = await User.findOne({ email: email });
      user.isEmailVerified = true;
      await user.save();
      const token = jwt.sign({ userId: user.id }, secret, {
        expiresIn: "1d",
      });
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      return res.status(200).json({ message: "OTP verified", success: true });
    } else {
      return res.status(401).json({ message: "Invalid OTP", success: false });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = { signup, sendOtpEmail, verifyOtp ,signin};
