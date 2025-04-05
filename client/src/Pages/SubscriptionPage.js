import React, { useState } from "react";
import "./SubscriptionPage.css";
import Header from './Header'; // Import the Header component

const SubscriptionPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    plan: "basic",
  });

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribed with:", formData);
    alert("Subscription Successful!");
  };

  return (
    <div>
      <Header /> {/* Include the Header component here */}
      <div className="subscription-container">
        <form className="subscription-form" onSubmit={handleSubmit}>
          <h2>Subscribe to Our Plan</h2>

          <div className="form-group">
            <label>Name:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Select Plan:</label>
            <select name="plan" value={formData.plan} onChange={handleChange}>
              <option value="free">Free - ₹0</option>
              <option value="basic">Basic - ₹399/month</option>
              <option value="premium">Premium - ₹999/month</option>
              <option value="pro">Pro - ₹1999/month</option>
            </select>
          </div>

          <button type="submit">Subscribe</button>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionPage;
