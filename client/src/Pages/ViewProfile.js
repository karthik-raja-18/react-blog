import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ViewProfile.css';
import Header from './Header';

const ViewProfilePage = () => {
  const location = useLocation();
  const { username } = location.state || {}; 
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      fetchUserDetails(username);
    }
  }, [username]);

  const fetchUserDetails = async (username) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`https://react-blog-j51y.onrender.com/users/${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data = await response.json();
      setUserDetails(data);
      setNewUsername(data.username);
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Failed to load user details');
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Password validation: Must be at least 6 characters
    if (newPassword && newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('newUsername', newUsername);
      formData.append('newPassword', newPassword);
      if (newProfileImage) {
        formData.append('profileImage', newProfileImage);
      }

      const response = await fetch(`https://react-blog-j51y.onrender.com/users/update/${userDetails.username}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      alert('Profile updated successfully!');
      fetchUserDetails(newUsername); // Refresh profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewProfileImage(file);
    setImagePreview(URL.createObjectURL(file)); // Preview image
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="viewProfilePage">
      <Header />
      <h1>Your Profile</h1>

      {loading ? (
        <p className="loading">Loading your profile...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : userDetails ? (
        <div className="profileDetails">
          <p><strong>Username:</strong> {userDetails.username}</p>
          {userDetails.profileImage && (
            <img src={`https://react-blog-j51y.onrender.com/uploads/${userDetails.profileImage}`} alt="Profile" />
          )}

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>New Username:</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              {passwordError && <p className="error">{passwordError}</p>}
            </div>

            <div className="form-group">
              <label>Upload Profile Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && <img src={imagePreview} alt="Preview" className="imagePreview" />}
            </div>

            <button type="submit">Update Profile</button>
          </form>

          <button onClick={handleLogout} className="logoutButton">Logout</button>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default ViewProfilePage;
