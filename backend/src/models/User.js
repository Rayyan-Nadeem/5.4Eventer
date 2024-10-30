const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['adin', 'Event Coordinator', 'Faculty'],
    default: 'user',
  },
});

module.exports = mongoose.model('User', UserSchema);
//cookies
