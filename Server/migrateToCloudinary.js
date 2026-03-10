const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Models
const Product = require("./models/Product");
const Category = require("./models/Category");
const Banner = require("./models/Banner");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "soandita",
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload ${filePath}:`, error);
    return null;
  }
};

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const uploadsDir = path.join(__dirname, "uploads");

    // Helper to process a path string
    const processImagePath = async (imagePath) => {
      if (!imagePath || imagePath.startsWith("http")) return imagePath;

      // Extract filename (local paths might be "/uploads/name.jpg" or just "name.jpg")
      const filename = path.basename(imagePath);
      const fullPath = path.join(uploadsDir, filename);

      if (fs.existsSync(fullPath)) {
        console.log(`Uploading ${filename}...`);
        const cloudUrl = await uploadToCloudinary(fullPath);
        return cloudUrl || imagePath;
      }
      return imagePath;
    };

    // 1. Products
    const products = await Product.find({});
    for (const product of products) {
      let updated = false;
      const newImages = [];
      for (const img of product.images) {
        const newImg = await processImagePath(img);
        if (newImg !== img) {
          newImages.push(newImg);
          updated = true;
        } else {
          newImages.push(img);
        }
      }
      if (updated) {
        product.images = newImages;
        await product.save();
        console.log(`Updated product: ${product.name}`);
      }
    }

    // 2. Categories
    const categories = await Category.find({});
    for (const category of categories) {
      if (category.image && !category.image.startsWith("http")) {
        const newImg = await processImagePath(category.image);
        if (newImg !== category.image) {
          category.image = newImg;
          await category.save();
          console.log(`Updated category: ${category.name}`);
        }
      }
    }

    // 3. Banners
    const banners = await Banner.find({});
    for (const banner of banners) {
      if (banner.image && !banner.image.startsWith("http")) {
        const newImg = await processImagePath(banner.image);
        if (newImg !== banner.image) {
          banner.image = newImg;
          await banner.save();
          console.log(`Updated banner`);
        }
      }
    }

    console.log("Migration completed!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

migrate();
