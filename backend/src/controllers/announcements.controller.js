const announcementsService = require('../services/announcements.service');

const listAnnouncements = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { page, limit } = req.query;
    const result = await announcementsService.listAnnouncements({ page, limit, user: req.user }, prisma);
    return res.status(200).json({
      status: 'ok',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const getAnnouncementById = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const result = await announcementsService.getAnnouncementById(req.params.id, req.user, prisma);
    return res.status(200).json({
      status: 'ok',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const createAnnouncement = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const result = await announcementsService.createAnnouncement(req.body, req.user.id, prisma);
    return res.status(201).json({
      status: 'ok',
      message: 'Announcement published successfully',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const updateAnnouncement = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const result = await announcementsService.updateAnnouncement(req.params.id, req.body, prisma);
    return res.status(200).json({
      status: 'ok',
      message: 'Announcement updated successfully',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const deleteAnnouncement = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const result = await announcementsService.deleteAnnouncement(req.params.id, prisma);
    return res.status(200).json({
      status: 'ok',
      message: result.message
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
