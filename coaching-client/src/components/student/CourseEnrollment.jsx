import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

const CourseEnrollment = () => {
  const { getToken, user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrolled = async () => {
    try {
      const token = getToken() || localStorage.getItem('token');
      if (!token) {
        console.error('No token found. Redirecting to login or handle auth state.');
        setLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      // Get user ID from context or localStorage
      let studentId = user?.id;
      if (!studentId) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            studentId = parsedUser.id;
          } catch (e) {
            console.error('Failed to parse user from localStorage', e);
          }
        }
      }

      if (!studentId) {
        console.error('User ID not available to fetch enrollments.');
        setLoading(false);
        return;
      }

      // Try multiple methods to fetch enrollments (same as StudentDashboard)
      let res;
      
      try {
        // Method 1: With studentId as query param
        res = await axios.get(`${API_URL}/student/enrollments`, {
          headers,
          params: { studentId: studentId }
        });
      } catch (error) {
        try {
          // Method 2: Without studentId (if backend gets it from token)
          res = await axios.get(`${API_URL}/student/enrollments`, { headers });
        } catch (error2) {
          try {
            // Method 3: Different endpoint structure
            res = await axios.get(`${API_URL}/enrollments/student/${studentId}`, { headers });
          } catch (error3) {
            console.error('All enrollment fetch methods failed:', error3);
            throw error3;
          }
        }
      }

      // Handle different response structures properly (same logic as StudentDashboard)
      let enrollments = [];
      
      if (res.data && res.data.enrolledCourses) {
        enrollments = res.data.enrolledCourses;
      } 
      else if (res.data && res.data.enrollments) {
        enrollments = res.data.enrollments;
      } 
      else if (Array.isArray(res.data)) {
        enrollments = res.data;
      } 
      else if (res.data && res.data.data) {
        enrollments = res.data.data;
      }

      setEnrolledCourses(enrollments);
    } catch (err) {
      console.error('Failed to fetch enrolled courses:', err.response?.data?.message || err.message);
      
      // Handle 401 Unauthorized errors
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // You might want to redirect to login here or show a message
        console.error('Session expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch enrollments when component mounts or when user changes
    fetchEnrolled();
  }, [user]);

  const downloadInvoice = async (enrollmentId) => {
    try {
      const token = getToken() || localStorage.getItem('token');
      if (!token) {
        alert('Authentication required to download invoice.');
        return;
      }

      const res = await fetch(`${API_URL}/payments/invoice/${enrollmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to download invoice: ${res.status} - ${errorText}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${enrollmentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Invoice download failed:', err.message);
      alert('Could not download invoice. ' + err.message);
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your enrolled courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Enrolled Courses</h1>

      {enrolledCourses.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 text-lg">You haven't enrolled in any course yet.</p>
          <p className="text-gray-500 mt-2">Browse our available courses and start your learning journey!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course, index) => (
            <div key={course.enrollment_id || course.id || index} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold mb-3 text-gray-800">{course.course_title || course.title}</h2>
              
              {(course.course_description || course.description) && (
                <p className="text-gray-600 mb-3 line-clamp-3">{course.course_description || course.description}</p>
              )}
              
              {course.duration && (
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Duration:</span> {course.duration}
                </p>
              )}
              
              {course.faculty && (
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Faculty:</span> {course.faculty}
                </p>
              )}
              
              <div className="border-t pt-3 mt-3">
                <p className="text-lg font-semibold text-green-600 mb-2">
                  Amount Paid: ₹{course.amount_paid}
                </p>
                
                <p className="text-sm text-gray-500 mb-2">
                  Enrolled On: {course.enrollment_date ? new Date(course.enrollment_date).toLocaleDateString() : 'N/A'}
                </p>
                
                <p className="mb-3">
                  Status: <span className={`font-bold ${course.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-500'}`}>
                    {course.payment_status}
                  </span>
                </p>
                
                {course.payment_status === 'paid' && (
                  <button
                    onClick={() => downloadInvoice(course.enrollment_id || course.id)}
                    className="w-full bg-yellow-400 text-gray-900 py-2 px-4 rounded hover:bg-[#473391] hover:text-white transition-colors font-medium"
                  >
                    Download Invoice
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseEnrollment;