// controllers/adminController.js
const pool = require('../config/db');
const crypto = require('crypto'); // Import crypto, if password reset is handled here
const nodemailer = require('nodemailer'); // Import nodemailer, if email sending utility is here

// Email transporter setup
// Note: This setup should ideally be in a shared utility,
// but if adminController still handles forgotPassword/resetPassword,
// then keep it here or import from a shared utility.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper function for sending emails (if adminController also needs to send emails)
const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: htmlContent
    };
    await transporter.sendMail(mailOptions);
};

// Admin: Get all students with enrollments
exports.getAllStudents = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                s.id AS id,
                s.name, s.email, s.phone, s.created_at, s.is_verified,
                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'course_title', c.title,
                            'amount_paid', e.amount_paid,
                            'payment_status', e.payment_status,
                            'enrollment_date', e.enrollment_date,
                            'enrollment_id', e.id
                        )
                    ) FILTER (WHERE e.id IS NOT NULL),
                    '[]'
                ) AS enrollments
            FROM coaching.students s
            LEFT JOIN coaching.enrollments e ON s.id = e.student_id
            LEFT JOIN coaching.courses c ON e.course_id = c.id
            GROUP BY s.id
            ORDER BY s.created_at DESC
        `);

        const students = result.rows.map(row => ({
            ...row,
            enrollments: Array.isArray(row.enrollments) ? row.enrollments : []
        }));

        res.json({ students });
    } catch (err) {
        console.error('Error fetching students:', err.message);
        res.status(500).json({ message: 'Failed to fetch student data', error: err.message });
    }
};

// Admin: Get all enrollments with filters/pagination
exports.getAllEnrollments = async (req, res) => {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
        SELECT
            e.id AS enrollment_id, e.enrollment_date, e.payment_status, e.payment_id, e.amount_paid,
            s.id AS student_id, s.name AS student_name, s.email AS student_email,
            c.id AS course_id, c.title AS course_title, c.price AS course_price
        FROM coaching.enrollments e
        JOIN coaching.students s ON e.student_id = s.id
        JOIN coaching.courses c ON e.course_id = c.id
    `;
    const countQuery = `SELECT COUNT(e.id) FROM coaching.enrollments e JOIN coaching.students s ON e.student_id = s.id JOIN coaching.courses c ON e.course_id = c.id`;

    const params = [];
    const countParams = [];
    let where = [];
    let i = 1;

    if (search) {
        where.push(`(s.name ILIKE $${i} OR s.email ILIKE $${i} OR c.title ILIKE $${i})`);
        params.push(`%${search}%`);
        countParams.push(`%${search}%`);
        i++;
    }

    if (status) {
        where.push(`e.payment_status = $${i}`);
        params.push(status);
        countParams.push(status);
        i++;
    }

    if (where.length > 0) {
        query += ' WHERE ' + where.join(' AND ');
        countQuery += ' WHERE ' + where.join(' AND ');
    }

    params.push(parseInt(limit), offset);
    query += ` ORDER BY e.enrollment_date DESC LIMIT $${i} OFFSET $${i + 1}`;

    try {
        const data = await pool.query(query, params);
        const totalCountResult = await pool.query(countQuery, countParams);
        const totalItems = parseInt(totalCountResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalItems / parseInt(limit));

        res.json({
            enrollments: data.rows,
            pagination: {
                totalItems,
                currentPage: parseInt(page),
                limit: parseInt(limit),
                totalPages
            }
        });
    } catch (err) {
        console.error('Error fetching enrollments:', err.message);
        res.status(500).json({ message: 'Failed to fetch enrollments', error: err.message });
    }
};

// Admin: Update enrollment status
exports.updateEnrollmentStatus = async (req, res) => {
    const { enrollmentId } = req.params;
    const { payment_status } = req.body;
    const allowed = ['pending', 'paid', 'failed', 'cancelled', 'refunded'];

    if (!payment_status || !allowed.includes(payment_status)) {
        return res.status(400).json({ message: 'Invalid or missing payment status' });
    }

    try {
        const result = await pool.query(`
            UPDATE coaching.enrollments SET payment_status = $1, updated_at = NOW()
            WHERE id = $2 RETURNING *
        `, [payment_status, enrollmentId]);

        if (!result.rows.length) return res.status(404).json({ message: 'Enrollment not found' });
        res.json({ message: 'Enrollment status updated successfully', enrollment: result.rows[0] });
    } catch (err) {
        console.error('Error updating enrollment status:', err.message);
        res.status(500).json({ message: 'Error updating enrollment status', error: err.message });
    }
};

// Admin: Delete student
exports.deleteStudent = async (req, res) => {
    const { studentId } = req.params;
    try {
        const result = await pool.query(`DELETE FROM coaching.students WHERE id = $1 RETURNING id, name, email`, [studentId]);
        if (!result.rows.length) return res.status(404).json({ message: 'Student not found' });
        res.json({ message: `Student '${result.rows[0].name}' (${result.rows[0].email}) deleted successfully`, student: result.rows[0] });
    } catch (err) {
        console.error('Error deleting student:', err.message);
        res.status(500).json({ message: 'Error deleting student', error: err.message });
    }
};

// Admin: Get enrollments for a specific student
exports.getStudentEnrollments = async (req, res) => {
    const { studentId } = req.query;
    if (!studentId) {
        return res.status(400).json({ message: 'studentId is required' });
    }
    try {
        const result = await pool.query(
            `SELECT e.id AS enrollment_id, e.enrollment_date, e.payment_status, e.amount_paid,
                    c.id AS course_id, c.title AS course_title, c.price AS course_price
             FROM coaching.enrollments e
             JOIN coaching.courses c ON e.course_id = c.id
             WHERE e.student_id = $1
             ORDER BY e.enrollment_date DESC`,
            [studentId]
        );
        res.json({ enrollments: result.rows });
    } catch (err) {
        console.error('Error fetching student enrollments:', err.message);
        res.status(500).json({ message: 'Failed to fetch student enrollments', error: err.message });
    }
};
