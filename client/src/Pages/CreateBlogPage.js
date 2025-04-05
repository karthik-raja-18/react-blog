import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateBlog.css';
import Header from './Header'; // Import Header

const CreateBlogPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState(''); // State for custom category input
  const [externalLink, setExternalLink] = useState('');
  const navigate = useNavigate();

  const categories = [
    'Technology', 'Health', 'Lifestyle', 'Education', 'Travel', 'Food', 'Business', 
    'Entertainment', 'Sports', 'Fashion', 'Others'
  ]; // List of predefined categories

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure all required fields are filled
    if (!title || !content || !author || (!category && !customCategory)) {
      alert('Please fill all the required fields');
      return;
    }

    const blogData = {
      title,
      content,
      author,
      category: category === 'Others' ? customCategory : category, // Use custom category if "Others" is selected
      externalLink,
    };

    try {
      const response = await fetch('http://localhost:4000/blogs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      const data = await response.json();
      if (response.status === 200) {
        // Blog created successfully, navigate to MyBlogPage
        alert(data.message);
        navigate('/blogs'); // Use the correct route to view blogs
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('There was an error creating your blog. Please try again.');
    }
  };

  return (
    <div>
      <Header /> {/* Include Header */}

      <div className="create-blog-form">
        <h2>Create Blog</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Show custom category input if "Others" is selected */}
            {category === 'Others' && (
              <input
                type="text"
                placeholder="Enter custom category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            )}
          </div>

          <button type="submit">Post Blog</button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPage;