const defaultPrisma = require('../lib/prisma');

function formatTransaction(t) {
  if (!t) return null;
  return {
    id: t.id,
    idempotencyKey: t.idempotencyKey,
    type: t.type,
    category: t.category,
    amount: Number(t.amount || 0).toFixed(2),
    description: t.description,
    recordedById: t.recordedById,
    recordedBy: t.recordedBy ? {
      id: t.recordedBy.id,
      name: t.recordedBy.name
    } : undefined,
    orderId: t.orderId || null,
    ticketId: t.ticketId || null,
    membershipId: t.membershipId || null,
    reimbursementId: t.reimbursementId || null,
    createdAt: t.createdAt ? t.createdAt.toISOString() : new Date().toISOString()
  };
}

/**
 * Service: Financial summary and balance
 */
async function getFinanceSummary(prisma = defaultPrisma) {
  const transactions = await prisma.transaction.findMany();

  let totalIncome = 0;
  let totalExpense = 0;
  const breakdown = {
    MEMBERSHIP_DUE: 0,
    TICKET_SALE: 0,
    MERCHANDISE_SALE: 0,
    EVENT_EXPENSE: 0,
    REIMBURSEMENT: 0,
    OTHER: 0
  };

  for (const t of transactions) {
    const amt = Number(t.amount || 0);
    if (t.type === 'INCOME') {
      totalIncome += amt;
    } else if (t.type === 'EXPENSE') {
      totalExpense += amt;
    }

    if (breakdown[t.category] !== undefined) {
      breakdown[t.category] += amt;
    } else {
      breakdown.OTHER += amt;
    }
  }

  const breakdownFormatted = {};
  for (const [key, val] of Object.entries(breakdown)) {
    breakdownFormatted[key] = val.toFixed(2);
  }

  return {
    totalIncome: totalIncome.toFixed(2),
    totalExpense: totalExpense.toFixed(2),
    currentBalance: (totalIncome - totalExpense).toFixed(2),
    breakdownByCategory: breakdownFormatted
  };
}

/**
 * Service: List transactions
 */
async function listTransactions({ type, category, page = 1, limit = 20 }, prisma = defaultPrisma) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const where = {};
  if (type) where.type = type.toUpperCase();
  if (category) where.category = category.toUpperCase();

  const [total, transactions] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: { recordedBy: true }
    })
  ]);

  return {
    items: transactions.map(formatTransaction),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1
    }
  };
}

/**
 * Service: Record manual transaction (Admin)
 */
async function recordManualTransaction({ type, category, amount, description }, adminId, prisma = defaultPrisma) {
  const normalizedType = type ? type.toUpperCase() : null;
  if (!['INCOME', 'EXPENSE'].includes(normalizedType)) {
    const err = new Error('Transaction type must be INCOME or EXPENSE');
    err.statusCode = 400;
    throw err;
  }

  const normalizedCategory = category ? category.toUpperCase() : 'OTHER';
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    const err = new Error('Amount must be a positive number');
    err.statusCode = 400;
    throw err;
  }

  const idempotencyKey = `MANUAL-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const created = await prisma.transaction.create({
    data: {
      idempotencyKey,
      type: normalizedType,
      category: normalizedCategory,
      amount: parsedAmount,
      description: (description || 'Manual entry').trim(),
      recordedById: adminId
    },
    include: { recordedBy: true }
  });

  return formatTransaction(created);
}

module.exports = {
  formatTransaction,
  getFinanceSummary,
  listTransactions,
  recordManualTransaction
};
