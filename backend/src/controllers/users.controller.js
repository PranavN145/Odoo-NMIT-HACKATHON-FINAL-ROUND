const usersService = require('../services/users.service');

const updateSelf = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { name, phone } = req.body;
    const updatedUser = await usersService.updateSelfProfile(req.user.id, { name, phone }, prisma);
    return res.status(200).json({
      status: 'ok',
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (err) {
    next(err);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { role, isVolunteer, search, page, limit } = req.query;
    const result = await usersService.listUsers({ role, isVolunteer, search, page, limit }, prisma);
    return res.status(200).json({
      status: 'ok',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const user = await usersService.getUserById(req.params.id, prisma);
    return res.status(200).json({
      status: 'ok',
      data: user
    });
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { role, isVolunteer } = req.body;
    const updated = await usersService.updateUserRole(req.params.id, { role, isVolunteer }, prisma);
    return res.status(200).json({
      status: 'ok',
      message: 'User permissions updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateSelf,
  listUsers,
  getUserById,
  updateUserRole
};
