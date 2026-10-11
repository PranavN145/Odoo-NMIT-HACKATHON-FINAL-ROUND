const paymentsService = require('../services/payments.service');

const mockConfirmPayment = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const resourceType = req.body.resourceType || req.body.targetType;
    const resourceId = req.body.resourceId || req.body.targetId;
    const result = await paymentsService.mockConfirmPayment({ resourceType, resourceId }, req.user, prisma);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  mockConfirmPayment
};
