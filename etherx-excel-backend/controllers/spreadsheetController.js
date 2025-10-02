const Spreadsheet = require('../models/Spreadsheet');

exports.createSpreadsheet = async (req, res) => {
  try {
    const { name, data } = req.body;
    const spreadsheet = new Spreadsheet({ name, data, owner: req.user.id });
    await spreadsheet.save();
    res.status(201).json(spreadsheet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSpreadsheets = async (req, res) => {
  try {
    const spreadsheets = await Spreadsheet.find({ owner: req.user.id });
    res.json(spreadsheets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSpreadsheet = async (req, res) => {
  try {
    const spreadsheet = await Spreadsheet.findOne({ _id: req.params.id, owner: req.user.id });
    if (!spreadsheet) return res.status(404).json({ error: 'Not found' });
    res.json(spreadsheet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSpreadsheet = async (req, res) => {
  try {
    const { name, data } = req.body;
    const spreadsheet = await Spreadsheet.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { name, data, updatedAt: Date.now() },
      { new: true }
    );
    if (!spreadsheet) return res.status(404).json({ error: 'Not found' });
    res.json(spreadsheet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSpreadsheet = async (req, res) => {
  try {
    const spreadsheet = await Spreadsheet.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!spreadsheet) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};