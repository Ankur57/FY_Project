const express = require("express");
const {
  addAddress,
  getAddresses,
} = require("../controllers/addressController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addAddress);
router.get("/", protect, getAddresses);

module.exports = router;
