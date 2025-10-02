const express = require('express');
const router = express.Router();
const spreadsheetController = require('../controllers/spreadsheetController');
const auth = require('../middleware/auth');

router.post('/', auth, spreadsheetController.createSpreadsheet);
router.get('/', auth, spreadsheetController.getSpreadsheets);
router.get('/:id', auth, spreadsheetController.getSpreadsheet);
router.put('/:id', auth, spreadsheetController.updateSpreadsheet);
router.delete('/:id', auth, spreadsheetController.deleteSpreadsheet);

module.exports = router;