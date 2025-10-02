const express = require('express');
const router = express.Router();
const { solve } = require('../controllers/aiController');

// POST /api/ai/solve
router.post('/solve', solve);

module.exports = router;
