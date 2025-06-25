// controllers/serviceController.js - (CHANGES MADE HERE)
const pool = require('../config/db');
const { isPositiveNumber } = require('../utils/validators');

exports.getAll = async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM coaching.services'; // ADDED coaching.
    const params = [];
    if (search) {
        params.push(`%${search}%`);
        query += ' WHERE title ILIKE $1 OR description ILIKE $1';
    }
    params.push(limit, offset);
    query += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;
    try {
        const data = await pool.query(query, params);
        const countQ = search
            ? 'SELECT COUNT(*) FROM coaching.services WHERE title ILIKE $1 OR description ILIKE $1' // ADDED coaching.
            : 'SELECT COUNT(*) FROM coaching.services'; // ADDED coaching.
        const countP = search ? [`%${search}%`] : [];
        const countR = await pool.query(countQ, countP);
        res.json({
            services: data.rows,
            total: parseInt(countR.rows[0].count),
            page: Number(page),
            totalPages: Math.ceil(countR.rows[0].count / limit)
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM coaching.services WHERE id = $1', [id]); // ADDED coaching.
        if (!result.rows.length) return res.status(404).json({ message: 'Service not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.create = async (req, res) => {
    const { title, description, price } = req.body;
    if (!title || !description || !price)
        return res.status(400).json({ message: 'Fields required' });
    if (!isPositiveNumber(price))
        return res.status(400).json({ message: 'Price must be positive' });
    try {
        const result = await pool.query(
            'INSERT INTO coaching.services(title,description,price) VALUES($1,$2,$3) RETURNING *', // ADDED coaching.
            [title.trim(), description.trim(), Number(price)]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const { title, description, price } = req.body;
    if (!title || !description || !price)
        return res.status(400).json({ message: 'Fields required' });
    if (!isPositiveNumber(price))
        return res.status(400).json({ message: 'Price must be positive' });
    try {
        const result = await pool.query(
            'UPDATE coaching.services SET title=$1,description=$2,price=$3,updated_at=NOW() WHERE id=$4 RETURNING *', // ADDED coaching.
            [title.trim(), description.trim(), Number(price), id]
        );
        if (!result.rows.length) return res.status(404).json({ message: 'Service not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM coaching.services WHERE id=$1 RETURNING *', [id]); // ADDED coaching.
        if (!result.rows.length) return res.status(404).json({ message: 'Service not found' });
        res.json({ message: 'Deleted', service: result.rows[0] });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Server error' });
    }
};