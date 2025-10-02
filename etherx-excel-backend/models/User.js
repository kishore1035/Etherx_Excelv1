const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  color: { type: String },
  roles: { type: [String], default: ['user'] },
  profile: {
    avatar: { type: String },
    bio: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);