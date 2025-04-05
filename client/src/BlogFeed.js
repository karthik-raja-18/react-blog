import React, { useState, useEffect } from 'react';

const BlogFeed = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/feed`);
                if (!response.ok) {
                    throw new Error('Failed to fetch blogs');
                }
                const data = await response.json();
                setBlogs(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) return <p>Loading blogs...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Blog Feed</h1>
            {blogs.map((blog) => (
                <div key={blog._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                    <h2>{blog.title}</h2>
                    <p><strong>Author:</strong> {blog.author}</p>
                    <p><strong>Category:</strong> {blog.category}</p>
                    <p>{blog.content}</p>
                </div>
            ))}
        </div>
    );
};

export default BlogFeed;
