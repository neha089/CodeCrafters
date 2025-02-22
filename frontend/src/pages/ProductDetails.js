import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data); // Update state with fetched product
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Product not found.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  if (error) {
    return <h2 className="text-center mt-5">{error}</h2>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img src={product.img} alt={product.name} className="img-fluid product-image" />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">{product.price}</p>
          <p>{product.description}</p>
          <Link to="/cart" className="btn btn-secondary">Add to Cart</Link>
          <br/><br/>
          <Link to="/products" className="btn btn-secondary">Back to Products</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
