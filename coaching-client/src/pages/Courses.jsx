import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/comman/Loader'; // ✅ import Loader

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_dummy';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loader state
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
      setLoading(false); // ✅ hide loader after fetching
    }
  };

  const handleEnrollClick = async (course) => {
    if (isLoading) return;

    if (!user || !isStudent) {
      alert('Please login as a student to enroll.');
      navigate('/student/login');
      return;
    }

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
            setLoading(true); // ✅ show loader after payment before redirect

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
            }, 1500); // ⏳ smooth transition after showing loader
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
          color: '#F6E05E',
        },
      });

      rzp.open();
    } catch (err) {
      console.error('Enrollment failed:', err.response?.data || err.message);
      alert('Payment failed. Please try again.');
    }
  };

  // ✅ Show loader while loading
  if (loading) return <Loader />;

  return (
    <div className="pt-24 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Courses</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-2">{course.title}</h2>
            <p className="text-gray-700 mb-1">{course.description}</p>
            <p className="text-sm">Duration: {course.duration}</p>
            <p className="text-sm">Faculty: {course.faculty}</p>
            <p className="text-lg font-bold text-green-700 mt-2">₹{course.price}</p>
            <button
              onClick={() => handleEnrollClick(course)}
              className="mt-3 bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 w-full"
            >
              Enroll Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
