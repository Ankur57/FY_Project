const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    shiprocketOrderId: String,
    awbCode: String,
    courierName: String,
    trackingUrl: String,

    shipmentStatus: {
      type: String,
      enum: [
        "created",
        "pickup_scheduled",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "created",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipment", shipmentSchema);
