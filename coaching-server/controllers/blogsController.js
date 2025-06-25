const pool = require('../config/db');
const { isPositiveNumber } = require('../utils/validators');

// GET ALL BLOGS
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM coaching.blogs';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ' WHERE title ILIKE $1 OR content ILIKE $1 OR author ILIKE $1';
    }

    params.push(limit, offset);
    query += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const data = await pool.query(query, params);

    const countQ = search
      ? 'SELECT COUNT(*) FROM coaching.blogs WHERE title ILIKE $1 OR content ILIKE $1 OR author ILIKE $1'
      : 'SELECT COUNT(*) FROM coaching.blogs';
    const countP = search ? [`%${search}%`] : [];
    const countR = await pool.query(countQ, countP);

    res.json({
      blogs: data.rows,
      total: parseInt(countR.rows[0].count),
      page: Number(page),
      totalPages: Math.ceil(countR.rows[0].count / limit)
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET BLOG BY ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM coaching.blogs WHERE id = $1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Blog not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE BLOG WITH IMAGE
exports.create = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !content || !author)
      return res.status(400).json({ message: 'Title, content and author are required' });

    if (title.length > 255)
      return res.status(400).json({ message: 'Title too long (max 255 characters)' });

    const result = await pool.query(
      'INSERT INTO coaching.blogs(title, content, author, image_url) VALUES($1, $2, $3, $4) RETURNING *',
      [title.trim(), content.trim(), author.trim(), image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE BLOG WITH IMAGE
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !content || !author)
      return res.status(400).json({ message: 'Title, content and author are required' });

    if (title.length > 255)
      return res.status(400).json({ message: 'Title too long (max 255 characters)' });

    let query, params;
    
    if (image_url) {
      query = `
        UPDATE coaching.blogs
        SET title = $1, content = $2, author = $3, image_url = $4, updated_at = NOW()
        WHERE id = $5
        RETURNING *
      `;
      params = [title.trim(), content.trim(), author.trim(), image_url, id];
    } else {
      query = `
        UPDATE coaching.blogs
        SET title = $1, content = $2, author = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING *
      `;
      params = [title.trim(), content.trim(), author.trim(), id];
    }

    const result = await pool.query(query, params);

    if (!result.rows.length) 
      return res.status(404).json({ message: 'Blog not found' });

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE BLOG
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM coaching.blogs WHERE id = $1 RETURNING *', [id]);
    if (!result.rows.length) 
      return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully', blog: result.rows[0] });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};