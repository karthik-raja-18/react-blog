import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Home.css';
import Header from './Header';

const HomePage = () => {
  const location = useLocation();
  const { username } = location.state || {}; // Get username from state if available
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLatestBlogs(); // Fetch the latest 3 blogs
    fetchAllBlogs(); // Fetch all blogs to display as feed
  }, []);

  // Fetch latest 3 blogs
  const fetchLatestBlogs = async () => {
    try {
      const response = await fetch('https://react-blog-j51y.onrender.com/blogs/latest');
      if (!response.ok) {
        throw new Error('Failed to fetch latest blogs');
      }
      const data = await response.json();
      setLatestBlogs(data.blogs);
    } catch (error) {
      console.error('Failed to fetch latest blogs:', error);
    }
  };

  // Fetch all blogs for the feed
  const fetchAllBlogs = async () => {
    try {
      const response = await fetch('http://https://react-blog-j51y.onrender.com/blogs');
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await response.json();
      setBlogs(data.blogs);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    }
  };

  // Handle search query
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      fetchAllBlogs(); // Refetch all blogs if search query is empty
      return;
    }

    try {
      const response = await fetch(`http://https://react-blog-j51y.onrender.com/blogs/search?q=${searchQuery}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setBlogs(data.blogs);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="homePage">
      {/* Header Section */}
      <Header 
        username={username} 
        handleSearch={handleSearch} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

     {/* Welcome Section */}
<div className="welcomeSection">
  <h1 className="title">
    Welcome {username ? `${username}` : 'to My Blog'}!
  </h1>
  <p className="subtitle">
    {username 
      ? `Welcome back, ${username}! Explore the latest blogs and start your own.` 
      : 'Welcome to the world of ideas and inspiration. We are glad to have you here!'}
  </p>
</div>


      {/* Latest Blogs Section */}
      <div className="latestBlogs">
        <h2>Latest Blogs</h2>
        {latestBlogs.length === 0 ? (
          <p>No blogs found</p>
        ) : (
          latestBlogs.map((blog) => (
            <div key={blog._id} className="blogCard" onClick={() => navigate(`/blog/${blog._id}`)}>
              <h3>{blog.title}</h3>
              <p>{blog.content.slice(0, 100)}...</p>
              <p><strong>Author:</strong> {blog.author}</p>
            </div>
          ))
        )}
      </div>

{/* Search Bar */}
<div className="searchBarContainer">
  <input
    type="text"
    className="search-bar"
    placeholder="Search blogs by title, content, category, or author..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)} // trigger search on Enter
  />
</div>


      {/* Blog Feed Section */}
      <div className="blogFeed">
        <h2>All Blogs</h2>
        <div className="blogGrid">
          {blogs.length === 0 ? (
            <p>No blogs found</p>
          ) : (
            blogs.map((blog) => (
              <div key={blog._id} className="blogCard" onClick={() => navigate(`/blog/${blog._id}`)}>
                <h3>{blog.title}</h3>
                <p>{blog.content.slice(0, 100)}...</p>
                <p><strong>Author:</strong> {blog.author}</p>
              </div>
            ))
          )}
          
        </div>
      </div>
    </div>
  );
};

export default HomePage;
