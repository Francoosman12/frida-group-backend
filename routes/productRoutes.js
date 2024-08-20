// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

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

// POST a new product
router.post('/', async (req, res) => {
  const { ean, description, price, stock } = req.body;
  const product = new Product({ ean, description, price, stock });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a product
router.put('/:id', async (req, res) => {
  try {
    const { ean, description, price, stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ean, description, price, stock },
      { new: true }
    );

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
