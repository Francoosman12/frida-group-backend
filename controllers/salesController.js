const Sale = require('../models/Sale'); // Asegúrate de que esta línea está correctamente importando Sale
const Product = require('../models/Product');

const createSale = async (req, res) => {
  try {
    const { ean, quantity, price } = req.body;
    if (!ean || quantity == null || price == null) {
      return res.status(400).json({ error: 'EAN, quantity, and price are required' });
    }

    // Verifica si el producto existe
    const product = await Product.findOne({ ean });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Verifica el stock
    if (product.stock < quantity) return res.status(400).json({ error: 'Out of stock' });

    // Verifica que el precio coincide con el del producto
    if (product.price !== price) {
      return res.status(400).json({ error: 'Price mismatch' });
    }

    // Crea la venta
    const sale = new Sale({
      ean,
      quantity,
      price,
      total: price * quantity,
    });

    // Guarda la venta
    const savedSale = await sale.save();

    // Actualiza el stock del producto
    product.stock -= quantity;
    await product.save();

    res.status(201).json(savedSale);
  } catch (error) {
    console.error('Error creating sale:', error); // Información de error
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createSale };
