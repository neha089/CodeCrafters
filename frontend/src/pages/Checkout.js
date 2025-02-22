import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import { Link } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Order placed successfully!");
    navigate("/");
  };

  return (
    <div className="container checkout-container mt-5">
      <h2 className="text-center">Checkout</h2>
      <form className="checkout-form" onSubmit={handleSubmit}>
        {/* Shipping Details */}
        <h4>Shipping Details</h4>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="fullName" className="form-control" required onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" className="form-control" required onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" name="address" className="form-control" required onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>City</label>
          <input type="text" name="city" className="form-control" required onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>ZIP Code</label>
          <input type="text" name="zip" className="form-control" required onChange={handleChange} />
        </div>

        {/* Payment Details */}
        <h4 className="mt-4">Payment Details</h4>
        <div className="form-group">
          <label>Card Number</label>
          <input type="text" name="cardNumber" className="form-control" required onChange={handleChange} />
        </div>
        <div className="row">
          <div className="col-md-6 form-group">
            <label>Expiry Date</label>
            <input type="text" name="expiry" className="form-control" placeholder="MM/YY" required onChange={handleChange} />
          </div>
          <div className="col-md-6 form-group">
            <label>CVV</label>
            <input type="text" name="cvv" className="form-control" required onChange={handleChange} />
          </div>
        </div>
        <Link to="/order-confirmation" className="btn btn-success btn-block mt-3">Place Order</Link>
      </form>
    </div>
  );
};

export default Checkout;
