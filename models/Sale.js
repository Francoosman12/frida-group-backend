const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  ean: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true }, // Campo agregado
  date: { type: Date, default: Date.now },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
});

module.exports = mongoose.model('Sale', saleSchema);
