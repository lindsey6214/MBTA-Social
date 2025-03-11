const z = require("zod");

// Validates new user sign-up
const newUserValidation = (data) => {
  const registerValidationSchema = z.object({
    email: z.string().email("Please input a valid email"),
    password: z
      .string()
      .min(8, "Password must be 8 or more characters")
      .max(128, "Password must be 128 characters or less")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      )
      .trim(),
    birthdate: z
      .string()
      .refine((date) => {
        const birthDateObj = new Date(date);
        const today = new Date();
        const minAgeDate = new Date(
          today.getFullYear() - 13,
          today.getMonth(),
          today.getDate()
        );
        return birthDateObj <= minAgeDate;
      }, "Users must be at least 13 years old to sign up."),
  });

  return registerValidationSchema.safeParse(data);
};

// Validates user login
const userLoginValidation = (data) => {
  const loginValidationSchema = z.object({
    email: z.string().email("Please input a valid email"),
    password: z.string().min(8, "Password must be 8 or more characters").trim(),
  });

  return loginValidationSchema.safeParse(data);
};

module.exports.newUserValidation = newUserValidation;
module.exports.userLoginValidation = userLoginValidation;