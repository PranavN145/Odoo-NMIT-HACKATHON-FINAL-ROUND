const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// GET /api/products/low-stock — Admin low stock alerts
router.get('/products/low-stock', authenticate, authorize('ADMIN'), productsController.getLowStock);

// GET /api/products — Public catalogue
router.get('/products', productsController.listProducts);

// GET /api/products/:id — Single product details
router.get('/products/:id', productsController.getProductById);

// POST /api/products — Admin creates product
router.post('/products', authenticate, authorize('ADMIN'), productsController.createProduct);

// PATCH /api/products/:id — Admin updates product
router.patch('/products/:id', authenticate, authorize('ADMIN'), productsController.updateProduct);

// DELETE /api/products/:id — Admin deletes product
router.delete('/products/:id', authenticate, authorize('ADMIN'), productsController.deleteProduct);

// POST /api/products/:id/variants — Admin adds product variant
router.post('/products/:id/variants', authenticate, authorize('ADMIN'), productsController.addVariant);

// PATCH /api/products/:productId/variants/:variantId — Admin updates stock
router.patch('/products/:productId/variants/:variantId', authenticate, authorize('ADMIN'), productsController.updateVariantStock);

module.exports = router;
