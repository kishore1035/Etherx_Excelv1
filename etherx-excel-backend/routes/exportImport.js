const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Spreadsheet = require('../models/Spreadsheet');
const { Parser } = require('json2csv');
const XLSX = require('xlsx');

// Export spreadsheet as CSV
router.get('/:id/export/csv', auth, async (req, res) => {
  try {
    const spreadsheet = await Spreadsheet.findById(req.params.id);
    if (!spreadsheet) return res.status(404).json({ error: 'Spreadsheet not found' });
    const parser = new Parser();
    const csv = parser.parse(spreadsheet.data.rows || []);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${spreadsheet.name}.csv`);
    res.send(csv);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Export spreadsheet as XLSX
router.get('/:id/export/xlsx', auth, async (req, res) => {
  try {
    const spreadsheet = await Spreadsheet.findById(req.params.id);
    if (!spreadsheet) return res.status(404).json({ error: 'Spreadsheet not found' });
    const ws = XLSX.utils.json_to_sheet(spreadsheet.data.rows || []);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.attachment(`${spreadsheet.name}.xlsx`);
    res.send(buffer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/import/csv', auth, async (req, res) => {
  // TODO: Implement CSV import logic
  res.status(501).json({ error: 'Not implemented' });
});

// Import spreadsheet from XLSX
router.post('/import/xlsx', auth, async (req, res) => {
  // TODO: Implement XLSX import logic
  res.status(501).json({ error: 'Not implemented' });
});

module.exports = router;
const multer = require('multer');
const upload = multer();

// Import spreadsheet from CSV
router.post('/import/csv', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const csv = req.file.buffer.toString('utf8');
    const { Parser } = require('json2csv');
    const rows = csv.split('\n').map(line => line.split(','));
    const headers = rows[0];
    const dataRows = rows.slice(1).filter(r => r.length === headers.length);
    const data = dataRows.map(row => {
      let obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });
    const Spreadsheet = require('../models/Spreadsheet');
    const spreadsheet = new Spreadsheet({
      name: req.body.name || 'Imported CSV',
      owner: req.user.id,
      data: { rows: data },
    });
    await spreadsheet.save();
    res.status(201).json(spreadsheet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Import spreadsheet from XLSX
router.post('/import/xlsx', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const XLSX = require('xlsx');
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const Spreadsheet = require('../models/Spreadsheet');
    const spreadsheet = new Spreadsheet({
      name: req.body.name || 'Imported XLSX',
      owner: req.user.id,
      data: { rows: data },
    });
    await spreadsheet.save();
    res.status(201).json(spreadsheet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
