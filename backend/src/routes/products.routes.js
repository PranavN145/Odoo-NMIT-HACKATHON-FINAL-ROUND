const express = require('express');
const router = express.Router();
const { prisma, memoryProducts, memoryOrders } = require('../lib/db');

/**
 * GET /api/products
 * Fetch all available merchandise products
 */
router.get('/products', async (req, res, next) => {
  try {
    if (prisma) {
      try {
        const products = await prisma.product.findMany({
          where: { isAvailable: true },
          include: { variants: true }
        });
        if (products && products.length > 0) {
          return res.status(200).json(products);
        }
      } catch (dbErr) {
        console.warn("Prisma products query failed, using memory store:", dbErr.message);
      }
    }

    return res.status(200).json(memoryProducts);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/orders
 * Process customer merchandise orders
 */
router.post('/orders', async (req, res, next) => {
  try {
    const { items, email } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: { message: 'Order must contain at least one merchandise item.' } });
    }

    const orderId = `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const totalAmount = items.reduce((acc, curr) => acc + (curr.price || 0) * (curr.qty || 1), 0);

    const newOrder = {
      id: orderId,
      email: email || 'guest@skyline.edu',
      items,
      totalAmount,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    memoryOrders.push(newOrder);

    return res.status(201).json({
      message: 'Merchandise order created successfully',
      orderId,
      totalAmount,
      order: newOrder
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
