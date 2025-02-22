import React from "react";
import { Link } from "react-router-dom";
import "./OrderConfirmation.css";
import { FaCheckCircle } from "react-icons/fa";

const OrderConfirmation = () => {
  return (
    <div className="container order-confirmation text-center mt-5">
      <FaCheckCircle className="success-icon" />
      <h2>Thank You for Your Order!</h2>
      <p>Your order has been successfully placed.</p>
      <p>A confirmation email has been sent to your registered email address.</p>

      <div className="order-summary">
        <h4>Order Summary</h4>
        <p>Order ID: <strong>#123456</strong></p>
        <p>Estimated Delivery: <strong>3-5 Business Days</strong></p>
      </div>

      <Link to="/" className="btn btn-primary mt-3">Continue Shopping</Link>
    </div>
  );
};

export default OrderConfirmation;
