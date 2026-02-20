


exports.processRefund = async (paymentId, amount) => {
  console.log("Mock refund initiated for:", paymentId);
  return {
    refundId: "mock_refund_" + Date.now(),
    status: "processed",
  };
};