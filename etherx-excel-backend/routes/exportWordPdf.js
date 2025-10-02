const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Spreadsheet = require('../models/Spreadsheet');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } = require('docx');

// Export spreadsheet as PDF
router.get('/:id/export/pdf', auth, async (req, res) => {
  try {
    const spreadsheet = await Spreadsheet.findById(req.params.id);
    if (!spreadsheet) return res.status(404).json({ error: 'Spreadsheet not found' });
    const doc = new PDFDocument();
    res.header('Content-Type', 'application/pdf');
    res.attachment(`${spreadsheet.name}.pdf`);
    doc.pipe(res);
    doc.fontSize(18).text(spreadsheet.name, { align: 'center' });
    doc.moveDown();
    const rows = spreadsheet.data.rows || [];
    if (rows.length > 0) {
      const headers = Object.keys(rows[0]);
      doc.fontSize(12).text(headers.join(' | '));
      doc.moveDown(0.5);
      rows.forEach(row => {
        doc.text(headers.map(h => row[h]).join(' | '));
      });
    } else {
      doc.text('No data');
    }
    doc.end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Export spreadsheet as Word (DOCX)
router.get('/:id/export/word', auth, async (req, res) => {
  try {
    const spreadsheet = await Spreadsheet.findById(req.params.id);
    if (!spreadsheet) return res.status(404).json({ error: 'Spreadsheet not found' });
    const rows = spreadsheet.data.rows || [];
    let tableRows = [];
    if (rows.length > 0) {
      const headers = Object.keys(rows[0]);
      tableRows.push(new TableRow({
        children: headers.map(h => new TableCell({ children: [new Paragraph(h)] }))
      }));
      rows.forEach(row => {
        tableRows.push(new TableRow({
          children: headers.map(h => new TableCell({ children: [new Paragraph(row[h] ? row[h].toString() : '')] }))
        }));
      });
    }
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: spreadsheet.name, heading: 'Heading1' }),
          new Table({ rows: tableRows })
        ]
      }]
    });
    const buffer = await Packer.toBuffer(doc);
    res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.attachment(`${spreadsheet.name}.docx`);
    res.send(buffer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
