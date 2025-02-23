// 

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css";
import { jwtDecode } from "jwt-decode";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user); // Ensure JSON parsing if stored as an object
        setDecodedToken(jwtDecode(parsedUser.token)); // Decode token only if user exists
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Error decoding token:", err);
        setIsLoggedIn(false);
      }
    }
  }, []);

  // Fetch product details from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data); // Update state with fetched product
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <h2 className="text-center mt-5">Loading...</h2>;
  if (error) return <h2 className="text-center mt-5">{error}</h2>;

  const addToCart = () => {
    if (!isLoggedIn) {
      alert("Please log in to add items to your cart.");
      navigate("/login"); // Redirect to login page
      return;
    }

    axios
      .post("http://localhost:5000/api/carts", {
        userId: decodedToken?.id, // Safe access
        name: product.title,
        price: product.price,
        img: product.img,
        quantity: 1,
      })
      .then(() => {
        alert("Item added to cart!"); // Show success alert
        navigate("/carts"); // Redirect to Cart page
      })
      .catch((error) => console.error("Error adding to cart:", error));
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
              <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/my-orders">Orders</Link></li>
              {isLoggedIn ? (
                              <ul className="navbar-nav ms-auto">
                              <li className="nav-item">
                              <Link className="nav-link" to="/carts">Cart</Link>
                              </li>
                              <li className="nav-item">
                                <Link className="nav-link" to="/profile">Profile</Link>
                              </li>
                              </ul>
                            ) : (
                              <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                              </li>
                            )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <img src={product.img} alt={product.title} className="img-fluid product-image" />
          </div>
          <div className="col-md-6">
            <h2>{product.title}</h2>
            <p className="text-muted">{product.price}</p>
            <p>{product.description}</p>

            <button className="btn btn-secondary" onClick={addToCart}>
              Add to Cart
            </button>
            <br /><br />
            <Link to="/products" className="btn btn-secondary">Back to Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
