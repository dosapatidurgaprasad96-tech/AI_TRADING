const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['INFO', 'WARN', 'ERROR', 'SUCCESS'],
    default: 'INFO'
  },
  module: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SystemLog', systemLogSchema);
