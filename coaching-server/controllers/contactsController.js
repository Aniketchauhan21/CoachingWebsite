// controllers/contactController.js - (CHANGES MADE HERE)
const pool = require('../config/db');
const { isValidEmail, isValidPhone } = require('../utils/validators');

exports.getAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    try {
        const data = await pool.query(
            'SELECT * FROM coaching.contacts ORDER BY created_at DESC LIMIT $1 OFFSET $2', // ADDED coaching.
            [limit, offset]
        );
        const count = await pool.query('SELECT COUNT(*) FROM coaching.contacts'); // ADDED coaching.
        res.json({
            contacts: data.rows,
            total: parseInt(count.rows[0].count),
            page: Number(page),
            totalPages: Math.ceil(count.rows[0].count / limit)
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.create = async (req, res) => {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message)
        return res.status(400).json({ message: 'All fields are required' });
    if (!isValidEmail(email))
        return res.status(400).json({ message: 'Invalid email' });
    if (!isValidPhone(phone))
        return res.status(400).json({ message: 'Invalid phone' });
    try {
        const result = await pool.query(
            'INSERT INTO coaching.contacts(name,email,phone,message) VALUES($1,$2,$3,$4) RETURNING id,name,email,created_at', // ADDED coaching.
            [name.trim(), email.trim().toLowerCase(), phone.trim(), message.trim()]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM coaching.contacts WHERE id=$1 RETURNING *', [id]); // ADDED coaching.
        if (!result.rows.length) return res.status(404).json({ message: 'Contact not found' });
        res.json({ message: 'Deleted', contact: result.rows[0] });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
};