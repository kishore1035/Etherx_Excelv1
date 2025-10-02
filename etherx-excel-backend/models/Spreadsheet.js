const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['owner', 'editor', 'viewer'], default: 'viewer' },
});

const VersionSchema = new mongoose.Schema({
  data: { type: Object },
  timestamp: { type: Date, default: Date.now },
});

const SpreadsheetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  data: { type: Object, default: {} },
  permissions: [PermissionSchema],
  versions: [VersionSchema],
  template: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Spreadsheet', SpreadsheetSchema);