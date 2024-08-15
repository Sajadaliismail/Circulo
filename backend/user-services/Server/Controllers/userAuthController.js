const createUserInteractor = require("../Interactors/createUserInteractor");
const passwordUpdateInteractor = require("../Interactors/passwordUpdateInteractor");
const signInInteractor = require("../Interactors/signInInteractor");

const signupUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await createUserInteractor(userData);
    return res.status(200).json({ email: user.email });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(401).json({ error: "Email already registered" });
    }
    return res.status(404).json({ error: "Server error, Try after some time" });
  }
};

const signInUser = async (req, res) => {
  try {
    const userData = req.body;
    const result = await signInInteractor(userData);

    if (result.isEmailVerified === false) {
      return res.status(206).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    if (error.message === "Email is not registered") {
      return res.status(402).json({ error: error.message });
    }
    if (error.message === "User is banned from the site") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === "Password is incorrect") {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: "Server error, try after some time" });
  }
};

const updatePassword = async (req, res) => {
  console.log(req.body);

  try {
    const { email, password } = req.body;
    await passwordUpdateInteractor(email, password);
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);

    return res.status(404).json({ error: error.message });
  }
};

module.exports = { signupUser, signInUser, updatePassword };
