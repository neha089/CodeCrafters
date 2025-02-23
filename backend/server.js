// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const tf = require("@tensorflow/tfjs-node");
// const mobilenet = require("@tensorflow-models/mobilenet");
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());
// const upload = multer({ dest: "uploads/" });

// const Product = require("./models/Product");
// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("✅ MongoDB Connected"))
//     .catch(err => console.error("❌ MongoDB Connection Error:", err));


// const productRoutes = require("./routes/productRoutes");
// const userRoutes = require("./routes/userRoutes");
// const cartRoutes=require("./routes/cartRoutes");
// const orderRoutes=require("./routes/orderRoutes");

// app.use("/api/products", productRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/carts",cartRoutes);
// app.use("/api/orders",orderRoutes);


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
//     let imageBuffer;
    
//     // Check if the image path is a remote URL
//     if (product.img.startsWith("http")) {
//       try {
//         const response = await axios.get(product.img, { responseType: "arraybuffer" });
//         imageBuffer = Buffer.from(response.data, "binary");
//       } catch (err) {
//         console.error("Error downloading image:", product.img, err);
//         continue; // Skip this product if the image download fails
//       }
//     } else {
//       // Otherwise, assume it's a local file path
//       const imgPath = path.join(__dirname, product.img);
//       if (!fs.existsSync(imgPath)) {
//         console.error("Image file does not exist:", imgPath);
//         continue;
//       }
//       imageBuffer = fs.readFileSync(imgPath);
//     }
    
//     try {
//       const decodedImage = tf.node.decodeImage(imageBuffer, 3);
//       const resizedImage = tf.image.resizeBilinear(decodedImage, [224, 224]);
//       const expandedImage = resizedImage.expandDims(0);
//       const activation = model.infer(expandedImage, true);
//       const embedding = activation.arraySync()[0];
      
//       productsWithEmbeddings.push({
//         id: product._id,
//         name: product.title,
//         img: product.img,
//         embedding,
//       });
      
//       tf.dispose([decodedImage, resizedImage, expandedImage, activation]);
//     } catch (error) {
//       console.error("Error processing image for product:", product.title, error);
//     }
//   }
//   console.log("Product embeddings computed");
// }


// // --------------------
// // Image Search Endpoint
// // --------------------
// app.post("/api/v1/search-by-image", upload.single("image"), async (req, res) => {
//   try {
//     const filePath = req.file.path;
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }
    
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


// const PORT = process.env.PORT || 5001;
// app.listen(PORT,  async () => {
//     await loadModelAndComputeEmbeddings();
//     console.log("Server is running on port 5000");
// });


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const tf = require("@tensorflow/tfjs-node");
const mobilenet = require("@tensorflow-models/mobilenet");
const axios = require("axios"); // Added: Require axios
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ dest: "uploads/" });

const Product = require("./models/Product");

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);

let model;
let productsWithEmbeddings = [];

// Helper function: compute cosine similarity between two vectors.
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (normA * normB);
}

// Load MobileNet model and compute embeddings for products from the database.
async function loadModelAndComputeEmbeddings() {
  console.log("Loading MobileNet model...");
  model = await mobilenet.load();
  modelLoaded = true; // Set flag to true after loading
  console.log("MobileNet loaded");

  // Fetch products from the database
  const productsFromDb = await Product.find({});
  productsWithEmbeddings = [];
  
  for (const product of productsFromDb) {
    let imageBuffer;
    // Check if the image path is a remote URL
    if (product.img.startsWith("http")) {
      try {
        const response = await axios.get(product.img, { responseType: "arraybuffer" });
        imageBuffer = Buffer.from(response.data, "binary");
      } catch (err) {
        console.error("Error downloading image:", product.img, err);
        continue; // Skip this product if the image download fails
      }
    } else {
      // Otherwise, assume it's a local file path
      const imgPath = path.join(__dirname, product.img);
      if (!fs.existsSync(imgPath)) {
        console.error("Image file does not exist:", imgPath);
        continue;
      }
      imageBuffer = fs.readFileSync(imgPath);
    }
    
    try {
      const decodedImage = tf.node.decodeImage(imageBuffer, 3);
      const resizedImage = tf.image.resizeBilinear(decodedImage, [224, 224]);
      const expandedImage = resizedImage.expandDims(0);
      const activation = model.infer(expandedImage, true);
      const embedding = activation.arraySync()[0];
      
      productsWithEmbeddings.push({
        id: product._id,
        name: product.title,
        img: product.img,
        embedding,
      });
      
      tf.dispose([decodedImage, resizedImage, expandedImage, activation]);
    } catch (error) {
      console.error("Error processing image for product:", product.title, error);
    }
  }
  console.log("Product embeddings computed");
}

// --------------------
// Image Search Endpoint
// --------------------
app.post("/api/v1/search-by-image", upload.single("image"), async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    // Check if the model is loaded
    if (!modelLoaded) {
      console.error("Model not loaded!");
      return res.status(500).json({ error: "Model not loaded yet" });
    }
    
    const filePath = req.file.path;
    console.log("Processing uploaded file:", filePath);
    const imageBuffer = fs.readFileSync(filePath);
    
    let decodedImage;
    try {
      decodedImage = tf.node.decodeImage(imageBuffer, 3);
    } catch (err) {
      console.error("Error decoding image:", err);
      throw new Error("Image decoding failed");
    }
    
    const resizedImage = tf.image.resizeBilinear(decodedImage, [224, 224]);
    const expandedImage = resizedImage.expandDims(0);
    
    let activation;
    try {
      activation = model.infer(expandedImage, true);
    } catch (err) {
      console.error("Error during model inference:", err);
      throw new Error("Model inference failed");
    }
    
    const queryEmbedding = activation.arraySync()[0];
    tf.dispose([decodedImage, resizedImage, expandedImage, activation]);

    // Compare query embedding to each product embedding from the DB
    const similarityResults = productsWithEmbeddings.map((product) => {
      const similarity = cosineSimilarity(queryEmbedding, product.embedding);
      return { product, similarity };
    });
    similarityResults.sort((a, b) => b.similarity - a.similarity);
    
    // Return top 3 results
    const topProducts = similarityResults.slice(0, 3).map((result) => ({
      id: result.product.id,
      name: result.product.name,
      similarity: result.similarity,
      img: result.product.img,
    }));

    // Remove the temporary uploaded file
    fs.unlinkSync(filePath);
    res.json({ products: topProducts });
  } catch (error) {
    console.error("Error in image search endpoint:", error);
    res.status(500).json({ error: "Error processing image search: " + error.message });
  }
});

// --------------------
// Voice Search Endpoint
// --------------------
// This endpoint performs a simple text search on product names.
app.get("/api/v1/search-by-voice", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }
    const lowerQuery = query.toLowerCase();
    // Filter products in the DB whose title includes the query text.
    const matchingProducts = await Product.find({
      title: { $regex: lowerQuery, $options: "i" },
    });
    res.json({ products: matchingProducts });
  } catch (error) {
    console.error("Error in voice search:", error);
    res.status(500).json({ error: "Error processing voice search" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
    await loadModelAndComputeEmbeddings();
    console.log("Server is running on port", PORT);
});
