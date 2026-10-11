const financeService = require('../services/finance.service');

const getSummary = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const summary = await financeService.getFinanceSummary(prisma);
    return res.status(200).json({
      status: 'ok',
      data: summary
    });
  } catch (err) {
    next(err);
  }
};

const listTransactions = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { type, category, page, limit } = req.query;
    const result = await financeService.listTransactions({ type, category, page, limit }, prisma);
    return res.status(200).json({
      status: 'ok',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const recordTransaction = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const created = await financeService.recordManualTransaction(req.body, req.user.id, prisma);
    return res.status(201).json({
      status: 'ok',
      message: 'Transaction recorded successfully',
      data: created
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSummary,
  listTransactions,
  recordTransaction
};
