import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css"; // Ensure this file contains necessary styles

const Home = () => {
  const [user, setUser] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  // Fetch user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch featured products from backend
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/");
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  // Fetch recommended products (top 3) if user is logged in
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      if (user && user._id) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/recommendations/${user._id}`
          );
          // Assuming the endpoint returns an array of recommended products,
          // we take only the top 3.
          setRecommendedProducts(response.data.recommendations.slice(0, 3));
        } catch (error) {
          console.error("Error fetching recommended products:", error);
        } finally {
          setLoadingRecommended(false);
        }
      } else {
        // If no user is logged in, stop loading recommended products.
        setLoadingRecommended(false);
      }
    };
    fetchRecommendedProducts();
  }, [user]);

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
              {user ? (
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

      {/* Hero Section */}
      <header className="hero-section text-center">
        <div className="container">
          <h1 className="display-4 fw-bold" style={{ color: "black" }}>Try Clothes in 3D Before Buying!</h1>
          <p className="lead" style={{ color: "black" }}>Experience Virtual Fitting with AI-powered Visualization</p>
          <Link to="/products" className="btn btn-primary btn-lg mt-3">Explore Now</Link>
        </div>
      </header>

      {/* Recommended Products Section (shown only if user is logged in) */}
      {user && (
        <section className="recommended-products container mt-5">
          <h2 className="text-center mb-4">Recommended For You</h2>
          {loadingRecommended ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status"></div>
              <p>Loading recommendations...</p>
            </div>
          ) : recommendedProducts.length > 0 ? (
            <div className="row">
              {recommendedProducts.map((product) => (
                <div className="col-md-4" key={product._id}>
                  <div className="card product-card">
                    <img src={product.img} className="card-img-top" alt={product.name} />
                    <div className="card-body text-center">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text text-muted">{product.description}</p>
                      <h6 className="fw-bold text-primary">${product.price}</h6>
                      <Link to={`/products/${product._id}`} className="btn btn-dark">
                        View More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center"></p>
          )}
        </section>
      )}

      {/* Featured Products Section */}
      <section className="featured-products container mt-5">
  <h2 className="text-center mb-4"></h2>
  {loadingFeatured ? (
    <div className="text-center">
      <div className="spinner-border text-primary" role="status"></div>
      <p>Loading products...</p>
    </div>
  ) : featuredProducts?.length > 0 ? (
    <div className="row">
      {featuredProducts.slice(0, 3).map((product) => (
        <div className="col-md-4" key={product._id}>
          <div className="card product-card">
            <img src={product.img} className="card-img-top" alt={product.name} />
            <div className="card-body text-center">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text text-muted">{product.description}</p>
              <h6 className="fw-bold text-primary">${product.price}</h6>
              <Link to={`/products/${product._id}`} className="btn btn-dark">
                View More
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-muted">No products available.</p>
  )}
</section>


      {/* Footer */}
      <footer className="footer bg-dark text-light text-center p-3 mt-5">
        <p>&copy; 2025 ShopEase | All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
