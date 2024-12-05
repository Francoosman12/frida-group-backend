const express = require('express');
const User = require('../models/User');
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Obtener todos los usuarios
router.get('/users', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'name email role'); // Solo seleccionar los campos necesarios
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});



module.exports = router;
