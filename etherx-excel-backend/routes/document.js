const express = require('express');
const router = express.Router();
const { saveToDesktop } = require('../controllers/documentController');

// POST /api/document/save-desktop
router.post('/save-desktop', saveToDesktop);

module.exports = router;
