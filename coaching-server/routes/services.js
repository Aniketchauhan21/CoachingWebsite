// routes/services.js

const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // DB connection pool
const authenticate = require('../middleware/authenticate'); // JWT authentication middleware
const requireAdmin = require('../middleware/requireAdmin'); // Admin role check middleware

// GET all services (public)
router.get('/', async (req, res, next) => {
    try {
        // --- FIX: Added 'coaching.' prefix ---
        const result = await pool.query('SELECT * FROM coaching.services ORDER BY id');
        res.status(200).json(result.rows); // Return services with 200 status
    } catch (err) {
        next(err); // Pass errors to error handler
    }
});

// GET single service (public)
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        // --- FIX: Added 'coaching.' prefix ---
        const result = await pool.query('SELECT * FROM coaching.services WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Service not found' }); // Return 404 if service doesn't exist
        }

        res.status(200).json(result.rows[0]); // Return service data with 200 status
    } catch (err) {
        next(err); // Pass errors to error handler
    }
});

// CREATE new service (admin only)
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
    try {
        const { title, description, price } = req.body;

        // Basic validation check
        if (!title || !description || !price) {
            return res.status(400).json({ error: 'Title, description, and price are required' });
        }

        // --- FIX: Added 'coaching.' prefix ---
        const result = await pool.query(
            `INSERT INTO coaching.services (title, description, price)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [title, description, price]
        );

        res.status(201).json(result.rows[0]); // Return created service with 201 status
    } catch (err) {
        next(err); // Pass errors to error handler
    }
});

// UPDATE service (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, price } = req.body;

        // Basic validation check
        if (!title || !description || !price) {
            return res.status(400).json({ error: 'Title, description, and price are required' });
        }

        // --- FIX: Added 'coaching.' prefix ---
        const result = await pool.query(
            `UPDATE coaching.services
             SET title=$1,
                 description=$2,
                 price=$3,
                 updated_at=NOW()
             WHERE id=$4
             RETURNING *`,
            [title, description, price, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Service not found' }); // Return 404 if service doesn't exist
        }

        res.status(200).json(result.rows[0]); // Return updated service with 200 status
    } catch (err) {
        next(err); // Pass errors to error handler
    }
});

// DELETE service (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
    try {
        // --- FIX: Added 'coaching.' prefix ---
        const result = await pool.query(
            'DELETE FROM coaching.services WHERE id=$1 RETURNING *',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Service not found' }); // Return 404 if service doesn't exist
        }

        res.status(200).json({ message: 'Deleted', service: result.rows[0] }); // Return deleted service with 200 status
    } catch (err) {
        next(err); // Pass errors to error handler
    }
});

module.exports = router;