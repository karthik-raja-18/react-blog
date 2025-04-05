import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BlogDetail.css';

const BlogDetailPage = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  // Fetch blog detail by ID
  const fetchBlogDetail = async () => {
    try {
      const response = await fetch(`http://localhost:4000/blogs/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog details');
      }
      const data = await response.json();
      setBlog(data.blog);
    } catch (error) {
      console.error('Error fetching blog details:', error);
    }
  };

  if (!blog) {
    return <div>Loading...</div>; // Loading state while fetching data
  }

  return (
    <div className="blogDetailPage">
      <div className="blogDetail">
        <h1>{blog.title}</h1>
        <p><strong>Author:</strong> {blog.author}</p>
        <p><strong>Category:</strong> {blog.category}</p>
        <p>{blog.content}</p>
        {blog.file && <img src={`http://localhost:4000/${blog.file}`} alt="Blog File" />}
        <button className="backButton" onClick={() => navigate('/home')}>Back to Home</button>
      </div>
    </div>
  );
};

export default BlogDetailPage;
