const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Asegúrate de definir el modelo Product
const Sale = require('../models/Sale'); // Importa el modelo Sale

// Ruta para registrar una venta
router.post('/', async (req, res) => {
  try {
    const { ean, quantity } = req.body;
    if (!ean || quantity == null) return res.status(400).json({ error: 'EAN and quantity are required' });

    const product = await Product.findOne({ ean });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });

    product.stock -= quantity;
    await product.save();

    // Guardar la venta en la base de datos
    const sale = new Sale({ ean, quantity });
    await sale.save();

    res.status(200).json({ message: 'Sale registered successfully' });
  } catch (error) {
    console.error('Error registering sale:', error); // Log el error
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
