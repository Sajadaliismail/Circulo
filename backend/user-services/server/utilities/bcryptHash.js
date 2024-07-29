const bcrypt = require("bcrypt");
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const compare = async (password, dbpassword) => {
  const result = await bcrypt.compare(password, userData.password);
  return result;
};
module.exports = { hashPassword, compare };
