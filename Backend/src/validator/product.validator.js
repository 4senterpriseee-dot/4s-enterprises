import { body, validationResult } from "express-validator";

function validateProduct(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Vallidation error", errors: errors.array() });
  }

  next();
}

export const createProductValidator = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("description").notEmpty().withMessage("Product description is required"),
  body("priceAmount")
    .notEmpty()
    .withMessage("Product price amount is required")
    .isNumeric()
    .withMessage("Product price amount must be a number"),
  body("priceCurrency")
    .optional()
    .isIn(["USD", "EUR", "GBP", "INR", "JPY"])
    .withMessage(
      "Product price currency must be one of USD, EUR, GBP, INR, JPY",
    ),
  validateProduct,
];
