import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

const EditProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "John Doe",
    email: "johndoe@example.com",
    phone: "+91 9876543210",
    address: "123, Street Name, City, India",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
    navigate("/profile");
  };

  return (
    <div className="container edit-profile-container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={user.email}
              disabled
            />
          </div>

          <div className="form-group mb-3">
            <label>Phone</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={user.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-3">
            <label>Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={user.address}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-success btn-block mt-3">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
