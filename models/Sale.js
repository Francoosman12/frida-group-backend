// src/models/Sale.js
const mongoose = require('mongoose'); // Asegúrate de importar mongoose

const saleSchema = new mongoose.Schema({
  ean: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // Cambiado a Number
  date: { type: Date, default: Date.now },
  description: { type: String, default: 'N/A' },
  saleNumber: { type: Number } // Añadido el campo saleNumber
});

// Middleware para generar el número de venta secuencial
saleSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastSale = await mongoose.model('Sale').findOne().sort('-saleNumber');
    this.saleNumber = lastSale ? lastSale.saleNumber + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Sale', saleSchema);
