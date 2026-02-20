const Cart = require("../models/Cart");
const Product = require("../models/Product");


// Get Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate("items.productId");

    if (!cart) {
      return res.json({ items: [], totalAmount: 0 });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not available" });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        priceAtTime: product.price,
      });
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.priceAtTime,
      0
    );

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update Quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.priceAtTime,
      0
    );

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Remove Item
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.priceAtTime,
      0
    );

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
