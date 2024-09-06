// models/Shift.js

const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  hoursWorked: { type: Number, default: 0 },
});

module.exports = mongoose.model('Shift', shiftSchema);
