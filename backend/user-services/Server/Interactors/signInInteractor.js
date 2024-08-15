const { compare } = require("bcrypt");
const userRepository = require("../Repositories/userRepository");
const generateToken = require("../Utilities/generateToken");

const signInInteractor = async (data) => {
  const { email, password } = data;

  const userData = await userRepository.findUserByEmail(email);

  if (!userData) {
    throw new Error("Email is not registered");
  }

  if (userData.isBlocked) {
    throw new Error("User is banned from the site");
  }

  const isValid = await compare(password, userData.password);
  if (!isValid) {
    throw new Error("Password is incorrect");
  }

  if (!userData.isEmailVerified) {
    return {
      email: userData.email,
      isEmailVerified: false,
      isSetupComplete: userData.isSetupComplete,
      firstName: userData.firstName,
      lastName: userData.lastName,
    };
  }

  const token = generateToken(userData._id);

  return {
    token,
    isEmailVerified: true,
    isSetupComplete: userData.isSetupComplete,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
  };
};

module.exports = signInInteractor;
