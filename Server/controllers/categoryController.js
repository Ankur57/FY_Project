const Category = require("../models/Category");
const slugify = require("slugify");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const slug = slugify(name, { lower: true, strict: true });

    const categoryData = { name, slug };

    // If an image was uploaded, save its path
    if (req.file) {
      categoryData.image = req.file.path;
    }

    const category = await Category.create(categoryData);

    res.status(201).json(category);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a category (Admin) — can update name and/or image
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (req.body.name) {
      category.name = req.body.name;
      category.slug = slugify(req.body.name, { lower: true, strict: true });
    }

    if (req.file) {
      category.image = req.file.path;
    }

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
