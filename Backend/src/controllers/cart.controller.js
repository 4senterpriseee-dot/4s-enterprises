import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import paymentModel from "../models/payment.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import { createOrder } from "../services/payment.service.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";

const buildCartPayload = async (userId) => {
  const cart = await cartModel
    .findOne({ userId })
    .populate("items.product", "name price images");

  if (!cart) {
    return {
      cart: { items: [] },
      subtotal: 0,
    };
  }

  const updatedItems = cart.items.map((item) => {
    const originalPrice = item.price?.amount || 0;
    const parsedCurrentPrice = Number(item.product?.price?.amount);
    const currentPrice = Number.isFinite(parsedCurrentPrice)
      ? parsedCurrentPrice
      : originalPrice;

    return {
      ...item.toObject(),
      currentPrice,
    };
  });

  const subtotal = updatedItems.reduce(
    (acc, item) =>
      acc +
      (item.currentPrice ?? item.price?.amount ?? 0) * (item.quantity || 0),
    0,
  );

  return {
    cart: {
      ...cart.toObject(),
      items: updatedItems,
    },
    subtotal,
  };
};

export const addToCart = async (req, res) => {
  const { productId, variantId, quantity = 1, size = null } = req.body;
  const userId = req.user._id;

  try {
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    let variantData = null;

    if (variantId) {
      variantData = product.variants?.find(
        (v) => v._id.toString() === variantId,
      );

      if (!variantData) {
        return res.status(404).json({
          message: "Variant not found",
          success: false,
        });
      }
    }

    const stock = variantData
      ? await stockOfVariant(productId, variantId)
      : product.stock || 999;

    if (!stock || stock <= 0) {
      return res.status(400).json({
        message: "Out of stock",
        success: false,
      });
    }

    const cart =
      (await cartModel.findOne({ userId })) ||
      (await cartModel.create({ userId, items: [] }));

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        (variantId ? item.variant?.toString() === variantId : !item.variant) &&
        item.size === size,
    );

    if (existingItem) {
      const quantityInCart = existingItem.quantity;

      if (quantityInCart + quantity > stock) {
        return res.status(400).json({
          message: `Cannot add ${quantity} items. Only ${
            stock - quantityInCart
          } left in stock.`,
          success: false,
        });
      }

      existingItem.quantity += quantity;
      await cart.save();
      const payload = await buildCartPayload(userId);

      return res.status(200).json({
        message: "Cart updated successfully",
        cart: payload.cart,
        subtotal: payload.subtotal,
        success: true,
      });
    }

    if (quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} left in stock.`,
        success: false,
      });
    }

    const snapshot = {
      product: productId,
      variant: variantId || null,
      size: size || null,
      price: {
        amount: product.price?.amount || 0,
        currency: product.price?.currency || "INR",
      },
      quantity,
    };

    cart.items.push(snapshot);
    await cart.save();
    const payload = await buildCartPayload(userId);

    return res.status(200).json({
      message: "Item added to cart successfully",
      cart: payload.cart,
      subtotal: payload.subtotal,
      success: true,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = req.user;
    const payload = await buildCartPayload(user._id);

    return res.status(200).json({
      message: "Cart fetched successfully",
      cart: payload.cart,
      subtotal: payload.subtotal,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
        success: false,
      });
    }

    item.quantity = quantity;
    await cart.save();
    const payload = await buildCartPayload(userId);

    return res.status(200).json({
      message: "Cart item updated successfully",
      cart: payload.cart,
      subtotal: payload.subtotal,
      success: true,
    });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const removeCartItem = async (req, res) => {
  const { itemId } = req.body;
  const userId = req.user._id;

  try {
    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
        success: false,
      });
    }

    item.deleteOne();
    await cart.save();
    const payload = await buildCartPayload(userId);

    return res.status(200).json({
      message: "Cart item removed successfully",
      cart: payload.cart,
      subtotal: payload.subtotal,
      success: true,
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const { cart, subtotal } = await buildCartPayload(userId);

    if (!cart?.items?.length) {
      return res.status(400).json({
        message: "Cart is empty",
        success: false,
      });
    }

    if (!subtotal || subtotal <= 0) {
      return res.status(400).json({
        message: "Invalid cart total",
        success: false,
      });
    }

    const order = await createOrder({
      amount: subtotal,
      currency: "INR",
    });

    const currency = cart.items?.[0]?.price?.currency || "INR";

    const payment = await paymentModel.create({
      userId: req.user._id, // ✅ fixed
      razorpay: {
        orderId: order.id,
      },
      price: {
        amount: subtotal,
        currency,
      },
      orderItems: cart.items.map((item) => ({
        title: item.product.name,
        productId: item.product._id,
        variantId: item.variant,
        size: item.size,
        quantity: item.quantity,
        images: item.product.images?.[0] || { url: "" },
        description: item.product.description || "",
        price: {
          amount: item.currentPrice || item.price.amount,
          currency: item.price.currency,
        },
      })),
    });

    return res.status(200).json({
      message: "Payment order created successfully",
      order,
      paymentId: payment._id,
      subtotal,
      success: true,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const verifyPaymentOrder = async (req, res) => {
  const { orderId, paymentId, signature, dbPaymentId } = req.body;

  try {
    const payment = await paymentModel.findOne({
      _id: dbPaymentId,
      status: "pending",
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment record not found",
        success: false,
      });
    }

    const isValid = validatePaymentVerification(
      {
        order_id: orderId,
        payment_id: paymentId,
      },
      signature,
      config.RAZORPAY_KEY_SECRET,
    );

    if (!isValid) {
      payment.status = "failed";
      await payment.save();

      return res.status(400).json({
        message: "Invalid payment signature",
        success: false,
      });
    }

    payment.status = "paid";
    payment.razorpay.paymentId = paymentId;
    payment.razorpay.signature = signature;

    await payment.save();

    await cartModel.findOneAndUpdate(
      { userId: payment.userId },
      { $set: { items: [] } }
    );

    return res.status(200).json({
      message: "Payment verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getPaymentByOrderId = async (req, res) => {
  const { orderId } = req.params;

  try {
    const payment = await paymentModel.findOne({
      "razorpay.orderId": orderId,
      userId: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Error fetching payment by orderId:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getUserPayments = async (req, res) => {
  try {
    const payments = await paymentModel
      .find({ userId: req.user._id, status: "paid" })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Error fetching user payments:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
