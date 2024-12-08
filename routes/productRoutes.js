const express = require('express');
const router = express.Router();
const upload = require('../middlewares/cloudinaryConfig');
const Product = require('../models/Product');
const QRCode = require('qrcode'); // Importamos la librería QRCode para generar los códigos QR
const cloudinary = require('cloudinary').v2; // Necesitamos Cloudinary para subir imágenes
const { v4: uuidv4 } = require('uuid'); // Usamos UUID para generar un ID único para el QR

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET product by EAN
router.get('/search', async (req, res) => {
  try {
    const { ean } = req.query;
    if (!ean) return res.status(400).json({ message: 'EAN is required' });

    const product = await Product.findOne({ ean });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Función para generar un EAN único de 13 dígitos
async function generateUniqueEAN() {
  let ean;
  let isUnique = false;

  while (!isUnique) {
    ean = Math.floor(1000000000000 + Math.random() * 9000000000000).toString(); // Genera un número aleatorio de 13 dígitos
    const existingProduct = await Product.findOne({ ean });
    if (!existingProduct) isUnique = true;
  }

  return ean;
}

// POST a new product (con imagen y QR)
router.post('/', upload.single('image'), async (req, res) => {
  const { description, price, stock } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    // Generar un EAN único
    const ean = await generateUniqueEAN();

    // Generar el código QR con el EAN
    let qrCodeImage;
    try {
      qrCodeImage = await QRCode.toDataURL(ean);
    } catch (err) {
      console.error('Error al generar el código QR:', err.message);
      throw new Error('No se pudo generar el código QR');
    }

    // Subir el QR a Cloudinary
    let qrCodeUpload;
    try {
      qrCodeUpload = await cloudinary.uploader.upload(qrCodeImage, {
        folder: 'products_qr',
        public_id: `qr_${ean}`,
        resource_type: 'image',
        format: 'png',
      });
    } catch (err) {
      console.error('Error al subir el QR a Cloudinary:', err.message);
      throw new Error('No se pudo subir el código QR a Cloudinary');
    }

    // Crear el producto
    const product = new Product({
      ean, // EAN único generado
      description,
      price,
      stock,
      image,
      qrCodeUrl: qrCodeUpload.secure_url, // URL del QR generado
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error al crear el producto:', err.message);
    res.status(400).json({ message: err.message });
  }
});


// PUT update a product (con imagen en Cloudinary)
router.put('/:id', upload.single('image'), async (req, res) => {
  const { description, price, stock } = req.body;
  const image = req.file ? req.file.path : null;

  const updateData = { description, price, stock };
  if (image) updateData.image = image;

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
