const Razorpay = require('razorpay');
const pool = require('../config/db');
const crypto = require('crypto');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

// Razorpay Setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {

    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email function
const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Maharishi Coaching" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};

// Create Razorpay order
exports.createOrder = async (req, res) => {
  const studentId = req.user.id;
  const { course_id, amount } = req.body;

  if (!course_id || !amount) {
    return res.status(400).json({ message: 'Course ID and amount are required.' });
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: { course_id, student_id: studentId },
    });

    res.status(201).json({ order });
  } catch (err) {
    console.error('❌ Razorpay order creation failed:', err);
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};

// Verify payment and enroll
exports.verifyPaymentAndEnroll = async (req, res) => {
  const studentId = req.user.id;
  const { course_id, amount_paid, payment_id, order_id, signature } = req.body;

  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${order_id}|${payment_id}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Check if already enrolled
    const exists = await pool.query(
      'SELECT * FROM coaching.enrollments WHERE student_id=$1 AND course_id=$2',
      [studentId, course_id]
    );

    if (exists.rows.length > 0) {
      return res.status(200).json({ message: 'Already enrolled' });
    }

    // Insert new enrollment
    const insert = await pool.query(
      `INSERT INTO coaching.enrollments (student_id, course_id, amount_paid, payment_status, payment_id, payment_order_id, payment_signature) 
       VALUES ($1, $2, $3, 'paid', $4, $5, $6) RETURNING *`,
      [studentId, course_id, amount_paid, payment_id, order_id, signature]
    );

    res.status(200).json({ message: 'Enrolled successfully', enrollment: insert.rows[0] });
  } catch (err) {
    console.error('❌ Payment verification failed:', err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};


// Generate downloadable PDF invoice
exports.generateInvoicePDF = async (req, res) => {
  const studentId = req.user.id;
  const { enrollmentId } = req.params;

  const result = await pool.query(`
    SELECT e.*, s.name AS student_name, c.title AS course_title 
    FROM coaching.enrollments e
    JOIN coaching.students s ON e.student_id = s.id
    JOIN coaching.courses c ON e.course_id = c.id
    WHERE e.id = $1 AND e.student_id = $2
  `, [enrollmentId, studentId]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  const invoice = result.rows[0];

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
  doc.pipe(res);

  doc.fontSize(20).text('Maharishi Coaching Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Student: ${invoice.student_name}`);
  doc.text(`Course: ${invoice.course_title}`);
  doc.text(`Amount Paid: ₹${invoice.amount_paid}`);
  doc.text(`Payment ID: ${invoice.payment_id}`);
  doc.text(`Date: ${new Date(invoice.enrollment_date).toLocaleString()}`);

  doc.end();
};
