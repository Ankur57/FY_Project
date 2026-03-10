const Banner = require("../models/Banner");

// Get all active banners (Public)
exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new banner (Admin)
exports.addBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const imagePath = req.file.path;

        // Set order to be after the last existing banner
        const lastBanner = await Banner.findOne().sort({ order: -1 });
        const order = lastBanner ? lastBanner.order + 1 : 0;

        const banner = await Banner.create({
            image: imagePath,
            order,
        });

        res.status(201).json(banner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a banner (Admin) — replace image or change order
exports.updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        // Replace image if new one uploaded
        if (req.file) {
            banner.image = req.file.path;
        }

        // Update order if provided
        if (req.body.order !== undefined) {
            banner.order = Number(req.body.order);
        }

        await banner.save();
        res.json(banner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a banner (Admin)
exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);

        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        res.json({ message: "Banner deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
