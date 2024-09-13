import { number, object, ref, string } from "yup";

export const validationSchema = object({
  firstName: string().trim().required("Please enter a valid name"),
  lastName: string().trim().required("Please enter a valid name"),
  email: string()
    .email("Invalid email format")
    .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format")
    .required("Email is required"),
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
      if (!birthMonth || !value) {
        return false;
      }
      const today = new Date();
      const birthDate = new Date(value, birthMonth - 1);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      return age > 12 || (age === 12 && monthDiff >= 0);
    }),
});

export const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export const currentYear = new Date().getFullYear();
export const currentMonth = new Date().getMonth() + 1;
export const years = Array.from(
  new Array(currentYear - 1950 + 1),
  (val, index) => 1950 + index
);

export const errorState = {
  firstName: { error: false, message: "" },
  lastName: { error: false, message: "" },
  email: { error: false, message: "" },
  password: { error: false, message: "" },
  cnf_password: { error: false, message: "" },
  birthMonth: { error: false, message: "" },
  birthYear: { error: false, message: "" },
};
export const formValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  cnf_password: "",
  birthMonth: currentMonth === 13 ? 1 : currentMonth,
  birthYear: currentYear,
};

export const validateForm = async (data) => {
  try {
    await validationSchema.validate(data, { abortEarly: false });
    return null;
  } catch (err) {
    const newErrors = JSON.parse(JSON.stringify(errorState));
    err.inner.forEach((error) => {
      newErrors[error.path].error = true;
      newErrors[error.path].message = error.message;
    });
    return newErrors;
  }
};
