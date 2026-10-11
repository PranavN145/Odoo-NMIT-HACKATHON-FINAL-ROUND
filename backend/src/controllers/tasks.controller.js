const tasksService = require('../services/tasks.service');

const listTasks = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { status, eventId, assigneeId, page, limit } = req.query;
    const result = await tasksService.listTasks({ status, eventId, assigneeId, page, limit }, prisma);
    return res.status(200).json({
      status: 'ok',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const getOpportunities = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { page, limit } = req.query;
    const result = await tasksService.getOpenOpportunities({ page, limit }, prisma);
    return res.status(200).json({
      status: 'ok',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const getMyTasks = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const tasks = await tasksService.getMyAssignedTasks(req.user.id, prisma);
    return res.status(200).json({
      status: 'ok',
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const task = await tasksService.createTask(req.body, prisma);
    return res.status(201).json({
      status: 'ok',
      message: 'Volunteer task created successfully',
      data: task
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
    const updated = await tasksService.updateTaskStatus(req.params.id, status, req.user, prisma);
    return res.status(200).json({
      status: 'ok',
      message: 'Task status updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

const assignTask = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { assigneeId } = req.body;
    const updated = await tasksService.assignTask(req.params.id, assigneeId, prisma);
    return res.status(200).json({
      status: 'ok',
      message: 'Task assignment updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const result = await tasksService.deleteTask(req.params.id, prisma);
    return res.status(200).json({
      status: 'ok',
      message: result.message
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listTasks,
  getOpportunities,
  getMyTasks,
  createTask,
  updateStatus,
  assignTask,
  deleteTask
};
