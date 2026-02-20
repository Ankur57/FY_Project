const express = require("express");
const { createCategory, getCategories } = require("../controllers/categoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, createCategory);
router.get("/", getCategories);

module.exports = router;
