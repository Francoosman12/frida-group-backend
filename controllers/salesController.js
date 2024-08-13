// controllers/salesController.js
const Sale = require('../models/Sale'); // Asegúrate de que el modelo Sale esté correctamente definido

// Obtener todas las ventas
const getSales = async (req, res) => {
  try {
    const sales = await Sale.find();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una venta
const createSale = async (req, res) => {
  try {
    const { ean, quantity } = req.body;
    if (!ean || quantity == null) return res.status(400).json({ error: 'EAN and quantity are required' });

    // Aquí podrías agregar la lógica para verificar stock, etc.
    const sale = new Sale({ ean, quantity });
    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getSales,
  createSale,
};
