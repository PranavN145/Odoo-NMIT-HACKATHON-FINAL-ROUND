const dashboardService = require('../services/dashboard.service');

const getAdminDashboard = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const data = await dashboardService.getAdminDashboard(prisma);
    return res.status(200).json({
      status: 'ok',
      data
    });
  } catch (err) {
    next(err);
  }
};

const getVolunteerDashboard = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const data = await dashboardService.getVolunteerDashboard(req.user.id, prisma);
    return res.status(200).json({
      status: 'ok',
      data
    });
  } catch (err) {
    next(err);
  }
};

const getMemberDashboard = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const data = await dashboardService.getMemberDashboard(req.user.id, prisma);
    return res.status(200).json({
      status: 'ok',
      data
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminDashboard,
  getVolunteerDashboard,
  getMemberDashboard
};
