const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Spreadsheet = require('../models/Spreadsheet');

// Get all templates
router.get('/templates', auth, async (req, res) => {
  try {
    const templates = await Spreadsheet.find({ template: true });
    res.json(templates);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Save spreadsheet as template
router.post('/:id/template', auth, async (req, res) => {
  try {
    const spreadsheet = await Spreadsheet.findById(req.params.id);
    if (!spreadsheet) return res.status(404).json({ error: 'Spreadsheet not found' });
    spreadsheet.template = true;
    await spreadsheet.save();
    res.json({ message: 'Saved as template' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
