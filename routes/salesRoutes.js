// routes/salesRoutes.js
const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');

// POST a new sale
router.post('/', async (req, res) => {
  const { ean, quantity } = req.body;
  
  try {
    // Verificar que el producto existe
    const product = await Product.findOne({ ean });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Verificar stock
    if (product.stock < quantity) return res.status(400).json({ message: 'Out of stock' });

    // Crear la venta
    const sale = new Sale({
      ean,
      quantity,
      date: new Date(),
      total: product.price * quantity,
    });

    // Guardar la venta
    const savedSale = await sale.save();
    
    // Actualizar el stock del producto
    product.stock -= quantity;
    await product.save();

    res.status(201).json(savedSale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
