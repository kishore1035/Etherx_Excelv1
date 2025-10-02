const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Spreadsheet = require('../models/Spreadsheet');
const Comment = require('../models/Comment');

// Activity log (stub: extend for real logging)
let activityLog = [];

// Log activity
function logActivity(type, userId, details) {
  activityLog.push({ type, userId, details, timestamp: Date.now() });
}

// Get activity log for user
router.get('/log', auth, (req, res) => {
  const log = activityLog.filter(a => a.userId === req.user.id);
  res.json(log);
});

// Notify user on comment mention (stub)
router.post('/notify-comment', auth, async (req, res) => {
  try {
    const { commentId, mentionedUserId } = req.body;
    // Here you would send notification (email, SMS, etc.)
    logActivity('notify-comment', req.user.id, { commentId, mentionedUserId });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Restore spreadsheet version
router.post('/spreadsheet/:id/restore-version', auth, async (req, res) => {
  try {
    const { versionIndex } = req.body;
    const spreadsheet = await Spreadsheet.findById(req.params.id);
    if (!spreadsheet) return res.status(404).json({ error: 'Spreadsheet not found' });
    if (!spreadsheet.versions[versionIndex]) return res.status(400).json({ error: 'Version not found' });
    spreadsheet.data = spreadsheet.versions[versionIndex].data;
    spreadsheet.updatedAt = Date.now();
    await spreadsheet.save();
    logActivity('restore-version', req.user.id, { spreadsheetId: spreadsheet._id, versionIndex });
    res.json(spreadsheet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Achievements/badges endpoint (stub)
router.get('/achievements', auth, async (req, res) => {
  // Example: return dummy achievements
  res.json([
    { name: 'First Spreadsheet', achieved: true },
    { name: 'Collaborator', achieved: false },
    { name: 'Exporter', achieved: true },
  ]);
});

// Advanced search/filter spreadsheets
router.get('/spreadsheet/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    const spreadsheets = await Spreadsheet.find({
      owner: req.user.id,
      name: { $regex: q || '', $options: 'i' },
    });
    res.json(spreadsheets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// User analytics (usage stats)
router.get('/analytics', auth, async (req, res) => {
  try {
    const spreadsheetCount = await Spreadsheet.countDocuments({ owner: req.user.id });
    const commentCount = await Comment.countDocuments({ author: req.user.id });
    res.json({ spreadsheetCount, commentCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List collaborative sessions (stub)
router.get('/sessions', auth, (req, res) => {
  // Example: return dummy sessions
  res.json([
    { sessionId: 'abc123', activeUsers: 3 },
    { sessionId: 'def456', activeUsers: 1 },
  ]);
});

module.exports = router;
