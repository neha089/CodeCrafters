import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Use named import
import { Link } from "react-router-dom";


const Checkout = () => {
  const navigate = useNavigate();
  let [user, setUser] = useState(null); 
  const [cart, setCart] = useState([]); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    zip: "",
    paymentMethod: "Card",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // Fetch user, cart, and stored form data
  user = localStorage.getItem("user");
        const decodedToken = jwtDecode(user)
  useEffect(() => {
        
        console.log(decodedToken);
        if (user) {
          setIsLoggedIn(true);
        }
      }, []);
  useEffect(() => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const savedForm = JSON.parse(localStorage.getItem("checkoutForm")) || {};

      if (loggedInUser) setUser(loggedInUser);
      setCart(savedCart);
      setFormData((prev) => ({ ...prev, ...savedForm }));
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  }, []);

  // Calculate total price
  const calculateTotalPrice = () => {
    return cart
      .reduce((total, item) => {
        const cleanPrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, "")) || 0;
        return total + cleanPrice * item.quantity;
      }, 0)
      .toFixed(2);
  };

  // Handle input changes & store in localStorage
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
    localStorage.setItem("checkoutForm", JSON.stringify(updatedForm));
  };

  // Validate card details if payment method is "Card"
  const validateCardDetails = () => {
    if (formData.paymentMethod === "Card") {
      const cardRegex = /^[0-9]{16}$/;
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      const cvvRegex = /^[0-9]{3}$/;

      if (!cardRegex.test(formData.cardNumber)) {
        alert("Invalid Card Number. Must be 16 digits.");
        return false;
      }
      if (!expiryRegex.test(formData.expiry)) {
        alert("Invalid Expiry Date. Format MM/YY.");
        return false;
      }
      if (!cvvRegex.test(formData.cvv)) {
        alert("Invalid CVV. Must be 3 digits.");
        return false;
      }
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to proceed with checkout.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!validateCardDetails()) return;

    const orderData = {
      userId: decodedToken.id,
      products: cart.map((item) => ({
        name:item.name,
        quantity: item.quantity,
      })),
      totalPrice: calculateTotalPrice(),
      shippingInfo: {
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
      },
      paymentMethod: formData.paymentMethod,
      cardDetails:
        formData.paymentMethod === "Card"
          ? {
              cardNumber: formData.cardNumber,
              expiry: formData.expiry,
              cvv: formData.cvv,
            }
          : undefined, 
    };

    try {
      const response = await axios.post("http://localhost:5000/api/orders", orderData);

      if (response.status === 201) {
        alert("Order placed successfully!");
        localStorage.removeItem("cart"); 
        localStorage.removeItem("checkoutForm"); 
        navigate("/order-confirmation");
      }
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      alert("Failed to place order. Please try again.");
    }
  };

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
                  {isLoggedIn ? (
                    <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
                  ) : (
                    <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                  )}
                </ul>
              </div>
            </div>
          </nav>
    <div className="container checkout-container mt-5">
      <h2 className="text-center">Checkout</h2>
      <form className="checkout-form" onSubmit={handleSubmit}>
        {/* Shipping Details */}
        <div className="form-group">
          <label>Address</label>
          <input type="text" name="address" className="form-control" required value={formData.address} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>City</label>
          <input type="text" name="city" className="form-control" required value={formData.city} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>ZIP Code</label>
          <input type="text" name="zip" className="form-control" required value={formData.zip} onChange={handleChange} />
        </div>

        {/* Order Summary */}
        <h4 className="mt-4">Order Summary</h4>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="list-group">
            {cart.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {item.name} (x{item.quantity})
                <span>₹{(parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
        <h5 className="mt-3">Total Price: ₹{calculateTotalPrice()}</h5>

        {/* Payment Method Selection */}
        <h4 className="mt-4">Payment Method</h4>
        <div className="payment-options">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              value="Card"
              checked={formData.paymentMethod === "Card"}
              onChange={handleChange}
              id="cardPayment"
            />
            <label className="form-check-label" htmlFor="cardPayment">
              Pay with Card
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              value="Cash on Delivery"
              checked={formData.paymentMethod === "Cash on Delivery"}
              onChange={handleChange}
              id="codPayment"
            />
            <label className="form-check-label" htmlFor="codPayment">
              Cash on Delivery (COD)
            </label>
          </div>
        </div>

        {/* Card Details */}
        {formData.paymentMethod === "Card" && (
          <>
            <h4 className="mt-4">Card Details</h4>
            <div className="form-group">
              <label>Card Number</label>
              <input type="text" name="cardNumber" className="form-control" required value={formData.cardNumber} onChange={handleChange} />
            </div>
            <div className="row">
              <div className="col-md-6 form-group">
                <label>Expiry Date</label>
                <input type="text" name="expiry" className="form-control" placeholder="MM/YY" required value={formData.expiry} onChange={handleChange} />
              </div>
              <div className="col-md-6 form-group">
                <label>CVV</label>
                <input type="text" name="cvv" className="form-control" required value={formData.cvv} onChange={handleChange} />
              </div>
            </div>
          </>
        )}

        <button type="submit" className="btn btn-success btn-block mt-3">
          Place Order
        </button>
      </form>
    </div>
    </div>
  );
};

export default Checkout;
