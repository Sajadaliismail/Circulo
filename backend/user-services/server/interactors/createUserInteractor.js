const { hashPassword } = require("../utilities/bcryptHash");
const userRepository = require("../repositories/userRepository");

const createUserInteractor = async (data) => {
  const { firstName, lastName, email, password, birthMonth, birthYear } = data;
  const hashedPassword = await hashPassword(password);
  const user = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    birthMonth,
    birthYear,
  };
  return userRepository.createUser(user);
};

module.exports = createUserInteractor;
