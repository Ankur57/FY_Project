const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    razorpayOrderId: {
      type: String,
      required: true,
    },

    razorpayPaymentId: {
      type: String,
    },

    razorpaySignature: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["created", "success", "failed", "refunded"],
      default: "created",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
