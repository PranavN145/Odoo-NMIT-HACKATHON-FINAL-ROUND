const defaultPrisma = require('../lib/prisma');

function formatProduct(p) {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    basePrice: Number(p.basePrice || 0).toFixed(2),
    imageUrl: p.imageUrl || null,
    isAvailable: Boolean(p.isAvailable),
    createdAt: p.createdAt ? p.createdAt.toISOString() : undefined,
    variants: p.variants ? p.variants.map((v) => ({
      id: v.id,
      size: v.size,
      stockQuantity: v.stockQuantity
    })) : []
  };
}

/**
 * Helper to auto-seed initial products if database is empty
 */
async function ensureInitialProducts(prisma = defaultPrisma) {
  try {
    const count = await prisma.product.count();
    if (count === 0) {
      await prisma.$transaction(async (tx) => {
        const p1 = await tx.product.create({
          data: {
            name: 'Skyline Association Hoodie 2026',
            basePrice: 35.00,
            imageUrl: '/assets/Navy Hoodie Logo Mockup Duo.png',
            isAvailable: true
          }
        });
        await tx.productVariant.createMany({
          data: [
            { productId: p1.id, size: 'S', stockQuantity: 15 },
            { productId: p1.id, size: 'M', stockQuantity: 30 },
            { productId: p1.id, size: 'L', stockQuantity: 25 },
            { productId: p1.id, size: 'XL', stockQuantity: 10 }
          ]
        });

        const p2 = await tx.product.create({
          data: {
            name: 'Embroidered Collegiate Crewneck',
            basePrice: 28.00,
            imageUrl: '/assets/navy-hoodie-mockup-duo.png',
            isAvailable: true
          }
        });
        await tx.productVariant.createMany({
          data: [
            { productId: p2.id, size: 'S', stockQuantity: 8 },
            { productId: p2.id, size: 'M', stockQuantity: 14 },
            { productId: p2.id, size: 'L', stockQuantity: 18 },
            { productId: p2.id, size: 'XL', stockQuantity: 5 }
          ]
        });
      });
    }
  } catch (err) {
    console.warn('Initial products auto-seed skipped:', err.message);
  }
}

/**
 * Service: List products
 */
async function listProducts({ availableOnly, page = 1, limit = 20 }, prisma = defaultPrisma) {
  await ensureInitialProducts(prisma);

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const where = {};
  if (availableOnly === 'true' || availableOnly === true) {
    where.isAvailable = true;
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: {
        variants: {
          orderBy: { size: 'asc' }
        }
      }
    })
  ]);

  return {
    items: products.map(formatProduct),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1
    }
  };
}

/**
 * Service: Get product details
 */
async function getProductById(id, prisma = defaultPrisma) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: {
        orderBy: { size: 'asc' }
      }
    }
  });

  if (!product) {
    const err = new Error(`Product with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  return formatProduct(product);
}

/**
 * Service: Create product (Admin)
 */
async function createProduct(data, prisma = defaultPrisma) {
  const { name, basePrice, imageUrl, variants } = data;

  if (!name || name.trim().length < 2) {
    const err = new Error('Product name must be at least 2 characters');
    err.statusCode = 400;
    throw err;
  }

  const priceNum = parseFloat(basePrice);
  if (isNaN(priceNum) || priceNum < 0) {
    const err = new Error('Base price must be a non-negative number');
    err.statusCode = 400;
    throw err;
  }

  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        name: name.trim(),
        basePrice: priceNum,
        imageUrl: imageUrl ? imageUrl.trim() : null,
        isAvailable: true
      }
    });

    if (Array.isArray(variants) && variants.length > 0) {
      for (const v of variants) {
        if (v.size) {
          await tx.productVariant.create({
            data: {
              productId: product.id,
              size: String(v.size).trim().toUpperCase(),
              stockQuantity: Math.max(0, parseInt(v.stockQuantity, 10) || 0)
            }
          });
        }
      }
    }

    const created = await tx.product.findUnique({
      where: { id: product.id },
      include: { variants: true }
    });

    return formatProduct(created);
  });
}

/**
 * Service: Update product (Admin)
 */
async function updateProduct(id, data, prisma = defaultPrisma) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error(`Product with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.basePrice !== undefined) updateData.basePrice = parseFloat(data.basePrice);
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl ? data.imageUrl.trim() : null;
  if (data.isAvailable !== undefined) updateData.isAvailable = Boolean(data.isAvailable);

  const updated = await prisma.product.update({
    where: { id },
    data: updateData,
    include: { variants: true }
  });

  return formatProduct(updated);
}

/**
 * Service: Delete product (Admin)
 */
async function deleteProduct(id, prisma = defaultPrisma) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error(`Product with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  await prisma.product.delete({ where: { id } });
  return { message: 'Product deleted successfully' };
}

/**
 * Service: Add variant (Admin)
 */
async function addVariant(productId, { size, stockQuantity }, prisma = defaultPrisma) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    const err = new Error(`Product with ID '${productId}' not found`);
    err.statusCode = 404;
    throw err;
  }

  if (!size || !size.trim()) {
    const err = new Error('Size variant label is required');
    err.statusCode = 400;
    throw err;
  }

  const normalizedSize = size.trim().toUpperCase();

  const existingVariant = await prisma.productVariant.findUnique({
    where: {
      productId_size: {
        productId,
        size: normalizedSize
      }
    }
  });

  if (existingVariant) {
    const err = new Error(`Size variant '${normalizedSize}' already exists for this product`);
    err.statusCode = 409;
    throw err;
  }

  const variant = await prisma.productVariant.create({
    data: {
      productId,
      size: normalizedSize,
      stockQuantity: Math.max(0, parseInt(stockQuantity, 10) || 0)
    }
  });

  return variant;
}

/**
 * Service: Update variant stock quantity (Admin)
 */
async function updateVariantStock(productId, variantId, stockQuantity, prisma = defaultPrisma) {
  const variant = await prisma.productVariant.findFirst({
    where: { id: variantId, productId }
  });

  if (!variant) {
    const err = new Error(`Variant with ID '${variantId}' not found for product '${productId}'`);
    err.statusCode = 404;
    throw err;
  }

  const qty = parseInt(stockQuantity, 10);
  if (isNaN(qty) || qty < 0) {
    const err = new Error('Stock quantity must be a non-negative integer');
    err.statusCode = 400;
    throw err;
  }

  const updated = await prisma.productVariant.update({
    where: { id: variantId },
    data: { stockQuantity: qty }
  });

  return updated;
}

/**
 * Service: Low Stock Alerts (Admin)
 */
async function getLowStockAlerts(threshold = 5, prisma = defaultPrisma) {
  const limitThreshold = Math.max(0, parseInt(threshold, 10) || 5);
  const variants = await prisma.productVariant.findMany({
    where: { stockQuantity: { lte: limitThreshold } },
    include: { product: true },
    orderBy: { stockQuantity: 'asc' }
  });

  return variants.map((v) => ({
    variantId: v.id,
    productId: v.productId,
    productName: v.product.name,
    size: v.size,
    stockQuantity: v.stockQuantity,
    basePrice: Number(v.product.basePrice).toFixed(2)
  }));
}

module.exports = {
  formatProduct,
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addVariant,
  updateVariantStock,
  getLowStockAlerts
};
