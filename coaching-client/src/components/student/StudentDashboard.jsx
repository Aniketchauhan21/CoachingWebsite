import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Loader from '../comman/Loader';
import YouTubeSlider from '../YouTubeSlider';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_dummy';

const StudentDashboard = () => {
  const { user: authUser, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser);
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/student/login');
        }
      } else {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/student/login');
        }
      }
    }
  }, [authUser, navigate]);

  useEffect(() => {
    if (currentUser && location.pathname === '/student/dashboard') {
      const urlParams = new URLSearchParams(location.search);
      const fromPayment = urlParams.get('fromPayment');
      
      if (fromPayment === 'success') {
        navigate('/student/dashboard', { replace: true });
        fetchCourses();
      } else {
        fetchCourses();
      }
    } else if (!loading && !currentUser) {
      setLoading(false);
    }
  }, [currentUser, location]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/student/login');
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      // Get all courses
      const courseRes = await axios.get(`${API_URL}/courses`, { headers });

      // Get enrolled courses - Try different approaches
      let enrollRes;
      
      // Method 1: With studentId as query param  
      try {
        enrollRes = await axios.get(`${API_URL}/student/enrollments`, { 
          headers, 
          params: { studentId: currentUser?.id } 
        });
      } catch (error) {
        // Method 2: Without studentId (if backend gets it from token)
        try {
          enrollRes = await axios.get(`${API_URL}/student/enrollments`, { headers });
        } catch (error2) {
          // Method 3: Different endpoint structure
          try {
            enrollRes = await axios.get(`${API_URL}/enrollments/student/${currentUser?.id}`, { headers });
          } catch (error3) {
            console.error('All enrollment fetch methods failed:', error3);
            throw error3;
          }
        }
      }

      setCourses(courseRes.data);
      
      // Handle different response structures properly
      let enrollments = [];
      
      // Check if response has enrolledCourses property
      if (enrollRes.data && enrollRes.data.enrolledCourses) {
        enrollments = enrollRes.data.enrolledCourses;
      } 
      // Check if response has enrollments property
      else if (enrollRes.data && enrollRes.data.enrollments) {
        enrollments = enrollRes.data.enrollments;
      } 
      // Check if response data is directly an array
      else if (Array.isArray(enrollRes.data)) {
        enrollments = enrollRes.data;
      } 
      // Check if response has data property
      else if (enrollRes.data && enrollRes.data.data) {
        enrollments = enrollRes.data.data;
      }
      
      setEnrolledCourses(enrollments);
      
    } catch (error) {
      console.error('Error in fetchCourses:', error);
      
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Session expired. Please login again.');
        navigate('/student/login');
      } else {
        console.error('Error fetching data:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (course) => {
    if (!currentUser || !currentUser.name || !currentUser.email) {
      alert('User information is not available. Please try logging in again.');
      navigate('/student/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const orderRes = await axios.post(
        `${API_URL}/payments/create-order`,
        { course_id: course.id, amount: course.price },
        { headers }
      );

      const { order } = orderRes.data;

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: 'INR',
        name: 'Maharishi Coaching',
        description: course.title,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verificationResponse = await axios.post(
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

            const { token: newToken, user: newUser } = verificationResponse.data;
            if (newToken && newUser) {
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(newUser));
                setUser(newUser);
            }

            navigate(`/payment-success?course=${encodeURIComponent(course.title)}&redirect=/student/dashboard`);

          } catch (handlerError) {
            console.error('Razorpay handler verification failed:', handlerError.response?.data || handlerError.message);
            alert('Payment verification failed after transaction. Please contact support.');
            navigate(`/payment-failed?error=${encodeURIComponent(handlerError.response?.data?.message || handlerError.message)}`);
          }
        },
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
          contact: currentUser.phone || '',
        },
        theme: {
          color: '#473391',
        },
      };

      if (!window.Razorpay) {
        alert('Razorpay SDK not loaded. Please refresh the page or check your connection.');
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Enroll failed:', err.response?.data || err.message);
      alert('Enrollment failed. Please try again. ' + (err.response?.data?.message || ''));
    }
  };

  const downloadInvoice = async (enrollmentId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/payments/invoice/${enrollmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to download invoice');

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `invoice-${enrollmentId}.pdf`;
      link.click();
    } catch (err) {
      console.error('Invoice download error:', err);
      alert('Could not download invoice.');
    }
  };

  if (loading) return <Loader />;

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Loading user data or redirecting...</p></div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <h1 className="text-3xl font-bold text-center mb-10">Welcome, {currentUser?.name}</h1>

        {/* Enrolled Courses */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">My Enrolled Courses</h2>
          {enrolledCourses.length === 0 ? (
            <p className="text-gray-500">No enrolled courses yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((course, index) => (
                <div key={course.enrollment_id || course.id || index} className="bg-white p-5 rounded shadow">
                  <h3 className="text-lg font-bold">{course.course_title || course.title}</h3>
                  <p>{course.course_description || course.description}</p>
                  <p>Duration: {course.duration}</p>
                  <p>Faculty: {course.faculty}</p>
                  <p>Amount Paid: ₹{course.amount_paid}</p>
                  <p>Enrolled On: {course.enrollment_date ? new Date(course.enrollment_date).toLocaleDateString() : 'N/A'}</p>
                  <p>Status: <span className={course.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-500'}>{course.payment_status}</span></p>
                  {course.payment_status === 'paid' && (
                    <button
                      className="mt-2 bg-yellow-400 hover:bg-[#473391] text-white px-3 py-1 rounded"
                      onClick={() => downloadInvoice(course.enrollment_id || course.id)}
                    >
                      Download Invoice
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Courses */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Courses</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses
              .filter(course => !enrolledCourses.some(e => (e.course_id || e.id) === course.id))
              .map(course => (
                <div key={course.id} className="bg-white p-5 rounded shadow">
                  <h3 className="text-lg font-bold">{course.title}</h3>
                  <p>{course.description}</p>
                  <p>Duration: {course.duration}</p>
                  <p>Faculty: {course.faculty}</p>
                  <p className="font-bold mt-2">₹{course.price}</p>
                  <button
                    className="mt-3 w-full bg-yellow-400 hover:bg-[#473391] text-white py-2 rounded"
                    onClick={() => handleEnroll(course)}
                  >
                    Enroll Now
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
      <YouTubeSlider />
    </>
  );
};

export default StudentDashboard;