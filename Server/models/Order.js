const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
         name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        priceAtTime: {
          type: Number,
          required: true,
        },
      },
    ],

    subtotal: {
      type: Number,
      required: true,
  },
    shippingCharges: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
  },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
        "return_requested",
        "return_approved",
        "return_rejected",
        "refunded",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },
     addressSnapshot: {
        fullName: { type: String, required: true },
        mobileNumber: { type: String, required: true },
        addressLine1: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    returnRequest: {
      reason: {
        type: String,
        enum: ["damaged", "defective", "wrong_item"],
      },
      images: [String],
      requestedAt: Date,
      status: {
        type: String,
        enum: ["none", "requested", "approved", "rejected", "refunded"],
        default: "none",
      },
      adminComment: String,
      refundedAt: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
