// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { FaSearch, FaImage, FaMicrophone } from "react-icons/fa"; // Import icons
// import "./Products.css";

// const Products = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [products, setProducts] = useState([]); // Fetched products from backend
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [listening, setListening] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Simulate user authentication check
//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (user) {
//       setIsLoggedIn(true);
//     }
//   }, []);

//   // Fetch products from backend based on searchQuery
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/products?search=${searchQuery}`
//         );
//         console.log("Fetched Products:", response.data); // Debugging
//         setProducts(response.data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
  
//     fetchProducts();
//   }, [searchQuery]);

//   // Handle text search input
//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   // Handle image upload (for now, we simply set the image and could later process it)
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedImage(URL.createObjectURL(file));
//       // You can extend this to send the image to your backend for processing
//     }
//   };

//   // Handle voice search using Web Speech API
//   const handleVoiceSearch = () => {
//     const recognition = new window.webkitSpeechRecognition();
//     recognition.onstart = () => setListening(true);
//     recognition.onresult = (event) => {
//       setSearchQuery(event.results[0][0].transcript);
//       setListening(false);
//     };
//     recognition.onerror = () => setListening(false);
//     recognition.start();
//   };

//   return (
//     <div>
//       {/* Navbar */}
//       <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//         <div className="container">
//           <Link className="navbar-brand" to="/">ShopEase</Link>
//           <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse" id="navbarNav">
//             <ul className="navbar-nav ms-auto">
//               <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
//               <li className="nav-item">
//                               <Link className="nav-link" to="/my-orders">Orders</Link>
//                             </li>
//               {isLoggedIn ? (
//                               <ul className="navbar-nav ms-auto">
//                               <li className="nav-item">
//                               <Link className="nav-link" to="/carts">Cart</Link>
//                               </li>
//                               <li className="nav-item">
//                                 <Link className="nav-link" to="/profile">Profile</Link>
//                               </li>
//                               </ul>
//                             ) : (
//                               <li className="nav-item">
//                                 <Link className="nav-link" to="/login">Login</Link>
//                               </li>
//                             )}
//             </ul>
//           </div>
//         </div>
//       </nav>

//       {/* Search Bar */}
//       <div className="container mt-4">
//         <div className="search-bar d-flex justify-content-center align-items-center">
//           <div className="input-group w-75">
//             <span className="input-group-text"><FaSearch /></span>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search for products..."
//               value={searchQuery}
//               onChange={handleSearch}
//             />
//           </div>
//           <label className="btn btn-outline-secondary ms-2">
//             <FaImage size={20} />
//             <input
//               type="file"
//               accept="image/*"
//               hidden
//               onChange={handleImageUpload}
//             />
//           </label>
//           <button
//             className="btn btn-outline-primary ms-2"
//             onClick={handleVoiceSearch}
//           >
//             {listening ? "Listening..." : <FaMicrophone size={20} />}
//           </button>
//         </div>
//       </div>

//       {/* Products List */}
//       <div className="container mt-5">
//         <h2 className="text-center mb-4">Shop Your Favorite Outfits</h2>
//         <div className="row">
//           {products.map((product) => (
//             <div key={product._id} className="col-md-4 mb-4">
//               <div className="card product-card">
//                 <img src={product.img} className="card-img-top" alt={product.title} />
//                 <div className="card-body text-center">
//                   <h5 className="card-title">{product.title}</h5>
//                   <p className="card-text">{product.price}</p>
//                   <Link to={`/products/${product._id}`} className="btn btn-dark">View Details</Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="footer bg-dark text-light text-center p-3 mt-5">
//         <p>&copy; 2025 ShopEase | All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Products;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaImage, FaMicrophone } from "react-icons/fa";
import "./Products.css";

const Products = () => {
  // State for text search
  const [searchQuery, setSearchQuery] = useState("");
  // State for products fetched from backend
  const [products, setProducts] = useState([]);
  
  // States for image search
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState("");
  
  // States for voice search
  const [transcript, setTranscript] = useState("");
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [listening, setListening] = useState(false);
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch products from backend (fetch all products if searchQuery is empty)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let endpoint = "http://localhost:5000/api/products";
        // Append search query if provided
        if (searchQuery.trim() !== "") {
          endpoint += `?search=${searchQuery}`;
        }
        const response = await axios.get(endpoint);
        console.log("Fetched Products:", response.data);
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

  // Handle image file selection and perform image search
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setImageLoading(true);
    setImageError("");
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/search-by-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Image search response:", response.data);
      // Update products with results from image search
      if(response.data.products){
        setProducts(response.data.products);
      } else {
        setImageError("No products returned from image search.");
      }
    } catch (err) {
      console.error(err);
      setImageError("Error performing image search");
    } finally {
      setImageLoading(false);
    }
  };

  // Handle voice search using the Web Speech API
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Voice recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setTranscript(voiceText);
      // Update text search field with transcript and trigger voice search
      setSearchQuery(voiceText);
      performVoiceSearch(voiceText);
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
      setVoiceError("Voice recognition error occurred");
      setListening(false);
    };

    recognition.start();
  };

  // Function to perform voice search via API call
  const performVoiceSearch = async (queryText) => {
    setVoiceLoading(true);
    setVoiceError("");
    try {
      const response = await axios.get("http://localhost:5000/api/v1/search-by-voice", {
        params: { query: queryText },
      });
      console.log("Voice search response:", response.data);
      // Update products with voice search results
      if(response.data.products){
        setProducts(response.data.products);
      } else {
        setVoiceError("No products returned from voice search.");
      }
    } catch (err) {
      console.error(err);
      setVoiceError("Error performing voice search");
    } finally {
      setVoiceLoading(false);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">ShopEase</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/products">Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/my-orders">Orders</Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/carts">Cart</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">Profile</Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Search Bar Section */}
      <div className="container mt-4">
        <div className="search-bar d-flex justify-content-center align-items-center">
          {/* Text Search Input */}
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
          {/* Image Upload Button */}
          <label className="btn btn-outline-secondary ms-2">
            <FaImage size={20} />
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </label>
          {/* Voice Search Button */}
          <button className="btn btn-outline-primary ms-2" onClick={handleVoiceSearch}>
            {listening ? "Listening..." : <FaMicrophone size={20} />}
          </button>
        </div>
        {transcript && <p className="mt-2">Transcript: {transcript}</p>}
        {imageLoading && <p>Searching by image...</p>}
        {imageError && <p className="error">{imageError}</p>}
        {voiceLoading && <p>Searching by voice...</p>}
        {voiceError && <p className="error">{voiceError}</p>}
      </div>

      {/* Products List Section */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Shop Your Favorite Outfits</h2>
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="col-md-4 mb-4">
                <div className="card product-card">
                  <img src={product.img} className="card-img-top" alt={product.title} />
                  <div className="card-body text-center">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text">{product.price}</p>
                    <Link to={`/products/${product._id}`} className="btn btn-dark">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No products found.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer bg-dark text-light text-center p-3 mt-5">
        <p>&copy; 2025 ShopEase | All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Products;

