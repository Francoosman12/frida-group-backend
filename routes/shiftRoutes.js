// routes/shiftRoutes.js

const express = require('express');
const { startShift, endShift, getShiftRecords } = require('../controllers/shiftController');
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/start', authenticateToken, startShift);
router.post('/end', authenticateToken, endShift);
router.get('/records', authenticateToken, authorizeAdmin, getShiftRecords);

module.exports = router;
