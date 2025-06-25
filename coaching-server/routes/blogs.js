const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const authenticate = require('../middleware/authenticate');
const requireAdmin = require('../middleware/requireAdmin');

// ✅ Setup image upload path and ensure directory exists
const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


// 🚀 GET all blogs (public)
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM coaching.blogs ORDER BY id');
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
});

// 🚀 GET single blog (public)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM coaching.blogs WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// 📝 CREATE blog (admin only)
router.post('/', authenticate, requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    const { title, content, author } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Title, content, and author are required' });
    }

    const result = await pool.query(
      `INSERT INTO coaching.blogs (title, content, author, image_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, content, author, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// 📝 UPDATE blog (admin only)
router.put('/:id', authenticate, requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Title, content, and author are required' });
    }

    const query = `
      UPDATE coaching.blogs
      SET title = $1,
          content = $2,
          author = $3,
          ${image_url ? 'image_url = $4,' : ''}
          updated_at = NOW()
      WHERE id = $${image_url ? 5 : 4}
      RETURNING *
    `;

    const values = image_url
      ? [title, content, author, image_url, id]
      : [title, content, author, id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// ❌ DELETE blog (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM coaching.blogs WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.status(200).json({ message: 'Deleted', blog: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
