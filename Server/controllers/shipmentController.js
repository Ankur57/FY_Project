const axios = require("axios");
const Shipment = require("../models/Shipment");
const Order = require("../models/Order");
const { getToken, refreshToken } = require("../services/shiprocketService");


// ── Admin creates shipment with weight/dimensions ──
exports.createShipment = async (req, res) => {
  try {
    const { orderId, weight, length, breadth, height } = req.body;

    // Validate inputs
    if (!orderId || !weight || !length || !breadth || !height) {
      return res.status(400).json({ message: "orderId, weight, length, breadth, and height are required" });
    }

    const order = await Order.findById(orderId).populate("userId", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus !== "paid") {
      return res.status(400).json({ message: `Order status is "${order.orderStatus}" — only "paid" orders can be shipped` });
    }

    // Check if a shipment already exists for this order
    const existingShipment = await Shipment.findOne({ orderId: order._id });
    if (existingShipment) {
      return res.status(400).json({ message: "Shipment already exists for this order" });
    }

    const fullName = order.addressSnapshot.fullName.trim();
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "NA";

    const payload = {
      order_id: order.orderNumber,
      order_date: new Date(),
      pickup_location: "Home", // must match Shiprocket pickup name

      billing_customer_name: firstName,
      billing_last_name: lastName,

      billing_address: order.addressSnapshot.addressLine1,
      billing_city: order.addressSnapshot.city,
      billing_pincode: order.addressSnapshot.postalCode,
      billing_state: order.addressSnapshot.state,
      billing_country: "India",
      billing_phone: order.addressSnapshot.mobileNumber,
      shipping_is_billing: true,
      order_items: order.items.map((item) => ({
        name: item.name,
        sku: item.name,
        units: item.quantity,
        selling_price: item.priceAtTime,
      })),
      payment_method: "Prepaid",
      sub_total: order.totalAmount,
      length: parseFloat(length),
      breadth: parseFloat(breadth),
      height: parseFloat(height),
      weight: parseFloat(weight),
    };

    let response;
    try {
      const token = await getToken();
      response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      // If 401 (token expired/invalid), refresh and retry once
      if (err.response && err.response.status === 401) {
        console.log("Shiprocket token expired, refreshing and retrying...");
        const newToken = await refreshToken();
        response = await axios.post(
          "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
          payload,
          { headers: { Authorization: `Bearer ${newToken}` } }
        );
      } else {
        console.error("Shiprocket Error:", err.response?.data || err.message);
        return res.status(500).json({
          message: "Failed to create Shiprocket order",
          error: err.response?.data || err.message,
        });
      }
    }

    const shiprocketData = response.data;

    const shipment = await Shipment.create({
      orderId: order._id,
      shiprocketOrderId: shiprocketData.order_id,
      awbCode: shiprocketData.shipment_id,
      courierName: shiprocketData.courier_name,
      trackingUrl: shiprocketData.tracking_url,
    });

    order.orderStatus = "shipped";
    await order.save();

    res.status(201).json({
      message: "Shipment created successfully",
      shipment,
    });

  } catch (error) {
    console.error("Create Shipment Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ── Track shipment status via Shiprocket API ──
exports.trackShipment = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the shipment record for this order
    const shipment = await Shipment.findOne({ orderId });
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found for this order" });
    }

    if (!shipment.shiprocketOrderId) {
      return res.status(400).json({ message: "No Shiprocket order ID available for tracking" });
    }

    // Call Shiprocket tracking API
    let response;
    try {
      const token = await getToken();
      response = await axios.get(
        `https://apiv2.shiprocket.in/v1/external/orders/show/${shipment.shiprocketOrderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      if (err.response && err.response.status === 401) {
        const newToken = await refreshToken();
        response = await axios.get(
          `https://apiv2.shiprocket.in/v1/external/orders/show/${shipment.shiprocketOrderId}`,
          { headers: { Authorization: `Bearer ${newToken}` } }
        );
      } else {
        throw err;
      }
    }

    const shiprocketOrder = response.data;
    const srStatus = (shiprocketOrder.data?.status || shiprocketOrder.status || "").toLowerCase();

    // Map Shiprocket status to local shipment status
    let newShipmentStatus = shipment.shipmentStatus;
    let newOrderStatus = null;

    if (srStatus.includes("delivered")) {
      newShipmentStatus = "delivered";
      newOrderStatus = "delivered";
    } else if (srStatus.includes("shipped") || srStatus.includes("in transit") || srStatus.includes("in_transit")) {
      newShipmentStatus = "shipped";
      newOrderStatus = "shipped";
    } else if (srStatus.includes("pickup") || srStatus.includes("picked")) {
      newShipmentStatus = "pickup_scheduled";
    } else if (srStatus.includes("cancel")) {
      newShipmentStatus = "cancelled";
      newOrderStatus = "cancelled";
    }

    // Update shipment status
    shipment.shipmentStatus = newShipmentStatus;
    if (shiprocketOrder.data?.awb_code || shiprocketOrder.awb_code) {
      shipment.awbCode = shiprocketOrder.data?.awb_code || shiprocketOrder.awb_code;
    }
    if (shiprocketOrder.data?.courier_name || shiprocketOrder.courier_name) {
      shipment.courierName = shiprocketOrder.data?.courier_name || shiprocketOrder.courier_name;
    }
    await shipment.save();

    // Update order status if changed
    if (newOrderStatus) {
      const order = await Order.findById(orderId);
      if (order && order.orderStatus !== newOrderStatus) {
        // Only update if the order hasn't been returned/refunded
        const noUpdateStatuses = ["returned", "return_requested", "return_approved", "refunded"];
        if (!noUpdateStatuses.includes(order.orderStatus)) {
          order.orderStatus = newOrderStatus;
          await order.save();
        }
      }
    }

    res.json({
      shipmentStatus: shipment.shipmentStatus,
      shiprocketOrderId: shipment.shiprocketOrderId,
      awbCode: shipment.awbCode,
      courierName: shipment.courierName,
      trackingUrl: shipment.trackingUrl,
      shiprocketResponse: shiprocketOrder,
    });

  } catch (error) {
    console.error("Track Shipment Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to track shipment" });
  }
};

// ── Get shipment details by order ID ──
exports.getShipmentByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const shipment = await Shipment.findOne({ orderId }).populate("orderId", "orderNumber orderStatus");
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found for this order" });
    }

    res.json(shipment);
  } catch (error) {
    console.error("Get Shipment Error:", error.message);
    res.status(500).json({ message: "Failed to get shipment details" });
  }
};

// ── Shiprocket Webhook — auto-updates status when Shiprocket sends events ──
exports.shiprocketWebhook = async (req, res) => {
  try {
    const payload = req.body;

    console.log("Shiprocket Webhook received:", JSON.stringify(payload, null, 2));

    // Shiprocket sends: order_id, awb, current_status, etd, etc.
    const srOrderId = payload.order_id;
    const awb = payload.awb;
    const currentStatus = (payload.current_status || "").toLowerCase();
    const courierName = payload.courier_name || "";
    const etd = payload.etd || "";

    // Find shipment by shiprocket order ID or AWB code
    let shipment = null;
    if (srOrderId) {
      shipment = await Shipment.findOne({ shiprocketOrderId: String(srOrderId) });
    }
    if (!shipment && awb) {
      shipment = await Shipment.findOne({ awbCode: String(awb) });
    }

    if (!shipment) {
      console.log("Webhook: No matching shipment found for order_id:", srOrderId, "awb:", awb);
      return res.status(200).json({ message: "No matching shipment found" });
    }

    // Map Shiprocket status to local statuses
    let newShipmentStatus = shipment.shipmentStatus;
    let newOrderStatus = null;

    if (currentStatus.includes("delivered")) {
      newShipmentStatus = "delivered";
      newOrderStatus = "delivered";
    } else if (
      currentStatus.includes("shipped") ||
      currentStatus.includes("in transit") ||
      currentStatus.includes("in_transit") ||
      currentStatus.includes("out for delivery")
    ) {
      newShipmentStatus = "shipped";
      newOrderStatus = "shipped";
    } else if (currentStatus.includes("pickup") || currentStatus.includes("picked")) {
      newShipmentStatus = "pickup_scheduled";
    } else if (currentStatus.includes("cancel") || currentStatus.includes("rto")) {
      newShipmentStatus = "cancelled";
      newOrderStatus = "cancelled";
    }

    // Update shipment
    shipment.shipmentStatus = newShipmentStatus;
    if (awb) shipment.awbCode = awb;
    if (courierName) shipment.courierName = courierName;
    await shipment.save();

    // Update order status if applicable
    if (newOrderStatus) {
      const order = await Order.findById(shipment.orderId);
      if (order) {
        const noUpdateStatuses = ["returned", "return_requested", "return_approved", "refunded"];
        if (!noUpdateStatuses.includes(order.orderStatus)) {
          order.orderStatus = newOrderStatus;
          await order.save();
          console.log(`Webhook: Order ${order.orderNumber} status updated to "${newOrderStatus}"`);
        }
      }
    }

    res.status(200).json({ message: "Webhook processed successfully" });

  } catch (error) {
    console.error("Shiprocket Webhook Error:", error.message);
    // Always return 200 to Shiprocket so it doesn't keep retrying
    res.status(200).json({ message: "Webhook received with errors" });
  }
};
