const { hashPassword } = require("../Utilities/bcryptHash");
const userRepository = require("../Repositories/userRepository");

const createUserInteractor = async (data) => {
  const { firstName, lastName, email, password, birthMonth, birthYear } = data;
  const hashedPassword = await hashPassword(password);
  const user = {
    firstName,
    lastName,
    email: email.toLowerCase(),
    password: hashedPassword,
    birthMonth,
    birthYear,
  };
  return userRepository.createUser(user);
};

module.exports = createUserInteractor;
