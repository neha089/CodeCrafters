const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/products?search=...
router.get("/", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    let query = {};

    // If searchQuery exists, filter products
    if (searchQuery) {
      query = { title: { $regex: searchQuery, $options: "i" } };
    }

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// POST /api/products (for admin to add new product)
router.post("/", async (req, res) => {
  try {
    const { title, price, img, category } = req.body;
    const newProduct = new Product({ title, price, img, category });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
});
 // Ensure correct model import

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Fetch from DB
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});





module.exports = router;
