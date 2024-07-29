const { validationSchema } = require("../utilities/formValidator");

const validateForm = async (req, res, next) => {
  try {
    await validationSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    const errors = {};
    err.inner.forEach((e) => {
      errors[e.path] = e.errors[0];
    });
    console.log(errors);
    return res.status(400).json(errors);
  }
};
module.exports = validateForm;
