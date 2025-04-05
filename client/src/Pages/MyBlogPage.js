import React, { useEffect, useState } from 'react';
import Header from './Header';
import './ManageBlog.css';

const MyBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [updatedContent, setUpdatedContent] = useState({ title: '', content: '', category: '' });
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetch blogs from backend
  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:4000/blogs');
      const data = await response.json();
      setBlogs(data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open edit form
  const startEditing = (blog) => {
    setEditingBlog(blog._id);
    setUpdatedContent({ title: blog.title, content: blog.content, category: blog.category });
  };

  // Handle blog update
  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });

      const result = await response.json();

      if (response.ok) {
        fetchBlogs(); // Refresh UI
        setEditingBlog(null); // Exit edit mode
      } else {
        console.error('Update failed:', result.error);
      }
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  // Handle blog deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/blogs/${id}`, { method: 'DELETE' });

      const result = await response.json();

      if (response.ok) {
        setBlogs(blogs.filter((blog) => blog._id !== id)); // Remove from UI
      } else {
        console.error('Delete failed:', result.error);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div className="my-blogs">
      <Header />

      {/* Search Bar */}
      <input
        type="text"
        
        placeholder="Search blogs by title, content, category, or author..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {filteredBlogs.length > 0 ? (
        <ul>
          {filteredBlogs.map((blog) => (
            <li key={blog._id}>
              {editingBlog === blog._id ? (
                // Edit Form
                <div className="edit-form">
                  <input
                    type="text"
                    value={updatedContent.title}
                    onChange={(e) => setUpdatedContent({ ...updatedContent, title: e.target.value })}
                    placeholder="Enter title"
                  />
                  <textarea
                    value={updatedContent.content}
                    onChange={(e) => setUpdatedContent({ ...updatedContent, content: e.target.value })}
                    placeholder="Enter content"
                  />
                  <input
                    type="text"
                    value={updatedContent.category}
                    onChange={(e) => setUpdatedContent({ ...updatedContent, category: e.target.value })}
                    placeholder="Enter category"
                  />
                  <button onClick={() => handleUpdate(blog._id)}>Save</button>
                  <button onClick={() => setEditingBlog(null)}>Cancel</button>
                </div>
              ) : (
                // Display Blog
                <>
                  <h3>{blog.title}</h3>
                  <p className="category"><strong>Category:</strong> {blog.category}</p>
                  <p dangerouslySetInnerHTML={{ __html: blog.content }}></p>
                  <p><strong>Author:</strong> {blog.author}</p>
                  <p><strong>Posted on:</strong> {new Date(blog.createdAt).toLocaleDateString()}</p>

{/* Buttons */}
<button 
  onClick={() => startEditing(blog)} 
  style={{
    background: 'linear-gradient(to right, #4A90E2, #007AFF)',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '8px',
    transition: '0.3s',
  }}
  onMouseOver={(e) => e.target.style.opacity = 0.8}
  onMouseOut={(e) => e.target.style.opacity = 1}
>
  Edit
</button>

<button 
  onClick={() => handleDelete(blog._id)} 
  style={{
    background: 'linear-gradient(to right, #FF3D00, #D50000)', // Red gradient
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: '0.3s',
  }}
  onMouseOver={(e) => e.target.style.opacity = 0.8}
  onMouseOut={(e) => e.target.style.opacity = 1}
>
  Delete
</button>

                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No blogs found</p>
      )}
    </div>
  );
};

export default MyBlogPage;
