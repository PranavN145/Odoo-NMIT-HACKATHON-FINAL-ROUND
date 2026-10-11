const defaultPrisma = require('../lib/prisma');

function formatReimbursement(r) {
  if (!r) return null;
  return {
    id: r.id,
    applicantId: r.applicantId,
    applicant: r.applicant ? {
      id: r.applicant.id,
      name: r.applicant.name,
      email: r.applicant.email
    } : undefined,
    amount: Number(r.amount || 0).toFixed(2),
    reason: r.reason,
    receiptUrl: r.receiptUrl || null,
    status: r.status,
    approvedById: r.approvedById || null,
    approvedBy: r.approvedBy ? {
      id: r.approvedBy.id,
      name: r.approvedBy.name
    } : undefined,
    createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString()
  };
}

/**
 * Service: Submit reimbursement claim
 */
async function submitReimbursement(userId, { amount, reason, receiptUrl }, prisma = defaultPrisma) {
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    const err = new Error('Amount must be a positive number');
    err.statusCode = 400;
    throw err;
  }

  if (!reason || reason.trim().length < 3) {
    const err = new Error('Reason must be at least 3 characters');
    err.statusCode = 400;
    throw err;
  }

  const claim = await prisma.reimbursement.create({
    data: {
      applicantId: userId,
      amount: parsedAmount,
      reason: reason.trim(),
      receiptUrl: receiptUrl ? receiptUrl.trim() : null,
      status: 'PENDING'
    },
    include: { applicant: true }
  });

  return formatReimbursement(claim);
}

/**
 * Service: Get member's own claims
 */
async function getUserReimbursements(userId, prisma = defaultPrisma) {
  const claims = await prisma.reimbursement.findMany({
    where: { applicantId: userId },
    orderBy: { createdAt: 'desc' }
  });

  return claims.map(formatReimbursement);
}

/**
 * Service: List all reimbursements (Admin)
 */
async function listReimbursements({ status, page = 1, limit = 20 }, prisma = defaultPrisma) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const where = {};
  if (status) where.status = status.toUpperCase();

  const [total, claims] = await Promise.all([
    prisma.reimbursement.count({ where }),
    prisma.reimbursement.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: { applicant: true, approvedBy: true }
    })
  ]);

  return {
    items: claims.map(formatReimbursement),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1
    }
  };
}

/**
 * Service: Review reimbursement status (Admin)
 * Applicant cannot review own claim. Transition to PAID creates EXPENSE transaction.
 */
async function updateReimbursementStatus(id, { status }, adminId, prisma = defaultPrisma) {
  return await prisma.$transaction(async (tx) => {
    const claim = await tx.reimbursement.findUnique({
      where: { id },
      include: { applicant: true }
    });

    if (!claim) {
      const err = new Error(`Reimbursement with ID '${id}' not found`);
      err.statusCode = 404;
      throw err;
    }

    // Invariant: Applicant cannot approve their own claim
    if (claim.applicantId === adminId) {
      const err = new Error('Access forbidden: You cannot review or approve your own reimbursement claim');
      err.statusCode = 403;
      throw err;
    }

    const normalizedStatus = status.toUpperCase();
    if (!['APPROVED', 'REJECTED', 'PAID'].includes(normalizedStatus)) {
      const err = new Error('Invalid status. Allowed: APPROVED, REJECTED, PAID');
      err.statusCode = 400;
      throw err;
    }

    if (normalizedStatus === 'PAID' && claim.status !== 'APPROVED') {
      const err = new Error('Only an APPROVED claim may transition to PAID');
      err.statusCode = 422;
      throw err;
    }

    const updated = await tx.reimbursement.update({
      where: { id },
      data: {
        status: normalizedStatus,
        approvedById: adminId
      },
      include: { applicant: true, approvedBy: true }
    });

    // On transition to PAID, record financial expense transaction
    if (normalizedStatus === 'PAID') {
      const idempotencyKey = `REIMB-${claim.id}`;
      const existingTx = await tx.transaction.findUnique({ where: { idempotencyKey } });
      if (!existingTx) {
        await tx.transaction.create({
          data: {
            idempotencyKey,
            type: 'EXPENSE',
            category: 'REIMBURSEMENT',
            amount: claim.amount,
            description: `Reimbursement payout to ${claim.applicant?.name}: ${claim.reason}`,
            recordedById: adminId,
            reimbursementId: claim.id
          }
        });
      }
    }

    return formatReimbursement(updated);
  });
}

module.exports = {
  formatReimbursement,
  submitReimbursement,
  getUserReimbursements,
  listReimbursements,
  updateReimbursementStatus
};
