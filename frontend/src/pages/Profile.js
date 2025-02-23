import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      axios
        .get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${userData.token}` },
        })
        .then((response) => {
          setProfile(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Failed to load profile");
          setLoading(false);
        });
    } else {
      setError("User not logged in");
      setLoading(false);
    }
  }, []);

  // Logout function
  const onLogout = () => {
    localStorage.removeItem("user"); // Remove user from localStorage
    navigate("/login"); // Redirect to login page
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5 error">{error}</p>;

  return (
    <div className="container profile-container mt-5">
      <div className="card shadow-lg p-4">
        <div className="text-center">
          <img
            src={profile.profileImage || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-img rounded-circle"
          />
          <h2 className="mt-3">{profile.fullName || profile.username}</h2>
          <p className="text-muted">{profile.email}</p>
        </div>

        <div className="profile-info mt-4">
          <h4>Personal Details</h4>
          <ul className="list-group">
            <li className="list-group-item">
              <strong>Full Name:</strong> {profile.fullName || profile.username}
            </li>
            <li className="list-group-item">
              <strong>Email:</strong> {profile.email}
            </li>
          </ul>
        </div>

        <div className="text-center mt-4">
          <button onClick={onLogout} className="btn btn-danger">
            Logout
          </button>
          <br />
          <br />
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
