// routes/courses.js

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticate = require('../middleware/authenticate');
const requireAdmin = require('../middleware/requireAdmin');

// Utility function for validation
const isPositiveNumber = (value) => {
    return !isNaN(value) && parseFloat(value) > 0;
};

// GET all courses (public)
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all courses...');
        // --- FIX: Added 'coaching.' prefix ---
    const result = await pool.query('SELECT * FROM coaching.courses ORDER BY created_at DESC'); // <-- FIX
        console.log('Courses fetched:', result.rows.length);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({
            error: 'Failed to fetch courses',
            details: err.message
        });
    }
});

// GET one course (public)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Fetching course with ID:', id);

        // --- FIX: Added 'coaching.' prefix ---
        const result = await pool.query('SELECT * FROM coaching.courses WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching course:', err);
        res.status(500).json({
            error: 'Failed to fetch course',
            details: err.message
        });
    }
});

// CREATE course (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
    try {
        console.log('Creating new course...');
        console.log('Request body:', req.body);
        console.log('User:', req.user);

        const { title, description, duration, price, faculty } = req.body;

        // Validation
        if (!title || !description || !duration || !price || !faculty) {
            console.log('Validation failed: Missing required fields');
            return res.status(400).json({
                error: 'All fields are required',
                received: { title, description, duration, price, faculty }
            });
        }

        if (!isPositiveNumber(price)) {
            console.log('Validation failed: Invalid price');
            return res.status(400).json({
                error: 'Price must be a positive number'
            });
        }

        // Insert into database
        // --- FIX: Added 'coaching.' prefix ---
        const result = await pool.query(
            `INSERT INTO coaching.courses (title, description, duration, price, faculty, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
             RETURNING *`,
            [title.trim(), description.trim(), duration.trim(), parseFloat(price), faculty.trim()]
        );

        console.log('Course created successfully:', result.rows[0]);
        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error('Error creating course:', err);
        console.error('Stack trace:', err.stack);

        // Check for specific database errors
        if (err.code === '42P01') {
            return res.status(500).json({
                error: 'Database table not found',
                details: 'The courses table does not exist (even with coaching. prefix, check your DB setup or schema name)' // More specific error
            });
        }

        if (err.code === '23505') {
            return res.status(400).json({
                error: 'Course already exists',
                details: 'A course with this title already exists'
            });
        }

        res.status(500).json({
            error: 'Failed to create course',
            details: err.message,
            code: err.code
        });
    }
});

// UPDATE course (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, duration, price, faculty } = req.body;

        console.log('Updating course:', id);
        console.log('Update data:', req.body);

        // Validation
        if (!title || !description || !duration || !price || !faculty) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        if (!isPositiveNumber(price)) {
            return res.status(400).json({
                error: 'Price must be a positive number'
            });
        }

        // --- FIX: Added 'coaching.' prefix ---
        const result = await pool.query(
            `UPDATE coaching.courses
             SET title = $1, description = $2, duration = $3, price = $4, faculty = $5, updated_at = NOW()
             WHERE id = $6
             RETURNING *`,
            [title.trim(), description.trim(), duration.trim(), parseFloat(price), faculty.trim(), id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        console.log('Course updated successfully:', result.rows[0]);
        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error('Error updating course:', err);
        res.status(500).json({
            error: 'Failed to update course',
            details: err.message
        });
    }
});

// DELETE course (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Deleting course:', id);

        // --- FIX: Added 'coaching.' prefix ---
        const result = await pool.query(
            'DELETE FROM coaching.courses WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        console.log('Course deleted successfully:', result.rows[0]);
        res.status(200).json({
            message: 'Course deleted successfully',
            course: result.rows[0]
        });

    } catch (err) {
        console.error('Error deleting course:', err);
        res.status(500).json({
            error: 'Failed to delete course',
            details: err.message
        });
    }
});

module.exports = router;