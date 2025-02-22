const express = require("express");
const router = express.Router();
const Product = require("../Models/Product");

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

router.get("/:id", (req, res) => {
  const product = products.find(p => p._id === parseInt(req.params._id));
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});


module.exports = router;
