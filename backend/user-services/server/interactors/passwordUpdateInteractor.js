const { hashPassword } = require("../utilities/bcryptHash");
const userRepository = require("../repositories/userRepository");

const passwordUpdateInteractor = async (email, password) => {
  const hashedPassword = await hashPassword(password);
  return await userRepository.updateUserFields(email, {
    password: hashedPassword,
  });
};

module.exports = passwordUpdateInteractor;
