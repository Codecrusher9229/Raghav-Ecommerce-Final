import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    payment: {
      success: { type: Boolean, default: false },
      mode: {
        type: String,
        enum: ["COD", "Braintree", "Online"], // ✅ Added "Online"
        default: "COD",
      },
      transaction: {
        razorpay_order_id: String,
        razorpay_payment_id: String,
        razorpay_signature: String,
      },
    },
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
