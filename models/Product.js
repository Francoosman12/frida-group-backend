const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  ean: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: false }, // Guardamos la URL de la imagen
});

module.exports = mongoose.model('Product', productSchema);
