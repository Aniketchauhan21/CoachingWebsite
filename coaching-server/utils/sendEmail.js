// utils/sendEmail.js (Renamed and made more generic)
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Or your specific email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: to,                      // List of recipients
        subject: subject,            // Subject line
        html: htmlContent            // HTML body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to} with subject: ${subject}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error.message);
        throw new Error('Failed to send email.'); // Re-throw to be caught by calling function
    }
};

module.exports = sendEmail;