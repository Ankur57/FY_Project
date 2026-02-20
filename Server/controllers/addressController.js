const Address = require("../models/Address");


// Add Address
exports.addAddress = async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get User Addresses
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
