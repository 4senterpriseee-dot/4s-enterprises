import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  variant: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    default: null,
  },

  size: { type: String, default: null },

  price: {
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
  },

  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
});

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;