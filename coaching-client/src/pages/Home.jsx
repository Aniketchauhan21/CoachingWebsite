import React, { useState, useEffect } from 'react';
import axios from 'axios';
import YouTubeSlider from '../components/YouTubeSlider';
import Loader from '../components/comman/Loader';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white pt-32 py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            Welcome to CoachingHub
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90 animate-fade-in-up animation-delay-300">
            Your gateway to success - Best coaching institute with expert faculty
          </p>
          <a 
            href="#courses" 
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-fade-in-up animation-delay-600"
          >
            Explore Courses
          </a>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400 rounded-full opacity-10"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white rounded-full opacity-5"></div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 lg:py-24 bg-white" id="courses">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-12">
            Featured Courses
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {courses.slice(0, showAllCourses ? courses.length : 3).map(course => (
              <div 
                key={course.id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group"
              >
                <div className="p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-blue-600 mb-4 group-hover:text-blue-700 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {course.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">Duration:</span> {course.duration}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">Price:</span> 
                      <span className="text-yellow-600 font-bold"> ₹{course.price}</span>
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">Faculty:</span> {course.faculty}
                    </p>
                  </div>
                  
                  <a 
                    href="/courses" 
                    className="inline-block w-full text-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            ))}
          </div>

          {courses.length > 3 && (
            <div className="text-center mt-12">
              <button
                onClick={toggleShowCourses}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                {showAllCourses ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-12">
            Latest Blog Posts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {blogs.map(blog => (
              <div 
                key={blog.id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                {blog.image_url && (
                  <div className="overflow-hidden">
                    <img
                      src={`${API_URL}${blog.image_url}`}
                      alt={blog.title}
                      className="w-full h-48 lg:h-52 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-blue-600 mb-4 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {blog.content.substring(0, 150)}...
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Published: {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                  
                  <a 
                    href="/blog" 
                    className="inline-block w-full text-center bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Read More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Videos Section */}
      <YouTubeSlider />

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-12">
            Why Choose Us?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 lg:p-8 text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-blue-600 mb-4">Expert Faculty</h3>
              <p className="text-gray-600 leading-relaxed">Learn from industry experts with years of experience</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 lg:p-8 text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-yellow-100">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-yellow-600 mb-4">Comprehensive Curriculum</h3>
              <p className="text-gray-600 leading-relaxed">Complete syllabus coverage with practical examples</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 lg:p-8 text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100 md:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-green-600 mb-4">Flexible Timings</h3>
              <p className="text-gray-600 leading-relaxed">Choose from multiple batch timings as per your convenience</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;