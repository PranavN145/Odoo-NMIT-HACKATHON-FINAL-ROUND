const ordersService = require('../services/orders.service');

const placeOrder = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { items } = req.body;
    const order = await ordersService.placeOrder(req.user.id, items, prisma);
    return res.status(201).json({
      status: 'ok',
      message: 'Order created; payment is pending',
      data: order
    });
  } catch (err) {
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const orders = await ordersService.getUserOrders(req.user.id, prisma);
    return res.status(200).json({
      status: 'ok',
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const order = await ordersService.getOrderById(req.params.id, req.user, prisma);
    return res.status(200).json({
      status: 'ok',
      data: order
    });
  } catch (err) {
    next(err);
  }
};

const listOrders = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { status, page, limit } = req.query;
    const result = await ordersService.listOrders({ status, page, limit }, prisma);
    return res.status(200).json({
      status: 'ok',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ status: 'error', message: 'Status is required' });
    }
    const updated = await ordersService.updateOrderStatus(req.params.id, status, prisma);
    return res.status(200).json({
      status: 'ok',
      message: 'Order status updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const result = await ordersService.cancelOrder(req.params.id, req.user, prisma);
    return res.status(200).json({
      status: 'ok',
      message: result.message,
      data: result.order
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  listOrders,
  updateStatus,
  cancelOrder
};
