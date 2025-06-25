// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate'); // Assuming you want to verify the user for `/verify`

// Student registration (now includes OTP verification)
// This route is called when the student has provided name, email, password, phone, AND OTP.
router.post('/student/register', authController.registerStudent);

// Student login
// This is the route that was causing the 404. Ensure authController.loginStudent is correctly defined.
router.post('/student/login', authController.loginStudent);

// Admin login
router.post('/admin/login', authController.loginAdmin);

// To send OTP (this is the first step of the registration process)
// Call this route when the student only provides an email to receive the OTP.
router.post('/send-otp', authController.sendOtpToEmail);

// Token verification (Protected Route)
router.get('/verify', authenticate, (req, res) => {
    // This will verify the user's token and provide user information
    // It is crucial for session persistence on refresh.
    res.json({ success: true, user: req.user });
});

// Forgot password and reset password
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
