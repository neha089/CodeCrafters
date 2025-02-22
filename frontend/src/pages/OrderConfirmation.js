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
      

      

      <Link to="/" className="btn btn-primary mt-3">Continue Shopping</Link>
    </div>
  );
};

export default OrderConfirmation;
