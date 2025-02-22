const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authMiddleware = require("../middleware/auth"); // Ensure you have this middleware for protected routes

// Create a new order (protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Expecting req.body to have: products (array), totalPrice, shippingInfo (object)
    const { products, totalPrice, shippingInfo } = req.body;

    // Create new order with logged in user's id (provided by authMiddleware)
    const newOrder = new Order({
      user: req.user.id,
      products,
      totalPrice,
      shippingInfo,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

// Get orders for the logged-in user (protected)
router.get("/myorders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("products.productId", "name price img");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

// (Optional) Get all orders (admin route - additional role check might be needed)
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Optionally, verify if req.user.role === 'admin' here for admin access
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("products.productId", "name price img");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

module.exports = router;
