const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  cnic: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin', 'worker', 'donor', 'employer'] },
  profession: { type: String, default: '' },
  photo: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema); 