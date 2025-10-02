const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Spreadsheet = require('../models/Spreadsheet');

// Get spreadsheet dashboard analytics (stub)
router.get('/:id/dashboard', auth, async (req, res) => {
  try {
    const spreadsheet = await Spreadsheet.findById(req.params.id);
    if (!spreadsheet) return res.status(404).json({ error: 'Spreadsheet not found' });
    const rows = spreadsheet.data.rows || [];
    // Example analytics: row count, column count, last updated
    const rowCount = rows.length;
    const colCount = rows[0] ? Object.keys(rows[0]).length : 0;
    const lastUpdated = spreadsheet.updatedAt;
    res.json({
      summary: `Rows: ${rowCount}, Columns: ${colCount}, Last Updated: ${lastUpdated}`,
      rowCount,
      colCount,
      lastUpdated,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get chart data (stub)
router.get('/:id/charts', auth, async (req, res) => {
  try {
    const spreadsheet = await Spreadsheet.findById(req.params.id);
    if (!spreadsheet) return res.status(404).json({ error: 'Spreadsheet not found' });
    const rows = spreadsheet.data.rows || [];
    // Example: count values for each column
    const charts = [];
    if (rows.length > 0) {
      const headers = Object.keys(rows[0]);
      headers.forEach(header => {
        const values = rows.map(row => row[header]);
        const valueCounts = {};
        values.forEach(val => {
          valueCounts[val] = (valueCounts[val] || 0) + 1;
        });
        charts.push({
          column: header,
          valueCounts,
        });
      });
    }
    res.json({ charts });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
