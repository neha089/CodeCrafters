// // index.js
// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// const fs = require("fs");
// const path = require("path");
// const tf = require("@tensorflow/tfjs-node");
// const mobilenet = require("@tensorflow-models/mobilenet");
// const mongoose = require("mongoose");

// // Connect to MongoDB (adjust the connection string as needed)
// mongoose.connect("mongodb://localhost:27017/mydb", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Import your Product model
// const Product = require("./models/Product");

// const app = express();
// const upload = multer({ dest: "uploads/" });
// app.use(cors());
// app.use(express.json());

// let model;
// let productsWithEmbeddings = [];

// // Helper function: compute cosine similarity between two vectors.
// function cosineSimilarity(vecA, vecB) {
//   const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
//   const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
//   const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
//   return dotProduct / (normA * normB);
// }

// // Load MobileNet model and compute embeddings for products from the database.
// async function loadModelAndComputeEmbeddings() {
//   console.log("Loading MobileNet model...");
//   model = await mobilenet.load();
//   console.log("MobileNet loaded");

//   // Fetch products from the database
//   const productsFromDb = await Product.find({});
//   productsWithEmbeddings = [];
  
//   for (const product of productsFromDb) {
//     // Assume product.img is a relative file path to the image.
//     const imgPath = path.join(__dirname, product.img);
//     if (!fs.existsSync(imgPath)) {
//       console.error("Image file does not exist:", imgPath);
//       continue;
//     }
//     const imageBuffer = fs.readFileSync(imgPath);
//     const decodedImage = tf.node.decodeImage(imageBuffer, 3);
//     const resizedImage = tf.image.resizeBilinear(decodedImage, [224, 224]);
//     const expandedImage = resizedImage.expandDims(0);
//     const activation = model.infer(expandedImage, true);
//     const embedding = activation.arraySync()[0];
    
//     productsWithEmbeddings.push({
//       id: product._id,
//       name: product.title,
//       img: product.img,
//       embedding,
//     });
    
//     tf.dispose([decodedImage, resizedImage, expandedImage, activation]);
//   }
//   console.log("Product embeddings computed");
// }

// // --------------------
// // Normal Product Endpoints
// // --------------------

// // GET /api/products?search=...
// app.get("/api/products", async (req, res) => {
//   try {
//     const searchQuery = req.query.search || "";
//     let query = {};
//     if (searchQuery) {
//       query = { title: { $regex: searchQuery, $options: "i" } };
//     }
//     const products = await Product.find(query);
//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ message: "Failed to fetch products" });
//   }
// });

// // POST /api/products (for admin to add new product)
// app.post("/api/products", async (req, res) => {
//   try {
//     const { title, price, img, category } = req.body;
//     const newProduct = new Product({ title, price, img, category });
//     await newProduct.save();
//     res.status(201).json(newProduct);
//   } catch (error) {
//     console.error("Error creating product:", error);
//     res.status(500).json({ message: "Failed to create product", error: error.message });
//   }
// });

// // GET /api/products/:id
// app.get("/api/products/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id); 
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // --------------------
// // Image Search Endpoint
// // --------------------
// app.post("/api/v1/search-by-image", upload.single("image"), async (req, res) => {
//   try {
//     const filePath = req.file.path;
//     const imageBuffer = fs.readFileSync(filePath);
//     const decodedImage = tf.node.decodeImage(imageBuffer, 3);
//     const resizedImage = tf.image.resizeBilinear(decodedImage, [224, 224]);
//     const expandedImage = resizedImage.expandDims(0);
//     const activation = model.infer(expandedImage, true);
//     const queryEmbedding = activation.arraySync()[0];
//     tf.dispose([decodedImage, resizedImage, expandedImage, activation]);

//     // Compare query embedding to each product embedding from the DB
//     const similarityResults = productsWithEmbeddings.map((product) => {
//       const similarity = cosineSimilarity(queryEmbedding, product.embedding);
//       return { product, similarity };
//     });
//     similarityResults.sort((a, b) => b.similarity - a.similarity);
//     // Return top 3 results
//     const topProducts = similarityResults.slice(0, 3).map((result) => ({
//       id: result.product.id,
//       name: result.product.name,
//       similarity: result.similarity,
//       img: result.product.img,
//     }));

//     // Remove the temporary uploaded file
//     fs.unlinkSync(filePath);
//     res.json({ products: topProducts });
//   } catch (error) {
//     console.error("Error in image search:", error);
//     res.status(500).json({ error: "Error processing image search" });
//   }
// });

// // --------------------
// // Voice Search Endpoint
// // --------------------
// // This endpoint performs a simple text search on product names.
// app.get("/api/v1/search-by-voice", async (req, res) => {
//   try {
//     const { query } = req.query;
//     if (!query) {
//       return res.status(400).json({ error: "Query parameter is required" });
//     }
//     const lowerQuery = query.toLowerCase();
//     // Filter products in the DB whose title includes the query text.
//     const matchingProducts = await Product.find({
//       title: { $regex: lowerQuery, $options: "i" },
//     });
//     res.json({ products: matchingProducts });
//   } catch (error) {
//     console.error("Error in voice search:", error);
//     res.status(500).json({ error: "Error processing voice search" });
//   }
// });

// // --------------------
// // Start the Server
// // --------------------
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, async () => {
//   await loadModelAndComputeEmbeddings();
//   console.log(`Server running on port ${PORT}`);
// });
