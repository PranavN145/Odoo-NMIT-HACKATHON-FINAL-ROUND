const membershipsService = require('../services/memberships.service');

const getMyMembership = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const result = await membershipsService.getCurrentUserMembership(req.user.id, prisma);
    if (!result) {
      return res.status(200).json({
        status: 'ok',
        data: null,
        message: 'No membership record found'
      });
    }
    return res.status(200).json({
      status: 'ok',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const applyMembership = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { durationYears } = req.body;
    const result = await membershipsService.applyMembership(req.user.id, { durationYears }, prisma);
    return res.status(201).json({
      status: 'ok',
      message: 'Membership application submitted; payment is pending',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const listMemberships = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { status, page, limit } = req.query;
    const result = await membershipsService.listMemberships({ status, page, limit }, prisma);
    return res.status(200).json({
      status: 'ok',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const getMembershipById = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const result = await membershipsService.getMembershipById(req.params.id, prisma);
    return res.status(200).json({
      status: 'ok',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const listExpiring = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { days, page, limit } = req.query;
    const result = await membershipsService.listExpiringMemberships({ days, page, limit }, prisma);
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
      return res.status(400).json({
        status: 'error',
        message: 'Field "status" is required'
      });
    }
    const result = await membershipsService.updateMembershipStatus(req.params.id, { status }, prisma);
    return res.status(200).json({
      status: 'ok',
      message: `Membership status updated to ${status}`,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyMembership,
  applyMembership,
  listMemberships,
  getMembershipById,
  listExpiring,
  updateStatus
};
