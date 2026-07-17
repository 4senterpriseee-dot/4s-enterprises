import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderItems: [
      {
        title: String,
        productId: mongoose.Schema.Types.ObjectId,
        variantId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        size: String,
        images: { url: String },
        description: String,
        price: priceSchema,
      },
    ],
    price: {
      type: priceSchema,
      required: true,
    },
    razorpay: {
      orderId: String,
      paymentId: String,
      signature: String,
    },
  },
  { timestamps: true },
);

const paymentModel = mongoose.model("Payment", paymentSchema);

export default paymentModel;