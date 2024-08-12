const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  ean: { type: String, required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);
