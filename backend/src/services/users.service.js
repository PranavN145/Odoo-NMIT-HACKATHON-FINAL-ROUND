const defaultPrisma = require('../lib/prisma');
const { sanitizeUser } = require('./auth.service');

/**
 * Service: Update user's own profile (name, phone)
 */
async function updateSelfProfile(userId, { name, phone }, prisma = defaultPrisma) {
  const updateData = {};
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 2) {
      const err = new Error('Name must be at least 2 characters long');
      err.statusCode = 400;
      throw err;
    }
    updateData.name = name.trim();
  }

  if (phone !== undefined) {
    updateData.phone = phone ? String(phone).trim() : null;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData
  });

  return sanitizeUser(updatedUser);
}

/**
 * Service: List users (Admin) with pagination and filters
 */
async function listUsers({ role, isVolunteer, search, page = 1, limit = 20 }, prisma = defaultPrisma) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const where = {};
  if (role) {
    where.role = role.toUpperCase();
  }
  if (isVolunteer !== undefined) {
    where.isVolunteer = isVolunteer === true || isVolunteer === 'true';
  }
  if (search && search.trim()) {
    const s = search.trim();
    where.OR = [
      { name: { contains: s, mode: 'insensitive' } },
      { email: { contains: s, mode: 'insensitive' } }
    ];
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return {
    items: users.map((u) => sanitizeUser(u)),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1
    }
  };
}

/**
 * Service: Get User by ID (Admin)
 */
async function getUserById(id, prisma = defaultPrisma) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    const err = new Error(`User with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }
  return sanitizeUser(user);
}

/**
 * Service: Update User Role & Volunteer Status (Admin)
 * Invariant: If role === 'ADMIN', isVolunteer MUST be false.
 */
async function updateUserRole(id, { role, isVolunteer }, prisma = defaultPrisma) {
  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) {
    const err = new Error(`User with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  const updateData = {};
  if (role) {
    const normalizedRole = role.toUpperCase();
    if (!['ADMIN', 'MEMBER'].includes(normalizedRole)) {
      const err = new Error('Invalid role. Role must be ADMIN or MEMBER');
      err.statusCode = 400;
      throw err;
    }
    updateData.role = normalizedRole;
  }

  const finalRole = updateData.role || targetUser.role;

  if (isVolunteer !== undefined) {
    updateData.isVolunteer = Boolean(isVolunteer);
  }

  // Enforce invariant: An ADMIN cannot be a volunteer
  if (finalRole === 'ADMIN') {
    updateData.isVolunteer = false;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData
  });

  return sanitizeUser(updated);
}

module.exports = {
  updateSelfProfile,
  listUsers,
  getUserById,
  updateUserRole
};
