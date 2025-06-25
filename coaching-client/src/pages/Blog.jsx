import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getImageUrl } from '../utils/getImageUrl';
import Loader from '../components/comman/Loader'; // ✅ Import Loader

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs`);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false); // ✅ Stop loading after fetch
    }
  };

  if (loading) return <Loader />; // ✅ Show loader until blogs load

  return (
    <div style={{ paddingTop: '100px' }}>
      <section className="section">
        <div className="container">
          <h1 className="section-title">Our Blog</h1>
          <div className="cards-grid">
            {blogs.map(blog => (
              <div key={blog.id} className="card">
                {/* Image block */}
                {blog.image_url && (
                  <img
                    src={getImageUrl(blog.image_url)}
                    alt={blog.title}
                    className="blog-image"
                    style={{
                      width: '100%',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      marginBottom: '1rem'
                    }}
                  />
                )}
                <h3>{blog.title}</h3>
                <p>{blog.content}</p>
                <p><small>Published: {new Date(blog.created_at).toLocaleDateString()}</small></p>
                <p><small>Author: {blog.author}</small></p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
