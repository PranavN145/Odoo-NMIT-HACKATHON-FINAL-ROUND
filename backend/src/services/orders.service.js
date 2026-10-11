const defaultPrisma = require('../lib/prisma');

function formatOrder(o) {
  if (!o) return null;
  return {
    id: o.id,
    userId: o.userId,
    user: o.user ? {
      id: o.user.id,
      name: o.user.name,
      email: o.user.email
    } : undefined,
    totalAmount: Number(o.totalAmount || 0).toFixed(2),
    status: o.status,
    createdAt: o.createdAt ? o.createdAt.toISOString() : new Date().toISOString(),
    items: o.orderItems ? o.orderItems.map((item) => ({
      id: item.id,
      variantId: item.variantId,
      size: item.variant?.size,
      productName: item.variant?.product?.name,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice || 0).toFixed(2)
    })) : []
  };
}

/**
 * Service: Place merchandise order
 */
async function placeOrder(userId, items, prisma = defaultPrisma) {
  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error('Order must contain at least one item');
    err.statusCode = 400;
    throw err;
  }

  return await prisma.$transaction(async (tx) => {
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0) {
        const err = new Error('Item quantity must be a positive integer');
        err.statusCode = 400;
        throw err;
      }

      const variant = await tx.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true }
      });

      if (!variant) {
        const err = new Error(`Product variant with ID '${item.variantId}' not found`);
        err.statusCode = 404;
        throw err;
      }

      if (variant.stockQuantity < qty) {
        const err = new Error(`Insufficient stock for ${variant.product.name} (Size: ${variant.size}). Available: ${variant.stockQuantity}`);
        err.statusCode = 422;
        throw err;
      }

      // Decrement stock atomically
      await tx.productVariant.update({
        where: { id: variant.id },
        data: { stockQuantity: variant.stockQuantity - qty }
      });

      const unitPriceNum = Number(variant.product.basePrice);
      calculatedTotal += unitPriceNum * qty;

      validatedItems.push({
        variantId: variant.id,
        quantity: qty,
        unitPrice: unitPriceNum
      });
    }

    // Create Order
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount: calculatedTotal,
        status: 'PENDING',
        orderItems: {
          create: validatedItems.map((vi) => ({
            variantId: vi.variantId,
            quantity: vi.quantity,
            unitPrice: vi.unitPrice
          }))
        }
      },
      include: {
        orderItems: {
          include: {
            variant: {
              include: { product: true }
            }
          }
        },
        user: true
      }
    });

    return formatOrder(order);
  });
}

/**
 * Service: Get orders for authenticated user
 */
async function getUserOrders(userId, prisma = defaultPrisma) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        include: {
          variant: {
            include: { product: true }
          }
        }
      }
    }
  });

  return orders.map(formatOrder);
}

/**
 * Service: Get order details
 */
async function getOrderById(id, user, prisma = defaultPrisma) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          variant: {
            include: { product: true }
          }
        }
      },
      user: true
    }
  });

  if (!order) {
    const err = new Error(`Order with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  if (user.role !== 'ADMIN' && order.userId !== user.id) {
    const err = new Error('Access forbidden: You cannot view another user\'s order');
    err.statusCode = 403;
    throw err;
  }

  return formatOrder(order);
}

/**
 * Service: List all orders (Admin)
 */
async function listOrders({ status, page = 1, limit = 20 }, prisma = defaultPrisma) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const where = {};
  if (status) {
    where.status = status.toUpperCase();
  }

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            variant: {
              include: { product: true }
            }
          }
        },
        user: true
      }
    })
  ]);

  return {
    items: orders.map(formatOrder),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1
    }
  };
}

/**
 * Service: Update order status (Admin)
 */
async function updateOrderStatus(id, status, prisma = defaultPrisma) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    const err = new Error(`Order with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  const normalizedStatus = status.toUpperCase();
  if (!['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(normalizedStatus)) {
    const err = new Error('Invalid order status');
    err.statusCode = 400;
    throw err;
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status: normalizedStatus },
    include: {
      orderItems: {
        include: {
          variant: { include: { product: true } }
        }
      },
      user: true
    }
  });

  return formatOrder(updated);
}

/**
 * Service: Cancel order and replenish reserved stock
 */
async function cancelOrder(id, user, prisma = defaultPrisma) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id },
      include: { orderItems: true }
    });

    if (!order) {
      const err = new Error(`Order with ID '${id}' not found`);
      err.statusCode = 404;
      throw err;
    }

    if (user.role !== 'ADMIN' && order.userId !== user.id) {
      const err = new Error('Access forbidden: You cannot cancel another user\'s order');
      err.statusCode = 403;
      throw err;
    }

    if (order.status === 'CANCELLED') {
      const err = new Error('Order is already cancelled');
      err.statusCode = 409;
      throw err;
    }

    if (['SHIPPED', 'DELIVERED'].includes(order.status)) {
      const err = new Error(`Cannot cancel an order that is already ${order.status}`);
      err.statusCode = 422;
      throw err;
    }

    // Replenish stock for all line items
    for (const item of order.orderItems) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stockQuantity: { increment: item.quantity } }
      });
    }

    const cancelled = await tx.order.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    return {
      message: 'Order cancelled and stock replenished',
      order: formatOrder(cancelled)
    };
  });
}

module.exports = {
  formatOrder,
  placeOrder,
  getUserOrders,
  getOrderById,
  listOrders,
  updateOrderStatus,
  cancelOrder
};
