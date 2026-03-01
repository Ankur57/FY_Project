const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { createCategory, getCategories, updateCategory } = require("../controllers/categoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, upload.single("image"), createCategory);
router.get("/", getCategories);
router.put("/:id", protect, adminOnly, upload.single("image"), updateCategory);

module.exports = router;
