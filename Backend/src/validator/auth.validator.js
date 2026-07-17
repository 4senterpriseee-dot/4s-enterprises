import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const validateRegisterUser = [
  body("email").isEmail().withMessage("Invalid email format"),

  body("contact")
    .if(body("googleId").not().exists()) // only required if NOT Google
    .isMobilePhone()
    .withMessage("Invalid contact number"),

  body("password")
    .if(body("googleId").not().exists()) // only required if NOT Google
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("fullname")
    .notEmpty()
    .withMessage("fullname is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("isSeller")
    .optional()
    .isBoolean()
    .withMessage("isSeller must be a boolean value"),

  validateRequest,
];

export const validateLoginUser = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage("Invalid password"),
  validateRequest,
];