import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaImage, FaMicrophone } from "react-icons/fa"; // Import icons
import "./Products.css";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]); // Fetched products from backend
  const [selectedImage, setSelectedImage] = useState(null);
  const [listening, setListening] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simulate user authentication check
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch products from backend based on searchQuery
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products?search=${searchQuery}`
        );
        console.log("Fetched Products:", response.data); // Debugging
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, [searchQuery]);

  // Handle text search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle image upload (for now, we simply set the image and could later process it)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      // You can extend this to send the image to your backend for processing
    }
  };

  // Handle voice search using Web Speech API
  const handleVoiceSearch = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      setSearchQuery(event.results[0][0].transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.start();
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">3D Clothing</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
              {isLoggedIn ? (
                <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
              ) : (
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="container mt-4">
        <div className="search-bar d-flex justify-content-center align-items-center">
          <div className="input-group w-75">
            <span className="input-group-text"><FaSearch /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <label className="btn btn-outline-secondary ms-2">
            <FaImage size={20} />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </label>
          <button
            className="btn btn-outline-primary ms-2"
            onClick={handleVoiceSearch}
          >
            {listening ? "Listening..." : <FaMicrophone size={20} />}
          </button>
        </div>
      </div>

      {/* Products List */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Shop Your Favorite Outfits</h2>
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card product-card">
                <img src={product.img} className="card-img-top" alt={product.title} />
                <div className="card-body text-center">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.price}</p>
                  <Link to={`/products/${product._id}`} className="btn btn-dark">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer bg-dark text-light text-center p-3 mt-5">
        <p>&copy; 2025 3D Clothing | All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Products;
