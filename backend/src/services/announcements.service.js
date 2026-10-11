const defaultPrisma = require('../lib/prisma');

function formatAnnouncement(a) {
  if (!a) return null;
  return {
    id: a.id,
    title: a.title,
    content: a.content,
    audience: a.audience,
    publishedById: a.publishedById,
    publishedBy: a.publishedBy ? {
      id: a.publishedBy.id,
      name: a.publishedBy.name,
      role: a.publishedBy.role
    } : undefined,
    createdAt: a.createdAt ? a.createdAt.toISOString() : new Date().toISOString()
  };
}

/**
 * Service: List announcements with role-based audience filtering
 */
async function listAnnouncements({ page = 1, limit = 20, user = null }, prisma = defaultPrisma) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const where = {};

  if (!user) {
    where.audience = 'ALL';
  } else if (user.role === 'ADMIN') {
    // Admins see all announcements
  } else if (user.role === 'MEMBER') {
    if (user.isVolunteer) {
      where.audience = { in: ['ALL', 'MEMBERS', 'VOLUNTEERS'] };
    } else {
      where.audience = { in: ['ALL', 'MEMBERS'] };
    }
  }

  const [total, announcements] = await Promise.all([
    prisma.announcement.count({ where }),
    prisma.announcement.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: { publishedBy: true }
    })
  ]);

  return {
    items: announcements.map(formatAnnouncement),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1
    }
  };
}

/**
 * Service: Get announcement details
 */
async function getAnnouncementById(id, user = null, prisma = defaultPrisma) {
  const item = await prisma.announcement.findUnique({
    where: { id },
    include: { publishedBy: true }
  });

  if (!item) {
    const err = new Error(`Announcement with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  // Audience permission check
  if (!user && item.audience !== 'ALL') {
    const err = new Error('Access forbidden: Authentication required to view this announcement');
    err.statusCode = 403;
    throw err;
  }
  if (user && user.role !== 'ADMIN') {
    if (item.audience === 'VOLUNTEERS' && !user.isVolunteer) {
      const err = new Error('Access forbidden: This announcement is restricted to active volunteers');
      err.statusCode = 403;
      throw err;
    }
  }

  return formatAnnouncement(item);
}

/**
 * Service: Create announcement (Admin)
 */
async function createAnnouncement({ title, content, audience = 'ALL' }, adminId, prisma = defaultPrisma) {
  if (!title || title.trim().length < 2) {
    const err = new Error('Title must be at least 2 characters');
    err.statusCode = 400;
    throw err;
  }
  if (!content || content.trim().length < 2) {
    const err = new Error('Content must be at least 2 characters');
    err.statusCode = 400;
    throw err;
  }

  const normalizedAudience = audience ? audience.toUpperCase() : 'ALL';
  if (!['ALL', 'MEMBERS', 'VOLUNTEERS'].includes(normalizedAudience)) {
    const err = new Error('Invalid audience. Allowed: ALL, MEMBERS, VOLUNTEERS');
    err.statusCode = 400;
    throw err;
  }

  const created = await prisma.announcement.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      audience: normalizedAudience,
      publishedById: adminId
    },
    include: { publishedBy: true }
  });

  return formatAnnouncement(created);
}

/**
 * Service: Update announcement (Admin)
 */
async function updateAnnouncement(id, data, prisma = defaultPrisma) {
  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error(`Announcement with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.content !== undefined) updateData.content = data.content.trim();
  if (data.audience !== undefined) {
    const aud = data.audience.toUpperCase();
    if (!['ALL', 'MEMBERS', 'VOLUNTEERS'].includes(aud)) {
      const err = new Error('Invalid audience. Allowed: ALL, MEMBERS, VOLUNTEERS');
      err.statusCode = 400;
      throw err;
    }
    updateData.audience = aud;
  }

  const updated = await prisma.announcement.update({
    where: { id },
    data: updateData,
    include: { publishedBy: true }
  });

  return formatAnnouncement(updated);
}

/**
 * Service: Delete announcement (Admin)
 */
async function deleteAnnouncement(id, prisma = defaultPrisma) {
  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error(`Announcement with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  await prisma.announcement.delete({ where: { id } });
  return { message: 'Announcement deleted successfully' };
}

module.exports = {
  formatAnnouncement,
  listAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
