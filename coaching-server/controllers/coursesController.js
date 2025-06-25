const pool = require('../config/db');
const { isPositiveNumber } = require('../utils/validators');

exports.getAll = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM coaching.courses';
  const params = [];
  if (search) {
    params.push(`%${search}%`);
    query += ' WHERE title ILIKE $1 OR description ILIKE $1';
  }
  params.push(limit, offset);
  query += ` ORDER BY created_at DESC LIMIT $${params.length-1} OFFSET $${params.length}`;
  const data = await pool.query(query, params);
  const countQ = search
    ? 'SELECT COUNT(*) FROM coaching.courses WHERE title ILIKE $1 OR description ILIKE $1'
    : 'SELECT COUNT(*) FROM coaching.courses';
  const countP = search ? [`%${search}%`] : [];
  const countR = await pool.query(countQ, countP);
  res.json({
    courses: data.rows,
    total: parseInt(countR.rows[0].count),
    page: Number(page),
    totalPages: Math.ceil(countR.rows[0].count / limit)
  });
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM coaching.courses WHERE id = $1', [id]);
  if (!result.rows.length) return res.status(404).json({ message: 'Course not found' });
  res.json(result.rows[0]);
};

exports.create = async (req, res) => {
  try {
    const { title, description, duration, price, faculty } = req.body;
    if (!title || !description || !duration || !price || !faculty)
      return res.status(400).json({ message: 'All fields are required' });
    if (!isPositiveNumber(price))
      return res.status(400).json({ message: 'Price must be positive number' });
    const result = await pool.query(
      'INSERT INTO coaching.courses(title, description, duration, price, faculty) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [title.trim(), description.trim(), duration.trim(), Number(price), faculty.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, price, faculty } = req.body;
    if (!title || !description || !duration || !price || !faculty)
      return res.status(400).json({ message: 'All fields are required' });
    if (!isPositiveNumber(price))
      return res.status(400).json({ message: 'Price must be positive number' });
    const result = await pool.query(
      'UPDATE coaching.courses SET title=$1,description=$2,duration=$3,price=$4,faculty=$5,updated_at=NOW() WHERE id=$6 RETURNING *',
      [title.trim(), description.trim(), duration.trim(), Number(price), faculty.trim(), id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Course not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM coaching.courses WHERE id=$1 RETURNING *', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Deleted', course: result.rows[0] });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};