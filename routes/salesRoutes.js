const express = require('express');
const router = express.Router();
const { createSale, getSales } = require('../controllers/salesController'); // Importar el nuevo controlador

// POST a new sale
router.post('/', createSale);

// GET sales with optional date range filter
router.get('/', getSales); // Nueva ruta para obtener ventas

module.exports = router;
