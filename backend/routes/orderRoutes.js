const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User=require("../models/User");
const authMiddleware = require("../middleware/auth");


// Create a new order (protected)
router.post("/", async (req, res) => {
  try {
    const { userId, products, totalPrice, shippingInfo, paymentMethod, cardDetails } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products array is required and cannot be empty." });
    }

    if (totalPrice <= 0) {
      return res.status(400).json({ message: "Total price must be a positive number." });
    }

    if (!shippingInfo || typeof shippingInfo !== "object") {
      return res.status(400).json({ message: "Valid shipping information is required." });
    }

    // Debugging logs
    console.log("Creating order for user:", userId);
    console.log("Order data received:", { products, totalPrice, shippingInfo });

    // Create and save the order
    const newOrder = new Order({
      user: userId, // Using userId from the request body
      products,
      totalPrice,
      shippingInfo,
      paymentMethod,
      cardDetails
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: savedOrder });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});



// Get orders for the logged-in user (protected)
router.get("/my-orders", async (req, res) => {
  try {
    
    const { userId } = req.query;
    console.log(userId);
    const user1 = await User.findById(userId);
    console.log(user1);

const orders = await Order.find({ user: user1 }) // ✅ Correct field name
  .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found." });
    }

    res.status(200).json({ 
      success: true, 
      message: "Orders retrieved successfully", 
      orders 
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch orders", 
      error: error.message 
    });
  }
});


// Get all orders (admin only)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("products.productId", "name price img")
      .sort({ createdAt: -1 });

    res.json({ message: "All orders retrieved successfully", orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

module.exports = router;
