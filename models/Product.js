const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  ean: { type: String, required: true, unique: true }, // Asegura que sea único
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String }, // URL de la imagen subida
  qrCodeUrl: { type: String }, // URL del código QR en Cloudinary
});

module.exports = mongoose.model('Product', productSchema);
