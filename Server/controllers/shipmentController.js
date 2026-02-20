const axios = require("axios");
const Shipment = require("../models/Shipment");
const Order = require("../models/Order");
const { getToken } = require("../services/shiprocketService");




exports.createShipment = async (order) => {
  try {
    const fullName = order.addressSnapshot.fullName.trim();
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "NA";
    
    const token = await getToken();

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
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
        length: 10,
        breadth: 10,
        height: 10,
        weight: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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

    return shipment;

  } catch (error) {
    console.error("Shiprocket Error:", error.response?.data || error.message);
  }
};
