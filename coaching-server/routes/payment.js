const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticate');
const paymentController = require('../controllers/paymentController');

router.post('/create-order', authMiddleware, paymentController.createOrder);
router.post('/verify', authMiddleware, paymentController.verifyPaymentAndEnroll);
router.get('/invoice/:enrollmentId', authMiddleware, paymentController.generateInvoicePDF);

module.exports = router;
    