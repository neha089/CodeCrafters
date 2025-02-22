import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup) {
      // Basic check for password match
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      try {
        // Call backend register endpoint
        const response = await axios.post("http://localhost:5000/api/users/register", {
          username: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
        alert(response.data.message || "Registration successful!");
        // Optionally switch to login form after successful registration
        setIsSignup(false);
      } catch (err) {
        setError(err.response?.data.message || "Registration failed");
      }
    } else {
      try {
        // Call backend login endpoint
        const response = await axios.post("http://localhost:5000/api/users/login", {
          email: formData.email,
          password: formData.password,
        });
        // Store token or user data (here we store the token in localStorage)
        localStorage.setItem("user", JSON.stringify(response.data));

        
   
    
        // Redirect to profile or home page
        navigate("/");
      } catch (err) {
        setError(err.response?.data.message || "Login failed");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <FaShoppingBag className="shop-icon" />
          <h2>ShopEase</h2>
        </div>

        <h3>{isSignup ? "Create an Account" : "Welcome Back!"}</h3>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your name"
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>

          {isSignup && (
            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                onChange={handleChange}
                required
              />
            </div>
          )}

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="switch-text">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button className="toggle-btn" onClick={toggleForm}>
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>

        <Link to="/" className="back-home">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Login;
