const otpGenerator = require("otp-generator");

/**
 * Generates a one-time password (OTP).
 * @returns {string} 
 */
const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
};

module.exports = generateOTP;
