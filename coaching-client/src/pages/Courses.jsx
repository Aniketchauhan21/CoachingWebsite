import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/comman/Loader';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_dummy';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingCourse, setEnrollingCourse] = useState(null);
  const { user, isStudent, isLoading, getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = async (course) => {
    if (isLoading) return;

    if (!user || !isStudent) {
      alert('Please login as a student to enroll.');
      navigate('/student/login');
      return;
    }

    setEnrollingCourse(course.id);

    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };

      // Step 1: Create Razorpay order
      const orderRes = await axios.post(
        `${API_URL}/payments/create-order`,
        { course_id: course.id, amount: course.price },
        { headers }
      );

      const { order } = orderRes.data;

      // Step 2: Load Razorpay script if not already
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        document.body.appendChild(script);
        await new Promise((resolve) => (script.onload = resolve));
      }

      // Step 3: Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: 'INR',
        name: 'Maharishi Coaching',
        description: course.title,
        order_id: order.id,
        handler: async (response) => {
          try {
            setLoading(true);

            await axios.post(
              `${API_URL}/payments/verify`,
              {
                course_id: course.id,
                amount_paid: course.price,
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                signature: response.razorpay_signature,
              },
              { headers }
            );

            setTimeout(() => {
              navigate(`/payment-success?course=${encodeURIComponent(course.title)}`);
            }, 1500);
          } catch (err) {
            console.error('Verification failed:', err);
            alert('Payment verification failed.');
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#eda835',
        },
      });

      rzp.open();
    } catch (err) {
      console.error('Enrollment failed:', err.response?.data || err.message);
      alert('Payment failed. Please try again.');
    } finally {
      setEnrollingCourse(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
              Our Courses
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto opacity-90 animate-fade-in-up animation-delay-300">
              Choose from our comprehensive range of courses designed to help you achieve your goals
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group"
              >
                {/* Course Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                  <h2 className="text-xl lg:text-2xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                    {course.title}
                  </h2>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100 text-sm font-medium">Course</span>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6 lg:p-8">
                  <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>
                  
                  {/* Course Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="font-medium">Duration:</span>
                      <span className="ml-2">{course.duration}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span className="font-medium">Faculty:</span>
                      <span className="ml-2">{course.faculty}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-yellow-600">₹{course.price}</span>
                      <span className="text-gray-500 text-sm ml-2">per course</span>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Best Value
                    </div>
                  </div>

                  {/* Enroll Button */}
                  <button
                    onClick={() => handleEnrollClick(course)}
                    disabled={enrollingCourse === course.id}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform ${
                      enrollingCourse === course.id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 hover:scale-105 hover:shadow-lg'
                    }`}
                  >
                    {enrollingCourse === course.id ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <span>Enroll Now</span>
                        <svg className="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {/* Course Features */}
                <div className="bg-gray-50 px-6 lg:px-8 py-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span>Expert Faculty</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span>Certificate</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {courses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Available</h3>
              <p className="text-gray-600">Check back later for new courses.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Courses;