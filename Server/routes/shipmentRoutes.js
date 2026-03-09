const express = require("express");
const { trackShipment, getShipmentByOrder, shiprocketWebhook } = require("../controllers/shipmentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Shiprocket webhook — NO auth (Shiprocket calls this directly)
router.post("/webhook/shiprocket", shiprocketWebhook);

// Get shipment details for an order
router.get("/:orderId", protect, getShipmentByOrder);

// Track / refresh shipment status from Shiprocket (admin only)
router.get("/:orderId/track", protect, adminOnly, trackShipment);

module.exports = router;
