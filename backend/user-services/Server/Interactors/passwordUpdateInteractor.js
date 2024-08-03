const { hashPassword } = require("../Utilities/bcryptHash");
const userRepository = require("../Repositories/userRepository");

const passwordUpdateInteractor = async (email, password) => {
  const hashedPassword = await hashPassword(password);
  return await userRepository.updateUserFields(email, {
    password: hashedPassword,
  });
};

module.exports = passwordUpdateInteractor;
