import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyOrders.css"; 
import { Link ,useNavigate} from "react-router-dom";
// Add your custom styles
import { jwtDecode } from "jwt-decode";
 
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = localStorage.getItem("user");

          const decodedToken = jwtDecode(user)
          console.log(decodedToken.id);


          const navigate = useNavigate();
  
          // Simulate user authentication check
          useEffect(() => {
            const user = localStorage.getItem("user");
            if (user) {
              setIsLoggedIn(true);
            }
          }, []);
  useEffect(() => {
    const fetchOrders = async () => {
      try{
        const response = await axios.get(
          `http://localhost:5000/api/orders/my-orders?userId=${decodedToken.id}`
        );
           setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

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
    <div className="container my-orders">
      <h2 className="text-center">My Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Products</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.products.map((p, index) => (
                    <div key={index}>
                      {p.name} - {p.quantity}x
                    </div>
                  ))}
                </td>
                <td>₹{order.totalPrice}</td>
                <td>{order.orderStatus}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
};

export default MyOrders;
