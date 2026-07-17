import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  validateAddToCart,
  validateRemoveCartItem,
  validateUpdateCartItem,
} from "../validator/cart.validator.js";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
  createPaymentOrder,
  verifyPaymentOrder,
  getPaymentByOrderId,
  getUserPayments,
} from "../controllers/cart.controller.js";

const  router = express.Router();

/*
 * @route POST /api/cart/add
 * @desc Add item to cart
 * @access Private
 * @agruments:
 *   - productId: ID of the product to add (body)
 *   - variantId: ID of the variant to add (optional, body)
 *   - quantity: Quantity to add (optional, body, default 1)
 */
router.post(
  "/add",
  authenticateUser,
  validateAddToCart,
  addToCart,
);

/*
* @route GET /api/cart
* @desc Get user's cart
* @access Private
*/
router.get("/", authenticateUser, getCart);

/*
 * @route PATCH /api/cart/item
 * @desc Update cart item quantity
 * @access Private
 */
router.patch(
  "/item",
  authenticateUser,
  validateUpdateCartItem,
  updateCartItemQuantity,
);

/*
 * @route DELETE /api/cart/item
 * @desc Remove item from cart
 * @access Private
 */
router.delete(
  "/item",
  authenticateUser,
  validateRemoveCartItem,
  removeCartItem,
);

/*
 * @route POST /api/cart/payment/create/order
 * @desc Create payment order for cart
 * @access Private
 * @arguments:
 *   - amount: Total amount to be paid (body)
 *   - currency: Currency code (body, default "INR")
 */
router.post("/payment/create/order", authenticateUser, createPaymentOrder);

/*
  * @route POST /api/cart/payment/verify
  * @desc Verify payment after completion
  * @access Private
  * @arguments:
  *   - orderId: Razorpay order ID (body)
  *   - paymentId: Razorpay payment ID (body)
  *   - signature: Razorpay signature (body)
  */
router.post("/payment/verify/order", authenticateUser, verifyPaymentOrder);

/*
 * @route GET /api/cart/payment/user
 * @desc Fetch all paid orders for the logged-in user
 * @access Private
 * NOTE: must be declared BEFORE /payment/:orderId to avoid param collision
 */
router.get("/payment/user", authenticateUser, getUserPayments);

/*
 * @route GET /api/cart/payment/:orderId
 * @desc Fetch a payment record by Razorpay order ID
 * @access Private
 */
router.get("/payment/:orderId", authenticateUser, getPaymentByOrderId);

export default router;
