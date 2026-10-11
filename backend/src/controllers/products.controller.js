const productsService = require('../services/products.service');

const listProducts = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { availableOnly, page, limit } = req.query;
    const result = await productsService.listProducts({ availableOnly, page, limit }, prisma);
    return res.status(200).json({
      status: 'ok',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const product = await productsService.getProductById(req.params.id, prisma);
    return res.status(200).json({
      status: 'ok',
      data: product
    });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const product = await productsService.createProduct(req.body, prisma);
    return res.status(201).json({
      status: 'ok',
      message: 'Product created successfully',
      data: product
    });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const product = await productsService.updateProduct(req.params.id, req.body, prisma);
    return res.status(200).json({
      status: 'ok',
      message: 'Product updated successfully',
      data: product
    });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const result = await productsService.deleteProduct(req.params.id, prisma);
    return res.status(200).json({
      status: 'ok',
      message: result.message
    });
  } catch (err) {
    next(err);
  }
};

const addVariant = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { size, stockQuantity } = req.body;
    const variant = await productsService.addVariant(req.params.id, { size, stockQuantity }, prisma);
    return res.status(201).json({
      status: 'ok',
      message: 'Variant added successfully',
      data: variant
    });
  } catch (err) {
    next(err);
  }
};

const updateVariantStock = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { productId, variantId } = req.params;
    const { stockQuantity } = req.body;
    const updated = await productsService.updateVariantStock(productId, variantId, stockQuantity, prisma);
    return res.status(200).json({
      status: 'ok',
      message: 'Variant stock updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

const getLowStock = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { threshold } = req.query;
    const items = await productsService.getLowStockAlerts(threshold, prisma);
    return res.status(200).json({
      status: 'ok',
      data: items
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addVariant,
  updateVariantStock,
  getLowStock
};
