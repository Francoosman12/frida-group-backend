const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Asegúrate de definir el modelo Product
const Sale = require('../models/Sale'); // Importa el modelo Sale

// Ruta para registrar una venta
router.post('/', async (req, res) => {
  try {
    const { ean, quantity } = req.body;
    if (!ean || quantity == null) return res.status(400).json({ error: 'EAN and quantity are required' });

    // Buscar el producto por EAN
    const product = await Product.findOne({ ean });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });

    // Actualizar el stock del producto
    product.stock -= quantity;
    await product.save();

    // Guardar la venta en la base de datos
    const sale = new Sale({
      price,
      ean,
      quantity
      // El campo saleNumber ya no es necesario
    });
    await sale.save();

    res.status(201).json(sale); // Devuelve la venta registrada
  } catch (error) {
    console.error('Error registering sale:', error); // Log el error
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener todas las ventas
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find();
    res.status(200).json(sales);
  } catch (error) {
    console.error('Error fetching sales data:', error); // Log el error
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener una venta por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.status(200).json(sale);
  } catch (error) {
    console.error('Error fetching sale by ID:', error); // Log el error
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
