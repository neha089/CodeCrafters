const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// Get cart items
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.find();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update item quantity
router.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const updatedCartItem = await Cart.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
    res.json(updatedCartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item from cart
router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Add item to cart
router.post("/", async (req, res) => {
  try {
    const {userId, name, price, img, quantity } = req.body;
    console.log(userId);
    console.log(name);
    

    if (!userId|| !name || !price || !img || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let item = await Cart.findOne({ name });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = new Cart({ userId,name, price, img, quantity });
      await item.save();
    }

    res.json(item);
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

  


