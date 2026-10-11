const reimbursementsService = require('../services/reimbursements.service');

const submitClaim = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { amount, reason, receiptUrl } = req.body;
    const claim = await reimbursementsService.submitReimbursement(req.user.id, { amount, reason, receiptUrl }, prisma);
    return res.status(201).json({
      status: 'ok',
      message: 'Reimbursement claim submitted',
      data: claim
    });
  } catch (err) {
    next(err);
  }
};

const getMyClaims = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const claims = await reimbursementsService.getUserReimbursements(req.user.id, prisma);
    return res.status(200).json({
      status: 'ok',
      data: claims
    });
  } catch (err) {
    next(err);
  }
};

const listClaims = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { status, page, limit } = req.query;
    const result = await reimbursementsService.listReimbursements({ status, page, limit }, prisma);
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
    const updated = await reimbursementsService.updateReimbursementStatus(req.params.id, { status }, req.user.id, prisma);
    return res.status(200).json({
      status: 'ok',
      message: `Reimbursement status updated to ${status}`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitClaim,
  getMyClaims,
  listClaims,
  updateStatus
};
