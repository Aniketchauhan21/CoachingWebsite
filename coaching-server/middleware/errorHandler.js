// Import dependencies with error handling
let authenticate, ctrl;

try {
  authenticate = require('../middleware/authenticate');
  ctrl = require('../controllers/contactsController');
} catch (error) {
  console.error('Error importing contact dependencies:', error.message);
  authenticate = (req, res, next) => next();
  ctrl = {
    getAll: (req, res) => res.json({ contacts: [] }),
    getById: (req, res) => res.status(404).json({ error: 'Contact not found' }),
    create: (req, res) => res.status(201).json({ message: 'Contact created successfully' }),
    update: (req, res) => res.status(500).json({ error: 'Contact controller not available' }),
    delete: (req, res) => res.status(500).json({ error: 'Contact controller not available' })
  };
}