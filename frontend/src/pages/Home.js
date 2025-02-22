import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [user, setUser] = useState(null);

  // Check localStorage for user info on component mount
 useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser)); // Parse the JSON string into an object
  }
}, []);


  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">3D Clothing</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/products">Products</Link>
              </li>
              {user ? (
                <li className="nav-item">
                  {/* Display the user's name instead of "Profile" */}
                  <Link className="nav-link" to="/profile">profile</Link>
                </li>
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
      <header className="hero-section">
        <div className="container text-center">
          <h1>Try Clothes in 3D Before Buying!</h1>
          <p>Experience Virtual Fitting with AI-powered Visualization</p>
          <Link to="/products" className="btn btn-primary">Explore Now</Link>
        </div>
      </header>

      {/* Featured Products Section */}
      <section className="featured-products container mt-5">
        <h2 className="text-center">Featured Products</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <img src="https://via.placeholder.com/300" className="card-img-top" alt="Product 1" />
              <div className="card-body">
                <h5 className="card-title">Stylish Jacket</h5>
                <p className="card-text">Experience 3D Try-On.</p>
                <Link to="/products" className="btn btn-dark">View More</Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <img src="https://via.placeholder.com/300" className="card-img-top" alt="Product 2" />
              <div className="card-body">
                <h5 className="card-title">Casual T-Shirt</h5>
                <p className="card-text">Best quality fabric.</p>
                <Link to="/products" className="btn btn-dark">View More</Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <img src="https://via.placeholder.com/300" className="card-img-top" alt="Product 3" />
              <div className="card-body">
                <h5 className="card-title">Trendy Jeans</h5>
                <p className="card-text">Perfect fit for you.</p>
                <Link to="/products" className="btn btn-dark">View More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-dark text-light text-center p-3 mt-5">
        <p>&copy; 2025 3D Clothing | All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
