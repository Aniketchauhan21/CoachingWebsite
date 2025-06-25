// src/utils/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; // Use your backend URL

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const authService = {
    // Example: Fetch student profile
    getStudentProfile: async () => {
        try {
            const response = await axios.get(`${API_URL}/student/profile`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching student profile:', error);
            throw error;
        }
    },

    // Example: Enroll student in a course
    enrollCourse: async (courseId, amount, paymentId) => {
        try {
            const response = await axios.post(`${API_URL}/student/enroll`, {
                course_id: courseId,
                amount_paid: amount,
                payment_id: paymentId,
            }, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Error enrolling in course:', error);
            throw error;
        }
    },

    // Example: Fetch all students (admin only)
    getAllStudents: async (page = 1, limit = 10, search = '') => {
        try {
            const response = await axios.get(`${API_URL}/admin/manage/students`, {
                params: { page, limit, search },
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching all students:', error);
            throw error;
        }
    },

    // Add other API calls as needed (e.g., update profile, get enrolled courses)
};

export default authService;