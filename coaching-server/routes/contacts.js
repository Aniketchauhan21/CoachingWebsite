// routes/contacts.js - TEMPLATE
// =====================================
const express = require('express');
const router = express.Router();

const contactHandlers = {
  getAll: (req, res) => res.json({ contacts: [], message: 'Contacts loaded' }),
  getById: (req, res) => res.status(404).json({ error: 'Contact not found' }),
  create: (req, res) => {
    // Basic contact creation
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    res.status(201).json({ 
      message: 'Contact message received successfully',
      id: Date.now(),
      data: { name, email, message }
    });
  },
  update: (req, res) => res.json({ message: 'Contact updated' }),
  delete: (req, res) => res.json({ message: 'Contact deleted' })
};

const simpleAuth = (req, res, next) => next();

router.get('/', contactHandlers.getAll);
router.get('/:id', contactHandlers.getById);
router.post('/', contactHandlers.create); // No auth needed for contact form
router.put('/:id', simpleAuth, contactHandlers.update);
router.delete('/:id', simpleAuth, contactHandlers.delete);

module.exports = router;
