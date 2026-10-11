const defaultPrisma = require('../lib/prisma');
const { formatMembership } = require('./memberships.service');
const { formatTask } = require('./tasks.service');
const { formatAnnouncement } = require('./announcements.service');

/**
 * Service: Admin Dashboard Summary
 */
async function getAdminDashboard(prisma = defaultPrisma) {
  const now = new Date();
  const renewalThreshold = new Date();
  renewalThreshold.setDate(now.getDate() + 30);

  const [
    totalUsers,
    activeMemberships,
    pendingRenewals,
    upcomingEvents,
    allEvents,
    volunteersCount,
    openTasksCount,
    completedTasksCount,
    lowStockCount,
    transactions,
    pendingReimbursementsCount,
    recentAnnouncements
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'MEMBER' } }),
    prisma.membership.count({ where: { status: 'ACTIVE', expiryDate: { gt: now } } }),
    prisma.membership.count({
      where: {
        status: 'ACTIVE',
        expiryDate: { gte: now, lte: renewalThreshold }
      }
    }),
    prisma.event.count({ where: { date: { gte: now } } }),
    prisma.event.findMany({
      include: {
        tickets: {
          where: { status: { in: ['PAID', 'CHECKED_IN'] } }
        }
      }
    }),
    prisma.user.count({ where: { isVolunteer: true } }),
    prisma.volunteerTask.count({ where: { assigneeId: null, status: 'PENDING' } }),
    prisma.volunteerTask.count({ where: { status: 'COMPLETED' } }),
    prisma.productVariant.count({ where: { stockQuantity: { lte: 5 } } }),
    prisma.transaction.findMany(),
    prisma.reimbursement.count({ where: { status: 'PENDING' } }),
    prisma.announcement.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { publishedBy: true }
    })
  ]);

  let totalTicketsSold = 0;
  let totalCapacity = 0;
  let totalCheckedIn = 0;

  for (const ev of allEvents) {
    totalCapacity += ev.capacity;
    const sold = ev.tickets.length;
    totalTicketsSold += sold;
    const checked = ev.tickets.filter((t) => t.status === 'CHECKED_IN').length;
    totalCheckedIn += checked;
  }

  const avgAttendance = totalTicketsSold > 0
    ? `${((totalCheckedIn / totalTicketsSold) * 100).toFixed(1)}%`
    : '0.0%';

  let totalIncome = 0;
  let totalExpense = 0;
  for (const t of transactions) {
    const amt = Number(t.amount || 0);
    if (t.type === 'INCOME') totalIncome += amt;
    else if (t.type === 'EXPENSE') totalExpense += amt;
  }

  return {
    members: {
      totalRegistered: totalUsers,
      activeCount: activeMemberships,
      pendingRenewalCount: pendingRenewals
    },
    events: {
      upcomingCount: upcomingEvents,
      totalTicketsSold,
      totalSeatsRemaining: Math.max(0, totalCapacity - totalTicketsSold),
      averageAttendanceRate: avgAttendance
    },
    volunteers: {
      totalVolunteers: volunteersCount,
      openTasksCount,
      completedTasksCount
    },
    inventory: {
      lowStockAlertsCount: lowStockCount
    },
    finances: {
      totalIncome: totalIncome.toFixed(2),
      totalExpense: totalExpense.toFixed(2),
      currentBalance: (totalIncome - totalExpense).toFixed(2),
      pendingReimbursementsCount
    },
    recentAnnouncements: recentAnnouncements.map(formatAnnouncement)
  };
}

/**
 * Service: Volunteer Dashboard Summary
 */
async function getVolunteerDashboard(userId, prisma = defaultPrisma) {
  const [assignedTasks, reimbursements] = await Promise.all([
    prisma.volunteerTask.findMany({
      where: { assigneeId: userId },
      orderBy: { createdAt: 'desc' },
      include: { event: true }
    }),
    prisma.reimbursement.findMany({
      where: { applicantId: userId }
    })
  ]);

  const pendingCount = reimbursements.filter((r) => r.status === 'PENDING').length;
  const approvedTotal = reimbursements
    .filter((r) => r.status === 'APPROVED' || r.status === 'PAID')
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  return {
    assignedTasks: assignedTasks.map(formatTask),
    canCheckInTickets: true,
    reimbursementsSummary: {
      pendingCount,
      totalApproved: approvedTotal.toFixed(2)
    }
  };
}

/**
 * Service: Member Dashboard Summary
 */
async function getMemberDashboard(userId, prisma = defaultPrisma) {
  const [membership, tickets, orders, announcements] = await Promise.all([
    prisma.membership.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { event: true }
    }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.announcement.findMany({
      where: { audience: { in: ['ALL', 'MEMBERS'] } },
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return {
    membership: formatMembership(membership),
    myTickets: tickets.map((t) => ({
      ticketId: t.id,
      eventTitle: t.event?.title || 'Event',
      ticketCode: t.ticketCode,
      status: t.status,
      date: t.event?.date ? t.event.date.toISOString() : undefined
    })),
    activeOrders: orders.map((o) => ({
      orderId: o.id,
      totalAmount: Number(o.totalAmount || 0).toFixed(2),
      status: o.status
    })),
    recentAnnouncements: announcements.map(formatAnnouncement)
  };
}

module.exports = {
  getAdminDashboard,
  getVolunteerDashboard,
  getMemberDashboard
};
