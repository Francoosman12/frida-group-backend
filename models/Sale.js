// src/models/Sale.js
const mongoose = require('mongoose'); // Asegúrate de importar mongoose

const saleSchema = new mongoose.Schema({
    ean: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },  // Asegúrate de que este campo sea necesario
    date: { type: Date, default: Date.now },
    description: { type: String, default: 'N/A' },
    total: { type: Number, required: true },
  });
  

module.exports = mongoose.model('Sale', saleSchema);
