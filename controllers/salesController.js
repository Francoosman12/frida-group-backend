const Sale = require('../models/Sale');
const Product = require('../models/Product');

const createSale = async (req, res) => {
  try {
    const { ean, quantity, price } = req.body;
    if (!ean || quantity == null || price == null) {
      return res.status(400).json({ error: 'EAN, quantity, and price are required' });
    }

    const product = await Product.findOne({ ean });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (product.stock < quantity) return res.status(400).json({ error: 'Out of stock' });

    if (product.price !== price) {
      return res.status(400).json({ error: 'Price mismatch' });
    }

    const sale = new Sale({
      ean,
      quantity,
      price,
      total: price * quantity,
    });

    const savedSale = await sale.save();

    product.stock -= quantity;
    await product.save();

    res.status(201).json(savedSale);
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ error: error.message });
  }
};

const getSales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const sales = await Sale.find(filter);
    res.status(200).json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createSale, getSales };
