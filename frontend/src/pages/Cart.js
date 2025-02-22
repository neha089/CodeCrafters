import React, { useState, useEffect } from "react";
import { Link ,useNavigate} from "react-router-dom";
import axios from "axios";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  
    // Simulate user authentication check
    useEffect(() => {
      const user = localStorage.getItem("user");
      if (user) {
        setIsLoggedIn(true);
      }
    }, []);

  // Fetch cart from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/carts")
      .then((response) => {
        setCart(response.data);
        localStorage.setItem("cart", JSON.stringify(response.data));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        setError("Failed to load cart items.");
        setLoading(false);
      });
      
  }, []);

  // Update quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    axios.put(`http://localhost:5000/api/carts/${id}`, { quantity })
      .then((response) => {
        const updatedCart = cart.map(item => item._id === id ? response.data : item);
      setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      })
      .catch(error => console.error("Error updating quantity:", error));
  };

  // Remove item
  const removeItem = (id) => {
    axios.delete(`http://localhost:5000/api/carts/${id}`)
      .then(() => {
        const updatedCart = cart.filter(item => item._id !== id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      })
      .catch(error => console.error("Error removing item:", error));
  };

  // Calculate total price
  const totalPrice = cart.reduce((acc, item) => {
    const cleanPrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, "")) || 0;
    return acc + cleanPrice * item.quantity;
  }, 0).toFixed(2);
  
  return (
    <div>

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
              <Link className="navbar-brand" to="/">ShopEase</Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
                  <li className="nav-item">
                                  <Link className="nav-link" to="/my-orders">Orders</Link>
                                </li>
                  {isLoggedIn ? (
                    <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
                  ) : (
                    <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                  )}
                </ul>
              </div>
            </div>
          </nav>
    
    <div className="container mt-5">
      <h2 className="text-center">Shopping Cart</h2>

      {loading ? (
        <p className="text-center">Loading cart...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item._id} className="cart-item d-flex align-items-center justify-content-between p-3">
              <img src={item.img} alt={item.name} className="cart-item-img" />
              
              <div className="cart-item-details">
                <h5>{item.name}</h5>
                <p className="text-muted">
                ₹{isNaN(parseFloat(item.price.replace(/[^0-9.]/g, ""))) 
    ? "0.00" 
    : parseFloat(item.price.replace(/[^0-9.]/g, "")).toFixed(2)}
</p>
  </div>

              <input
                type="number"
                className="form-control cart-quantity"
                value={item.quantity}
                onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                min="1"
                disabled={loading}
              />

              <button className="btn btn-danger" onClick={() => removeItem(item._id)}>Remove</button>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="cart-summary mt-4 text-center">
          <h4>Total: ₹{totalPrice}</h4>
          <Link to="/checkout" className="btn btn-success mt-2">Proceed to Checkout</Link>
        </div>
      )}
    </div>
    </div>
  );
};

export default Cart;
