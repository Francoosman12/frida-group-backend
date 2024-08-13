const createSale = async (req, res) => {
    try {
      const { ean, quantity } = req.body;
      if (!ean || quantity == null) return res.status(400).json({ error: 'EAN and quantity are required' });
  
      // Verifica si el producto existe
      const product = await Product.findOne({ ean });
      if (!product) return res.status(404).json({ error: 'Product not found' });
  
      // Verifica el stock
      if (product.stock < quantity) return res.status(400).json({ error: 'Out of stock' });
  
      // Calcula el precio total
      const total = product.price * quantity;
  
      // Crea la venta
      const sale = new Sale({
        ean,
        quantity,
        price: product.price,  // Asegúrate de que este campo sea necesario
        total,
      });
  
      // Guarda la venta
      await sale.save();
  
      // Actualiza el stock del producto
      product.stock -= quantity;
      await product.save();
  
      res.status(201).json(sale);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  