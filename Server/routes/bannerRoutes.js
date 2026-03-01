const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const {
    getBanners,
    addBanner,
    updateBanner,
    deleteBanner,
} = require("../controllers/bannerController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getBanners);

// Admin
router.post("/", protect, adminOnly, upload.single("image"), addBanner);
router.put("/:id", protect, adminOnly, upload.single("image"), updateBanner);
router.delete("/:id", protect, adminOnly, deleteBanner);

module.exports = router;
