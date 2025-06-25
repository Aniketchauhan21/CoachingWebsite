// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper function for sending emails
const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: htmlContent
    };
    await transporter.sendMail(mailOptions);
};

// Send OTP function (for student registration)
exports.sendOtpToEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const existingStudent = await pool.query('SELECT is_verified FROM coaching.students WHERE email = $1', [email]);
        if (existingStudent.rows.length && existingStudent.rows[0].is_verified) {
            return res.status(400).json({ message: 'This email is already registered and verified. Please log in.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
        const expiry = new Date(Date.now() + 10 * 60 * 1000); 

        await pool.query(`
            INSERT INTO coaching.otp_verifications (email, otp, expires_at)
            VALUES ($1, $2, $3)
            ON CONFLICT (email) DO UPDATE SET otp = $2, expires_at = $3
        `, [email, otp, expiry]);

        await sendEmail(email, 'OTP Verification - Coaching Portal', `<p>Your OTP is: <b>${otp}</b>. It is valid for 10 minutes.</p>`);

        res.json({ message: 'OTP sent to email. Please verify OTP to complete registration.' });
    } catch (err) {
        console.error('Error sending OTP:', err.message);
        console.error('Error stack:', err.stack); 
        res.status(500).json({ message: 'Failed to send OTP', error: err.message });
    }
};

// Student registration (with OTP verification)
exports.registerStudent = async (req, res) => {
    const { name, email, password, phone, otp } = req.body;

    if (!name || !email || !password || !phone || !otp) {
        return res.status(400).json({ message: 'Name, email, password, phone, and OTP are all required.' });
    }

    try {
        const existingStudent = await pool.query('SELECT id, is_verified FROM coaching.students WHERE email = $1', [email]);
        if (existingStudent.rows.length && existingStudent.rows[0].is_verified) {
            return res.status(400).json({ message: 'This email is already registered and verified. Please log in.' });
        }

        const trimmedOtp = String(otp).trim(); 

        const otpResult = await pool.query(
            `SELECT otp, expires_at FROM coaching.otp_verifications WHERE email = $1`, 
            [email]
        );

        const dbOtpInfo = otpResult.rows[0];

        if (!dbOtpInfo) {
            return res.status(400).json({ message: 'No OTP found for this email. Please request a new OTP.' });
        }
        
        if (dbOtpInfo.otp !== trimmedOtp) { 
            return res.status(400).json({ message: 'Invalid OTP. Please enter the correct OTP.' });
        }

        if (new Date() > dbOtpInfo.expires_at) {
            return res.status(400).json({ message: 'Expired OTP. Please request a new OTP.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let student;
        if (existingStudent.rows.length && !existingStudent.rows[0].is_verified) {
             const updateResult = await pool.query(
                'UPDATE coaching.students SET name = $1, phone = $2, password = $3, is_verified = TRUE WHERE email = $4 RETURNING id, name, email, phone, COALESCE(role, \'student\') as role', 
                [name, phone, hashedPassword, email]
            );
            student = updateResult.rows[0];
        } else {
            const insertResult = await pool.query(
                'INSERT INTO coaching.students (name, email, phone, password, is_verified, role) VALUES ($1, $2, $3, $4, TRUE, \'student\') RETURNING id, name, email, phone, role', 
                [name, email, phone, hashedPassword]
            );
            student = insertResult.rows[0];
        }

        await pool.query(`DELETE FROM coaching.otp_verifications WHERE email = $1`, [email]);

        const token = jwt.sign(
            { id: student.id, name: student.name, email: student.email, role: student.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'Registration completed successfully and your email is verified.',
            token,
            user: { id: student.id, name: student.name, email: student.email, role: student.role }
        });
    } catch (err) {
        console.error('Error registering student:', err.message);
        console.error('Error stack:', err.stack); 
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};


// Student login
exports.loginStudent = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const result = await pool.query('SELECT id, name, email, password, COALESCE(role, \'student\') as role, is_verified FROM coaching.students WHERE email = $1', [email]);
        const student = result.rows[0];

        if (!student) {
            return res.status(404).json({ message: 'Student not found or incorrect email.' });
        }

        if (!student.is_verified) {
            return res.status(403).json({ message: 'Email not verified. Please verify your email first.' });
        }

        if (!(await bcrypt.compare(password, student.password))) {
            return res.status(401).json({ message: 'Invalid credentials. Please check your password.' });
        }

        const token = jwt.sign(
            { id: student.id, name: student.name, email: student.email, role: student.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: student.id, name: student.name, email: student.email, role: student.role }
        });
    } catch (err) {
        console.error('Error logging in student:', err.message);
        console.error('Error stack:', err.stack);
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};

// Admin login (using hardcoded credentials from .env)
exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    console.log('Admin Login Request:', { username, password }); // Debug log
    if (!username || !password) {
        console.log('Admin Login: Missing username or password'); // Debug log
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD; 

    if (!adminUser || !adminPass) { 
        console.error('Admin Login: ADMIN_USERNAME or ADMIN_PASSWORD not set in .env'); 
        return res.status(500).json({ message: 'Admin credentials not configured on server.' });
    }

    try {
        console.log('Admin Login: Comparing input username with ADMIN_USERNAME...');
        if (username !== adminUser) {
            console.log('Admin Login: Invalid username.');
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        console.log('Admin Login: Comparing input password with ADMIN_PASSWORD (plain text)...'); 
        if (password !== adminPass) { 
            console.log('Admin Login: Invalid password.');
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const token = jwt.sign(
            { username: adminUser, role: 'admin' }, 
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        console.log('Admin Login: Login successful for admin:', username);

        res.json({
            message: 'Admin login successful',
            token,
            user: { username: adminUser, role: 'admin' }
        });
    } catch (err) {
        console.error('Error logging in admin:', err.message);
        console.error('Error stack:', err.stack);
        res.status(500).json({ message: 'Admin login failed', error: err.message });
    }
};

// Token verification (verify user session)
exports.verify = (req, res) => {
    // CRITICAL FIX: Add comprehensive cache-busting headers
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    // CRITICAL FIX: Explicitly remove ETag and Last-Modified headers to prevent 304 responses
    res.removeHeader('ETag');
    res.removeHeader('Last-Modified');

    console.log('Verify Endpoint: Received request. req.user:', req.user); // Debug log
    if (req.user) {
        let userPayload = {};
        if (req.user.role === 'admin') {
            userPayload = {
                id: req.user.id || null, 
                username: req.user.username,
                role: req.user.role
            };
        } else if (req.user.role === 'student') {
            userPayload = {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            };
        } else {
            userPayload = { ...req.user }; 
            console.warn("Verify endpoint received a user with an unknown or missing role in JWT:", req.user);
        }
        console.log('Verify Endpoint: Preparing to send to Frontend:', { success: true, user: userPayload }); // Changed to success
        // CRITICAL FIX: Change response format from 'valid' to 'success' to match frontend expectation
        res.status(200).json({ success: true, user: userPayload }); // Changed from 'valid' to 'success'
    } else {
        console.log('Verify Endpoint: No req.user found, sending unauthorized.'); // Debug log
        res.status(401).json({ success: false, message: 'No active session or invalid token.' }); // Changed from 'valid' to 'success'
    }
};

// Forgot Password (can be for both students and admins)
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Check only students table as admin is hardcoded
        const user = await pool.query(`SELECT id FROM coaching.students WHERE email = $1`, [email]);
        if (!user.rows.length) return res.status(404).json({ message: 'User not found.' });

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // Token valid for 10 minutes

        await pool.query(`
            INSERT INTO coaching.reset_tokens (email, token, expires_at)
            VALUES ($1, $2, $3)
            ON CONFLICT (email) DO UPDATE SET token = $2, expires_at = $3
        `, [email, token, expiry]);

        const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        await sendEmail(email, 'Password Reset Request - Coaching Portal', `<p>Click to reset your password: <a href="${link}">Reset Password</a></p><p>This link is valid for 10 minutes.</p>`);

        res.json({ message: 'Password reset link sent to email.' });
    } catch (err) {
        console.error('Forgot Password Error:', err.message);
        console.error('Error stack:', err.stack);
        res.status(500).json({ message: 'Error sending reset link', error: err.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Token or new password is missing.' });

    try {
        const result = await pool.query(
            `SELECT email FROM coaching.reset_tokens WHERE token = $1 AND expires_at > NOW()`,
            [token]
        );
        if (!result.rows.length) return res.status(400).json({ message: 'Invalid or expired token.' });

        const email = result.rows[0].email;
        const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the password

        // Update password for student only, as admin is hardcoded and not in DB
        const updateStudent = await pool.query(`UPDATE coaching.students SET password = $1 WHERE email = $2 RETURNING id`, [hashedPassword, email]);
        // const updateAdmin = await pool.query(`UPDATE coaching.admins SET password = $1 WHERE email = $2 RETURNING id`, [hashedPassword, email]); // Removed

        if (!updateStudent.rows.length) { // Adjusted condition
            return res.status(404).json({ message: 'No student found to reset password for.' });
        }

        await pool.query(`DELETE FROM coaching.otp_verifications WHERE email = $1`, [email]);

        res.json({ message: 'Password has been successfully reset. You can now log in with your new password.' });
    } catch (err) {
        console.error('Reset Password Error:', err.message);
        console.error('Error stack:', err.stack);
        res.status(500).json({ message: 'Error resetting password', error: err.message });
    }
};
