const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Normal protected route
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

// Admin-only route
router.get("/admin", protect, adminOnly, (req, res) => {
  res.json({
    message: "Admin route accessed",
  });
});

module.exports = router;
