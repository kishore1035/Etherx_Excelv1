const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  cellId: { type: String, required: true },
  spreadsheet: { type: mongoose.Schema.Types.ObjectId, ref: 'Spreadsheet', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorInitials: { type: String },
  content: { type: String, required: true },
  edited: { type: Boolean, default: false },
  editedAt: { type: Date },
  timestamp: { type: Date, default: Date.now },
  notificationSent: { type: Boolean, default: false },
});

module.exports = mongoose.model('Comment', CommentSchema);
