// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/servicesController');
const auth = require('../middleware/authenticate'); // Your authentication middleware
const multer = require('multer');


// Public routes
router.get('/', serviceController.getAll);
router.get('/categories', serviceController.getCategories);
router.get('/stats', serviceController.getStats);
router.get('/:id', serviceController.getById);

// Protected routes (require authentication)
router.post('/', auth, serviceController.create);
router.put('/:id', auth, serviceController.update);
router.delete('/:id', auth, serviceController.delete);

module.exports = router;