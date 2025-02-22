import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

const initialCart = [
  { id: 1, name: "Stylish Jacket", price: 49.99, img: "https://via.placeholder.com/100", quantity: 1 },
  { id: 2, name: "Casual T-Shirt", price: 19.99, img: "https://via.placeholder.com/100", quantity: 2 },
];

const Cart = () => {
  const [cart, setCart] = useState(initialCart);

  const updateQuantity = (id, quantity) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)));
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item d-flex align-items-center justify-content-between p-3">
              <img src={item.img} alt={item.name} className="cart-item-img" />
              <div className="cart-item-details">
                <h5>{item.name}</h5>
                <p className="text-muted">${item.price.toFixed(2)}</p>
              </div>
              <input
                type="number"
                className="form-control cart-quantity"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                min="1"
              />
              <button className="btn btn-danger" onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
      <div className="cart-summary mt-4 text-center">
        <h4>Total: ${totalPrice}</h4>
        <Link to="/Checkout" className="btn btn-success mt-2">Proceed to Checkout</Link>
      </div>
    </div>
  );
};

export default Cart;
