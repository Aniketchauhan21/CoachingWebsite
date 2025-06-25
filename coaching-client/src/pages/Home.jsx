import React, { useState, useEffect } from 'react';
import axios from 'axios';
import YouTubeSlider from '../components/YouTubeSlider';
import Loader from '../components/comman/Loader';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    Promise.all([fetchCourses(), fetchBlogs()]).then(() => setLoading(false));
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs`);
      setBlogs(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const toggleShowCourses = () => {
    setShowAllCourses(!showAllCourses);
  };

  if (loading) return <Loader />; // ✅ show loader while loading

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Welcome to CoachingHub</h1>
          <p>Your gateway to success - Best coaching institute with expert faculty</p>
          <a href="#courses" className="btn">Explore Courses</a>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section" id="courses">
        <div className="container">
          <h2 className="section-title">Featured Courses</h2>
          <div className="cards-grid">
            {courses.slice(0, showAllCourses ? courses.length : 3).map(course => (
              <div key={course.id} className="card">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p><strong>Duration:</strong> {course.duration}</p>
                <p><strong>Price:</strong> ₹{course.price}</p>
                <p><strong>Faculty:</strong> {course.faculty}</p>
                <a href={`/courses`} className="btn">Learn More</a>
              </div>
            ))}
          </div>

          {courses.length > 3 && (
            <button
              className="btn"
              onClick={toggleShowCourses}
              style={{
                display: 'block',
                margin: '20px auto',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                textAlign: 'center',
              }}
            >
              {showAllCourses ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title">Latest Blog Posts</h2>
          <div className="cards-grid">
            {blogs.map(blog => (
              <div key={blog.id} className="card">
                {blog.image_url && (
                  <img
                    src={`${API_URL}${blog.image_url}`}
                    alt={blog.title}
                    style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '10px', marginBottom: '1rem' }}
                  />
                )}
                <h3>{blog.title}</h3>
                <p>{blog.content.substring(0, 150)}...</p>
                <p><small>Published: {new Date(blog.created_at).toLocaleDateString()}</small></p>
                <a href={`/blog`} className="btn">Read More</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Videos Section */}
      <YouTubeSlider />

      {/* Why Choose Us */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="cards-grid">
            <div className="card">
              <h3>Expert Faculty</h3>
              <p>Learn from industry experts with years of experience</p>
            </div>
            <div className="card">
              <h3>Comprehensive Curriculum</h3>
              <p>Complete syllabus coverage with practical examples</p>
            </div>
            <div className="card">
              <h3>Flexible Timings</h3>
              <p>Choose from multiple batch timings as per your convenience</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
