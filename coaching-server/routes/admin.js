// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const requireAdmin = require('../middleware/requireAdmin');

// Get all students (admin only)
// Requires authentication and admin role to fetch all student details.
router.get('/students', authenticate, requireAdmin, adminController.getAllStudents);

// Delete a student (admin only)
// Requires authentication and admin role to delete a student by ID.
router.delete('/students/:studentId', authenticate, requireAdmin, adminController.deleteStudent);

// Get all enrollments (admin only)
// Requires authentication and admin role to fetch all enrollment records, with optional filters.
router.get('/enrollments', authenticate, requireAdmin, adminController.getAllEnrollments);

// Update enrollment status (admin only)
// Allows admin to change the payment status of an enrollment.
router.put('/enrollments/:enrollmentId/status', authenticate, requireAdmin, adminController.updateEnrollmentStatus);

// Get enrollments for a specific student (admin only)
// Admin can view all enrollments associated with a particular student ID.
router.get('/student-enrollments', authenticate, requireAdmin, adminController.getStudentEnrollments);


// Future routes for managing other admin-specific data can be added here,
// such as testimonials, banners, etc., always protected by authenticate and requireAdmin.
// router.post('/testimonials', authenticate, requireAdmin, adminController.createTestimonial);
// router.put('/banners/:id', authenticate, requireAdmin, adminController.updateBanner);

module.exports = router;
