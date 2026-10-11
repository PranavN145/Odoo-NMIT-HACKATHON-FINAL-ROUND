const defaultPrisma = require('../lib/prisma');

const ANNUAL_FEE = 25.00;

function formatMembership(m) {
  if (!m) return null;
  const now = new Date();
  const expiry = new Date(m.expiryDate);
  const diffTime = expiry.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const isRenewalDue = m.status === 'EXPIRED' || (m.status === 'ACTIVE' && daysRemaining <= 30);

  return {
    id: m.id,
    userId: m.userId,
    user: m.user ? {
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      role: m.user.role
    } : undefined,
    durationYears: m.durationYears,
    startDate: m.startDate ? m.startDate.toISOString() : null,
    expiryDate: m.expiryDate ? m.expiryDate.toISOString() : null,
    amountPaid: Number(m.amountPaid || 0).toFixed(2),
    status: m.status,
    daysRemaining,
    isRenewalDue,
    createdAt: m.createdAt.toISOString()
  };
}

/**
 * Service: Get user's latest/active membership
 */
async function getCurrentUserMembership(userId, prisma = defaultPrisma) {
  const membership = await prisma.membership.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  if (!membership) {
    return null;
  }

  return formatMembership(membership);
}

/**
 * Service: Apply for / Renew Membership
 */
async function applyMembership(userId, { durationYears = 1 }, prisma = defaultPrisma) {
  const years = parseInt(durationYears, 10) || 1;
  if (years < 1 || years > 5) {
    const err = new Error('Duration must be between 1 and 5 years');
    err.statusCode = 400;
    throw err;
  }

  // Check if active unexpired membership exists with > 30 days remaining
  const active = await prisma.membership.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
      expiryDate: { gt: new Date() }
    }
  });

  if (active) {
    const now = new Date();
    const daysRemaining = Math.ceil((new Date(active.expiryDate) - now) / (1000 * 60 * 60 * 24));
    if (daysRemaining > 30) {
      const err = new Error('Active membership already exists with more than 30 days remaining');
      err.statusCode = 409;
      throw err;
    }
  }

  const startDate = new Date();
  const expiryDate = new Date();
  expiryDate.setFullYear(startDate.getFullYear() + years);

  const newMembership = await prisma.membership.create({
    data: {
      userId,
      durationYears: years,
      startDate,
      expiryDate,
      amountPaid: 0.00,
      status: 'PENDING'
    },
    include: { user: true }
  });

  return formatMembership(newMembership);
}

/**
 * Service: List Memberships (Admin)
 */
async function listMemberships({ status, page = 1, limit = 20 }, prisma = defaultPrisma) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const where = {};
  if (status) {
    where.status = status.toUpperCase();
  }

  const [total, items] = await Promise.all([
    prisma.membership.count({ where }),
    prisma.membership.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })
  ]);

  return {
    items: items.map(formatMembership),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1
    }
  };
}

/**
 * Service: Get Membership by ID (Admin)
 */
async function getMembershipById(id, prisma = defaultPrisma) {
  const item = await prisma.membership.findUnique({
    where: { id },
    include: { user: true }
  });
  if (!item) {
    const err = new Error(`Membership with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }
  return formatMembership(item);
}

/**
 * Service: List Expiring Memberships (Admin)
 */
async function listExpiringMemberships({ days = 30, page = 1, limit = 20 }, prisma = defaultPrisma) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const thresholdDays = parseInt(days, 10) || 30;
  const now = new Date();
  const futureThreshold = new Date();
  futureThreshold.setDate(now.getDate() + thresholdDays);

  const where = {
    status: 'ACTIVE',
    expiryDate: {
      gte: now,
      lte: futureThreshold
    }
  };

  const [total, items] = await Promise.all([
    prisma.membership.count({ where }),
    prisma.membership.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { expiryDate: 'asc' },
      include: { user: true }
    })
  ]);

  return {
    items: items.map(formatMembership),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1
    }
  };
}

/**
 * Service: Update Membership Status (Admin Review)
 * Cannot activate an unpaid membership.
 */
async function updateMembershipStatus(id, { status }, prisma = defaultPrisma) {
  const membership = await prisma.membership.findUnique({
    where: { id },
    include: { user: true }
  });

  if (!membership) {
    const err = new Error(`Membership with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  const normalizedStatus = status.toUpperCase();
  if (!['ACTIVE', 'REJECTED', 'EXPIRED'].includes(normalizedStatus)) {
    const err = new Error('Invalid status. Allowed: ACTIVE, REJECTED, EXPIRED');
    err.statusCode = 400;
    throw err;
  }

  if (normalizedStatus === 'ACTIVE') {
    // Check payment confirmation
    if (Number(membership.amountPaid) <= 0) {
      const err = new Error('Cannot activate an unpaid membership. Confirm payment first via /api/payments/mock-confirm.');
      err.statusCode = 422;
      throw err;
    }
  }

  const updateData = { status: normalizedStatus };
  if (normalizedStatus === 'ACTIVE') {
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(startDate.getFullYear() + (membership.durationYears || 1));
    updateData.startDate = startDate;
    updateData.expiryDate = expiryDate;
  }

  const updated = await prisma.membership.update({
    where: { id },
    data: updateData,
    include: { user: true }
  });

  return formatMembership(updated);
}

module.exports = {
  ANNUAL_FEE,
  formatMembership,
  getCurrentUserMembership,
  applyMembership,
  listMemberships,
  getMembershipById,
  listExpiringMemberships,
  updateMembershipStatus
};
