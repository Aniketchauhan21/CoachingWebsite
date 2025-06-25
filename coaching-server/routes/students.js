const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authenticate = require('../middleware/authenticate');
const requireStudent = require('../middleware/requireStudent');

// Get student profile (authenticated student only)
router.get('/profile', authenticate, requireStudent, studentController.getProfile);

// Update student profile (authenticated student only)
router.put('/profile', authenticate, requireStudent, studentController.updateProfile);

// Enroll in a course (authenticated student only)
router.post('/enroll', authenticate, requireStudent, studentController.enrollCourse);

// Get all enrolled courses for a student (authenticated student only)
router.get('/enrollments', authenticate, requireStudent, studentController.getEnrolledCourses);

module.exports = router;