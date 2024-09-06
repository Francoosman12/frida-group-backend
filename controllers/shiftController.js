// controllers/shiftController.js

const Shift = require('../models/Shift');

const startShift = async (req, res) => {
  try {
    const shift = new Shift({ user: req.user.id, startTime: Date.now() });
    await shift.save();
    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const endShift = async (req, res) => {
  try {
    const shift = await Shift.findOne({ user: req.user.id, endTime: null });
    if (!shift) return res.status(400).json({ error: 'No active shift found' });

    shift.endTime = Date.now();
    shift.hoursWorked = (shift.endTime - shift.startTime) / (1000 * 60 * 60); // Convertir a horas
    await shift.save();

    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getShiftRecords = async (req, res) => {
  try {
    const shifts = await Shift.find().populate('user', 'name email');
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { startShift, endShift, getShiftRecords };
