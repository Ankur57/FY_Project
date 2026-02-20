const axios = require("axios");

let shiprocketToken = null;

// Authenticate and get token
const authenticateShiprocket = async () => {
  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }
  );

  shiprocketToken = response.data.token;
  return shiprocketToken;
};

const getToken = async () => {
  if (!shiprocketToken) {
    await authenticateShiprocket();
  }
  return shiprocketToken;
};

module.exports = { getToken };
