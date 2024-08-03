const { object, string, number, ref } = require("yup");

const validationSchema = object({
  firstName: string().trim().required("Please enter a valid name"),
  lastName: string().trim().required("Please enter a valid name"),
  email: string().email("Invalid email").required("Email is required"),
  password: string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, "Password must be alphanumeric")
    .required("Password is required"),
  cnf_password: string()
    .oneOf([ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  birthMonth: string().required("Please enter birth month"),
  birthYear: number()
    .required("Please enter birth year")
    .test("age", "You must be at least 12 ", function (value) {
      const { birthMonth } = this.parent;
      if (!birthMonth || !value) return false;
      const today = new Date();
      const birthDate = new Date(value, birthMonth - 1);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      return age > 12 || (age === 12 && monthDiff >= 0);
    }),
});

module.exports = { validationSchema };
