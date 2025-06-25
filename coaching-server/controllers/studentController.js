// controllers/studentController.js - (No changes needed, already correct)
const pool = require('../config/db');
const { isPositiveNumber } = require('../utils/validators'); // Assuming you have this for price validation

// GET STUDENT PROFILE
exports.getProfile = async (req, res) => {
    const studentId = req.user.id; // ID from authenticated student token

    try {
        const result = await pool.query(
            'SELECT id, name, email, phone, created_at, updated_at FROM coaching.students WHERE id = $1',
            [studentId]
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Student profile not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching student profile:', error.message);
        res.status(500).json({ message: 'Server error fetching profile', error: error.message });
    }
};

// UPDATE STUDENT PROFILE
exports.updateProfile = async (req, res) => {
    const studentId = req.user.id;
    const { name, phone } = req.body; // Email cannot be changed via profile update, only name and phone

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }
    if (phone && !isValidPhone(phone)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
    }

    try {
        const result = await pool.query(
            `UPDATE coaching.students SET name = $1, phone = $2, updated_at = NOW()
             WHERE id = $3 RETURNING id, name, email, phone, updated_at`,
            [name.trim(), phone ? phone.trim() : null, studentId]
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Student not found or unauthorized' });
        }
        res.json({ message: 'Profile updated successfully', student: result.rows[0] });
    } catch (error) {
        console.error('Error updating student profile:', error.message);
        res.status(500).json({ message: 'Server error updating profile', error: error.message });
    }
};

// ENROLL IN A COURSE (Student Side)
exports.enrollCourse = async (req, res) => {
    const studentId = req.user.id;
    const { course_id, amount_paid, payment_id } = req.body; // payment_id will come from Razorpay/Stripe callback

    if (!course_id || !amount_paid) {
        return res.status(400).json({ message: 'Course ID and amount paid are required' });
    }
    if (!isPositiveNumber(amount_paid)) {
        return res.status(400).json({ message: 'Amount paid must be a positive number' });
    }

    try {
        // 1. Check if course exists
        const courseResult = await pool.query(
            'SELECT id, price FROM coaching.courses WHERE id = $1',
            [course_id]
        );
        if (!courseResult.rows.length) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const coursePrice = parseFloat(courseResult.rows[0].price);

        // 2. Validate payment amount (optional but recommended)
        if (parseFloat(amount_paid) < coursePrice) {
            // Or, handle partial payments if your business logic allows
            return res.status(400).json({ message: `Amount paid is less than course price (${coursePrice})` });
        }


        // 3. Check if student is already enrolled
        const existingEnrollment = await pool.query(
            'SELECT id FROM coaching.enrollments WHERE student_id = $1 AND course_id = $2',
            [studentId, course_id]
        );
        if (existingEnrollment.rows.length > 0) {
            return res.status(409).json({ message: 'You are already enrolled in this course' });
        }

        // 4. Create enrollment record
        const enrollmentResult = await pool.query(
            `INSERT INTO coaching.enrollments (student_id, course_id, amount_paid, payment_status, payment_id)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [studentId, course_id, amount_paid, payment_id ? 'paid' : 'pending', payment_id] // Assuming 'paid' if payment_id is present
        );

        res.status(201).json({
            message: 'Course enrollment successful',
            enrollment: enrollmentResult.rows[0]
        });

    } catch (error) {
        console.error('Error enrolling student in course:', error.message);
        res.status(500).json({ message: 'Server error during enrollment', error: error.message });
    }
};

// GET ALL ENROLLED COURSES FOR A STUDENT
exports.getEnrolledCourses = async (req, res) => {
    const studentId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT
                e.id AS enrollment_id,
                e.enrollment_date,
                e.payment_status,
                e.amount_paid,
                c.id AS course_id,
                c.title AS course_title,
                c.description AS course_description,
                c.duration,
                c.price AS course_price,
                c.faculty
            FROM coaching.enrollments e
            JOIN coaching.courses c ON e.course_id = c.id
            WHERE e.student_id = $1
            ORDER BY e.enrollment_date DESC`,
            [studentId]
        );

        res.json({ enrolledCourses: result.rows });
    } catch (error) {
        console.error('Error fetching enrolled courses:', error.message);
        res.status(500).json({ message: 'Server error fetching enrolled courses', error: error.message });
    }
};