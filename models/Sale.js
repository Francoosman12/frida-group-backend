const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  saleNumber: { type: Number, unique: true },
  ean: { type: String, required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now }
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
