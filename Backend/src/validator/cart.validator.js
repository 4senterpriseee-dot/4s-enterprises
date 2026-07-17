import { body, validationResult } from "express-validator";


const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const validateAddToCart = [
  body("productId").isMongoId().withMessage("Invalid product ID"),
  body("variantId").optional({ nullable: true }).isMongoId().withMessage("Invalid variant ID"),
  body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
  validateRequest,
];

export const validateUpdateCartItem = [
  body("itemId").isMongoId().withMessage("Invalid cart item ID"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  validateRequest,
];

export const validateRemoveCartItem = [
  body("itemId").isMongoId().withMessage("Invalid cart item ID"),
  validateRequest,
];