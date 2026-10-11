const defaultPrisma = require('../lib/prisma');

function formatTask(t) {
  if (!t) return null;
  return {
    id: t.id,
    title: t.title,
    description: t.description,
    eventId: t.eventId || null,
    eventTitle: t.event?.title || undefined,
    deadline: t.deadline ? t.deadline.toISOString() : null,
    status: t.status,
    assigneeId: t.assigneeId || null,
    assignee: t.assignee ? {
      id: t.assignee.id,
      name: t.assignee.name,
      email: t.assignee.email
    } : null,
    createdAt: t.createdAt ? t.createdAt.toISOString() : new Date().toISOString()
  };
}

/**
 * Service: List all tasks (Admin)
 */
async function listTasks({ status, eventId, assigneeId, page = 1, limit = 20 }, prisma = defaultPrisma) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const where = {};
  if (status) where.status = status.toUpperCase();
  if (eventId) where.eventId = eventId;
  if (assigneeId) where.assigneeId = assigneeId;

  const [total, tasks] = await Promise.all([
    prisma.volunteerTask.count({ where }),
    prisma.volunteerTask.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: { assignee: true, event: true }
    })
  ]);

  return {
    items: tasks.map(formatTask),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1
    }
  };
}

/**
 * Service: Browse open task opportunities (Volunteer / Admin)
 */
async function getOpenOpportunities({ page = 1, limit = 20 }, prisma = defaultPrisma) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const where = {
    assigneeId: null,
    status: 'PENDING'
  };

  const [total, tasks] = await Promise.all([
    prisma.volunteerTask.count({ where }),
    prisma.volunteerTask.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: { event: true }
    })
  ]);

  return {
    items: tasks.map(formatTask),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1
    }
  };
}

/**
 * Service: Get tasks assigned to current volunteer
 */
async function getMyAssignedTasks(userId, prisma = defaultPrisma) {
  const tasks = await prisma.volunteerTask.findMany({
    where: { assigneeId: userId },
    orderBy: { createdAt: 'desc' },
    include: { event: true }
  });

  return tasks.map(formatTask);
}

/**
 * Service: Create task (Admin)
 * Strictly verifies assignee is an active volunteer and not an Admin
 */
async function createTask(data, prisma = defaultPrisma) {
  const { title, description, assigneeId, eventId, deadline } = data;

  if (!title || title.trim().length < 2) {
    const err = new Error('Task title must be at least 2 characters');
    err.statusCode = 400;
    throw err;
  }

  if (assigneeId) {
    const assignee = await prisma.user.findUnique({ where: { id: assigneeId } });
    if (!assignee) {
      const err = new Error(`Assignee user with ID '${assigneeId}' not found`);
      err.statusCode = 404;
      throw err;
    }

    if (assignee.role === 'ADMIN' || !assignee.isVolunteer) {
      const err = new Error('Admins cannot work as volunteers and cannot be assigned volunteer tasks. Assignee must be an active member volunteer.');
      err.statusCode = 422;
      throw err;
    }
  }

  const created = await prisma.volunteerTask.create({
    data: {
      title: title.trim(),
      description: (description || '').trim(),
      assigneeId: assigneeId || null,
      eventId: eventId || null,
      deadline: deadline ? new Date(deadline) : null,
      status: 'PENDING'
    },
    include: { assignee: true, event: true }
  });

  return formatTask(created);
}

/**
 * Service: Update task progress status (Volunteer or Admin)
 */
async function updateTaskStatus(id, status, user, prisma = defaultPrisma) {
  const task = await prisma.volunteerTask.findUnique({ where: { id } });
  if (!task) {
    const err = new Error(`Task with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  if (user.role !== 'ADMIN' && task.assigneeId !== user.id) {
    const err = new Error('Access forbidden: You can only update tasks assigned to you');
    err.statusCode = 403;
    throw err;
  }

  const normalizedStatus = status.toUpperCase();
  if (!['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(normalizedStatus)) {
    const err = new Error('Invalid task status');
    err.statusCode = 400;
    throw err;
  }

  const updated = await prisma.volunteerTask.update({
    where: { id },
    data: { status: normalizedStatus },
    include: { assignee: true, event: true }
  });

  return formatTask(updated);
}

/**
 * Service: Assign / Reassign task (Admin)
 */
async function assignTask(id, assigneeId, prisma = defaultPrisma) {
  const task = await prisma.volunteerTask.findUnique({ where: { id } });
  if (!task) {
    const err = new Error(`Task with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  if (assigneeId) {
    const assignee = await prisma.user.findUnique({ where: { id: assigneeId } });
    if (!assignee) {
      const err = new Error(`Assignee with ID '${assigneeId}' not found`);
      err.statusCode = 404;
      throw err;
    }

    if (assignee.role === 'ADMIN' || !assignee.isVolunteer) {
      const err = new Error('Cannot assign task: Target user is an Admin or not registered as a volunteer');
      err.statusCode = 422;
      throw err;
    }
  }

  const updated = await prisma.volunteerTask.update({
    where: { id },
    data: { assigneeId: assigneeId || null },
    include: { assignee: true, event: true }
  });

  return formatTask(updated);
}

/**
 * Service: Delete task (Admin)
 */
async function deleteTask(id, prisma = defaultPrisma) {
  const task = await prisma.volunteerTask.findUnique({ where: { id } });
  if (!task) {
    const err = new Error(`Task with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  await prisma.volunteerTask.delete({ where: { id } });
  return { message: 'Task deleted successfully' };
}

module.exports = {
  formatTask,
  listTasks,
  getOpenOpportunities,
  getMyAssignedTasks,
  createTask,
  updateTaskStatus,
  assignTask,
  deleteTask
};
