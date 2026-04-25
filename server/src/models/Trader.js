const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const traderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  experience: { type: Number, default: 0 },
  level: { type: String, enum: ['Junior', 'Mid', 'Senior', 'Expert'], default: 'Junior' },
  specialization: [{ type: String }],
  capacity: { type: Number, default: 10 },
  currentLoad: { type: Number, default: 0 },
  performanceScore: { type: Number, default: 70 },
  isAvailable: { type: Boolean, default: true },
  bio: { type: String },
  avatar: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: 'Employee' }
}, { timestamps: true });

traderSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

traderSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Trader', traderSchema);
