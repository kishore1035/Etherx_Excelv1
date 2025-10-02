const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Spreadsheet = require('../models/Spreadsheet');
const User = require('../models/User');

// Share spreadsheet with user
router.post('/:id/share', auth, async (req, res) => {
  try {
    const { userId, role } = req.body;
    const spreadsheet = await Spreadsheet.findById(req.params.id);
    if (!spreadsheet) return res.status(404).json({ error: 'Spreadsheet not found' });
    if (!spreadsheet.owner.equals(req.user.id)) return res.status(403).json({ error: 'Not authorized' });
    spreadsheet.permissions.push({ user: userId, role });
    await spreadsheet.save();
    res.json({ message: 'Spreadsheet shared' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get spreadsheet permissions
router.get('/:id/permissions', auth, async (req, res) => {
  try {
    const spreadsheet = await Spreadsheet.findById(req.params.id).populate('permissions.user', 'username name email');
    if (!spreadsheet) return res.status(404).json({ error: 'Spreadsheet not found' });
    res.json(spreadsheet.permissions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
