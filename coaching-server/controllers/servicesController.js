// controllers/serviceController.js
const pool = require('../config/db');
const { isPositiveNumber } = require('../utils/validators');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

// ✅ FIX: Use same directory structure as blogs
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        // ✅ Changed from '../uploads/services' to '../public/uploads'
        const uploadDir = path.join(__dirname, '../public/uploads');
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // ✅ Keep service prefix for identification
        cb(null, 'service-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ✅ FIX: Helper function to convert file path to URL (same as blogs)
const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const filename = path.basename(imagePath);
    return `/uploads/${filename}`; // ✅ Changed from /uploads/services/ to /uploads/
};

// Get all services with filters
exports.getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', category = '', active = 'all' } = req.query;
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT s.*, c.name as category_name 
            FROM coaching.services s 
            LEFT JOIN coaching.categories c ON s.category = c.name
        `;
        
        const conditions = [];
        const params = [];
        let paramCount = 0;

        // Search filter
        if (search) {
            paramCount++;
            conditions.push(`(s.title ILIKE $${paramCount} OR s.description ILIKE $${paramCount})`);
            params.push(`%${search}%`);
        }

        // Category filter
        if (category) {
            paramCount++;
            conditions.push(`s.category = $${paramCount}`);
            params.push(category);
        }

        // Active filter
        if (active !== 'all') {
            paramCount++;
            conditions.push(`s.is_active = $${paramCount}`);
            params.push(active === 'true');
        }

        // Add WHERE clause if conditions exist
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        // Add ordering and pagination
        query += ` ORDER BY s.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, offset);

        const data = await pool.query(query, params);

        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) FROM coaching.services s';
        if (conditions.length > 0) {
            countQuery += ' WHERE ' + conditions.join(' AND ');
        }
        const countParams = params.slice(0, paramCount);
        const countResult = await pool.query(countQuery, countParams);

        // Process services with proper image URLs
        const services = data.rows.map(service => ({
            ...service,
            image_url: getImageUrl(service.image_path),
            // Ensure numeric fields are properly typed
            rating: service.rating ? parseFloat(service.rating) : null,
            clients_served: service.clients_served ? parseInt(service.clients_served) : null,
            price: parseFloat(service.price)
        }));

        res.json({
            success: true,
            services,
            total: parseInt(countResult.rows[0].count),
            page: Number(page),
            totalPages: Math.ceil(countResult.rows[0].count / limit)
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get service by ID
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT s.*, c.name as category_name 
            FROM coaching.services s 
            LEFT JOIN coaching.categories c ON s.category = c.name 
            WHERE s.id = $1
        `, [id]);
        
        if (!result.rows.length) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        const service = result.rows[0];
        service.image_url = getImageUrl(service.image_path);
        service.rating = service.rating ? parseFloat(service.rating) : null;
        service.clients_served = service.clients_served ? parseInt(service.clients_served) : null;
        service.price = parseFloat(service.price);

        res.json({ success: true, service });
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Create new service
exports.create = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { 
                title, 
                description, 
                price, 
                category = 'general', 
                duration = '', 
                rating = null,
                clients_served = null,
                is_active = true 
            } = req.body;
            
            // Validation
            if (!title || !description || !price) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Title, description, and price are required' 
                });
            }

            if (!isPositiveNumber(price)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Price must be a positive number' 
                });
            }

            // Validate rating if provided
            if (rating && (parseFloat(rating) < 0 || parseFloat(rating) > 5)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Rating must be between 0 and 5' 
                });
            }

            // Validate clients_served if provided
            if (clients_served && (!Number.isInteger(parseInt(clients_served)) || parseInt(clients_served) < 0)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Clients served must be a positive integer' 
                });
            }

            // ✅ FIX: Store relative path like blogs do
            const imagePath = req.file ? req.file.path : null;
            const image_url = req.file ? `/uploads/${req.file.filename}` : null;

            const result = await pool.query(`
                INSERT INTO coaching.services (
                    title, description, price, category, duration, 
                    image_path, image_url, rating, clients_served, is_active
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *
            `, [
                title.trim(), 
                description.trim(), 
                Number(price), 
                category.trim(), 
                duration.trim(), 
                imagePath,
                image_url, // ✅ Store the URL separately
                rating ? parseFloat(rating) : null,
                clients_served ? parseInt(clients_served) : null,
                is_active
            ]);

            const service = result.rows[0];

            res.status(201).json({ 
                success: true, 
                message: 'Service created successfully',
                service 
            });
        } catch (error) {
            console.error('Error creating service:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
];

// Update service
exports.update = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { 
                title, 
                description, 
                price, 
                category = 'general', 
                duration = '', 
                rating = null,
                clients_served = null,
                is_active = true 
            } = req.body;
            
            // Validation
            if (!title || !description || !price) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Title, description, and price are required' 
                });
            }

            if (!isPositiveNumber(price)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Price must be a positive number' 
                });
            }

            // Validate rating if provided
            if (rating && (parseFloat(rating) < 0 || parseFloat(rating) > 5)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Rating must be between 0 and 5' 
                });
            }

            // Validate clients_served if provided
            if (clients_served && (!Number.isInteger(parseInt(clients_served)) || parseInt(clients_served) < 0)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Clients served must be a positive integer' 
                });
            }

            // Get current service to handle image replacement
            const currentService = await pool.query('SELECT image_path FROM coaching.services WHERE id = $1', [id]);
            if (!currentService.rows.length) {
                return res.status(404).json({ success: false, message: 'Service not found' });
            }

            let imagePath = currentService.rows[0].image_path;
            let image_url = currentService.rows[0].image_url;
            
            // If new image is uploaded, replace the old one
            if (req.file) {
                // Delete old image if exists
                if (imagePath) {
                    try {
                        await fs.unlink(imagePath);
                    } catch (error) {
                        console.log('Error deleting old image:', error);
                    }
                }
                imagePath = req.file.path;
                image_url = `/uploads/${req.file.filename}`; // ✅ Update URL
            }

            const result = await pool.query(`
                UPDATE coaching.services 
                SET title = $1, description = $2, price = $3, category = $4, 
                    duration = $5, image_path = $6, image_url = $7, rating = $8, clients_served = $9, 
                    is_active = $10, updated_at = NOW()
                WHERE id = $11
                RETURNING *
            `, [
                title.trim(), 
                description.trim(), 
                Number(price), 
                category.trim(), 
                duration.trim(), 
                imagePath,
                image_url, // ✅ Store the URL
                rating ? parseFloat(rating) : null,
                clients_served ? parseInt(clients_served) : null,
                is_active, 
                id
            ]);

            const service = result.rows[0];

            res.json({ 
                success: true, 
                message: 'Service updated successfully',
                service 
            });
        } catch (error) {
            console.error('Error updating service:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
];

// Delete service
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get service to delete associated image
        const service = await pool.query('SELECT image_path FROM coaching.services WHERE id = $1', [id]);
        if (!service.rows.length) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        // Delete the service
        const result = await pool.query('DELETE FROM coaching.services WHERE id = $1 RETURNING *', [id]);

        // Delete associated image file
        if (service.rows[0].image_path) {
            try {
                await fs.unlink(service.rows[0].image_path);
            } catch (error) {
                console.log('Error deleting image file:', error);
            }
        }

        res.json({ 
            success: true, 
            message: 'Service deleted successfully', 
            service: result.rows[0] 
        });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get categories
exports.getCategories = async (req, res) => {
    try {
        // Get categories from services table (dynamic categories)
        const result = await pool.query(`
            SELECT DISTINCT category 
            FROM coaching.services 
            WHERE category IS NOT NULL AND category != '' 
            ORDER BY category
        `);
        
        const categories = result.rows.map(row => row.category);
        
        res.json({ 
            success: true, 
            categories 
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get service statistics
exports.getStats = async (req, res) => {
    try {
        const stats = await pool.query(`
            SELECT 
                COUNT(*) as total_services,
                COUNT(CASE WHEN is_active = true THEN 1 END) as active_services,
                COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_services,
                AVG(price) as average_price,
                COUNT(DISTINCT category) as total_categories
            FROM coaching.services
        `);

        res.json({
            success: true,
            stats: {
                total_services: parseInt(stats.rows[0].total_services),
                active_services: parseInt(stats.rows[0].active_services),
                inactive_services: parseInt(stats.rows[0].inactive_services),
                average_price: parseFloat(stats.rows[0].average_price || 0),
                total_categories: parseInt(stats.rows[0].total_categories)
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};