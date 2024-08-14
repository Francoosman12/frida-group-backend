const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');

// POST a new sale
router.post('/', async (req, res) => {
    const { ean, quantity, price } = req.body;

    console.log('Request body:', req.body); // Verifica los datos recibidos

    // Asegúrate de que el precio y la cantidad estén incluidos en el cuerpo de la solicitud
    if (price === undefined || price === null || quantity === undefined || quantity === null) {
        return res.status(400).json({ error: 'Price and quantity are required' });
    }

    try {
        // Encuentra el producto con el EAN proporcionado
        const product = await Product.findOne({ ean });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Verifica si hay suficiente stock
        if (product.stock < quantity) return res.status(400).json({ message: 'Out of stock' });

        // Verifica que el precio proporcionado coincida con el precio del producto
        if (product.price !== price) {
            return res.status(400).json({ message: 'Price mismatch' });
        }

        // Crea una nueva venta
        const sale = new Sale({
            ean,
            quantity,
            price, // Incluye el precio recibido en la solicitud
            total: price * quantity, // Calcula el total con el precio recibido
        });

        // Guarda la venta en la base de datos
        const savedSale = await sale.save();

        // Actualiza el stock del producto
        product.stock -= quantity;
        await product.save();

        // Devuelve la venta guardada como respuesta
        res.status(201).json(savedSale);
    } catch (err) {
        console.error('Error creating sale:', err); // Agregar información al registro
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
