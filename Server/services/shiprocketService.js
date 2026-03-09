const axios = require("axios");

let shiprocketToken = null;
let tokenExpiresAt = null;

// Authenticate and get token
const authenticateShiprocket = async () => {
  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }
    );

    shiprocketToken = response.data.token;
    // Shiprocket tokens are valid for 10 days; refresh after 9 days to be safe
    tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000;
    return shiprocketToken;
  } catch (error) {
    shiprocketToken = null;
    tokenExpiresAt = null;
    console.error(
      "Shiprocket authentication failed:",
      error.response?.data || error.message
    );
    throw new Error("Shiprocket authentication failed");
  }
};

const getToken = async () => {
  // Re-authenticate if token is missing or expired
  if (!shiprocketToken || (tokenExpiresAt && Date.now() >= tokenExpiresAt)) {
    await authenticateShiprocket();
  }
  return shiprocketToken;
};

// Force re-authentication (call this when a 401 is received)
const refreshToken = async () => {
  shiprocketToken = null;
  tokenExpiresAt = null;
  return authenticateShiprocket();
};

module.exports = { getToken, refreshToken };
