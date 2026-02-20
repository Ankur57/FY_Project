const express = require("express");
const {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update", protect, updateQuantity);
router.delete("/remove", protect, removeItem);

module.exports = router;
