const defaultPrisma = require('../lib/prisma');

function formatEvent(e, user = null, activeMembership = false) {
  if (!e) return null;

  const ticketsSold = e.tickets ? e.tickets.filter((t) => t.status === 'PAID' || t.status === 'CHECKED_IN').length : (e._count?.tickets || 0);
  const seatsRemaining = Math.max(0, e.capacity - ticketsSold);
  const standardPriceStr = Number(e.standardPrice || 0).toFixed(2);
  const memberPriceStr = Number(e.memberPrice || 0).toFixed(2);

  const isMemberDiscount = Boolean(activeMembership);
  const effectivePrice = isMemberDiscount ? memberPriceStr : standardPriceStr;

  return {
    id: e.id,
    title: e.title,
    description: e.description,
    date: e.date instanceof Date ? e.date.toISOString() : new Date(e.date).toISOString(),
    venue: e.venue,
    capacity: e.capacity,
    ticketsSold,
    seatsRemaining,
    standardPrice: standardPriceStr,
    memberPrice: memberPriceStr,
    effectivePrice,
    isMemberDiscountApplied: isMemberDiscount,
    createdAt: e.createdAt ? (e.createdAt instanceof Date ? e.createdAt.toISOString() : new Date(e.createdAt).toISOString()) : undefined
  };
}

/**
 * Helper to check whether user has an active membership
 */
async function checkUserActiveMembership(userId, prisma = defaultPrisma) {
  if (!userId) return false;
  const activeMem = await prisma.membership.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
      expiryDate: { gt: new Date() }
    }
  });
  return Boolean(activeMem);
}

/**
 * Service: List events
 */
async function listEvents({ upcoming, page = 1, limit = 20, user = null }, prisma = defaultPrisma) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const where = {};
  if (upcoming === 'true' || upcoming === true) {
    where.date = { gte: new Date() };
  } else if (upcoming === 'false' || upcoming === false) {
    where.date = { lt: new Date() };
  }

  const hasActiveMembership = user ? await checkUserActiveMembership(user.id, prisma) : false;

  const [total, events] = await Promise.all([
    prisma.event.count({ where }),
    prisma.event.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { date: 'asc' },
      include: {
        tickets: {
          where: { status: { in: ['PAID', 'CHECKED_IN'] } },
          select: { id: true, status: true }
        }
      }
    })
  ]);

  return {
    items: events.map((e) => formatEvent(e, user, hasActiveMembership)),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1
    }
  };
}

/**
 * Service: Get single event
 */
async function getEventById(id, user = null, prisma = defaultPrisma) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      tickets: {
        where: { status: { in: ['PAID', 'CHECKED_IN'] } },
        select: { id: true, status: true }
      }
    }
  });

  if (!event) {
    const err = new Error(`Event with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  const hasActiveMembership = user ? await checkUserActiveMembership(user.id, prisma) : false;
  return formatEvent(event, user, hasActiveMembership);
}

/**
 * Service: Create event (Admin)
 */
async function createEvent(data, prisma = defaultPrisma) {
  const { title, description, date, venue, capacity, memberPrice, standardPrice } = data;

  if (!title || title.trim().length < 2) {
    const err = new Error('Title must be at least 2 characters');
    err.statusCode = 400;
    throw err;
  }
  if (!date || isNaN(new Date(date).getTime())) {
    const err = new Error('A valid event date is required');
    err.statusCode = 400;
    throw err;
  }
  const eventDate = new Date(date);
  const cap = parseInt(capacity, 10);
  if (isNaN(cap) || cap <= 0) {
    const err = new Error('Capacity must be a positive integer');
    err.statusCode = 400;
    throw err;
  }
  const mPrice = parseFloat(memberPrice);
  const sPrice = parseFloat(standardPrice);
  if (isNaN(mPrice) || mPrice < 0 || isNaN(sPrice) || sPrice < 0) {
    const err = new Error('Prices must be non-negative numbers');
    err.statusCode = 400;
    throw err;
  }

  const created = await prisma.event.create({
    data: {
      title: title.trim(),
      description: (description || '').trim(),
      date: eventDate,
      venue: (venue || 'Campus Auditorium').trim(),
      capacity: cap,
      memberPrice: mPrice,
      standardPrice: sPrice
    }
  });

  return formatEvent(created);
}

/**
 * Service: Update event (Admin)
 */
async function updateEvent(id, data, prisma = defaultPrisma) {
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error(`Event with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.description !== undefined) updateData.description = data.description.trim();
  if (data.date !== undefined) updateData.date = new Date(data.date);
  if (data.venue !== undefined) updateData.venue = data.venue.trim();
  if (data.capacity !== undefined) updateData.capacity = parseInt(data.capacity, 10);
  if (data.memberPrice !== undefined) updateData.memberPrice = parseFloat(data.memberPrice);
  if (data.standardPrice !== undefined) updateData.standardPrice = parseFloat(data.standardPrice);

  const updated = await prisma.event.update({
    where: { id },
    data: updateData
  });

  return formatEvent(updated);
}

/**
 * Service: Delete event (Admin)
 */
async function deleteEvent(id, prisma = defaultPrisma) {
  const existing = await prisma.event.findUnique({
    where: { id },
    include: {
      tickets: {
        where: { status: { in: ['PAID', 'CHECKED_IN'] } }
      }
    }
  });

  if (!existing) {
    const err = new Error(`Event with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  if (existing.tickets && existing.tickets.length > 0) {
    const err = new Error('Cannot delete event with existing paid tickets. Cancel or refund tickets first to protect financial records.');
    err.statusCode = 409;
    throw err;
  }

  await prisma.event.delete({ where: { id } });
  return { message: 'Event deleted successfully' };
}

/**
 * Service: Event Attendance and Revenue Summary (Admin)
 */
async function getEventAttendanceSummary(id, prisma = defaultPrisma) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: { tickets: true }
  });

  if (!event) {
    const err = new Error(`Event with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  const paidTickets = event.tickets.filter((t) => t.status === 'PAID' || t.status === 'CHECKED_IN');
  const checkedInCount = event.tickets.filter((t) => t.status === 'CHECKED_IN').length;
  const totalRevenueNum = paidTickets.reduce((acc, t) => acc + Number(t.pricePaid || 0), 0);
  const attendanceRate = paidTickets.length > 0
    ? `${((checkedInCount / paidTickets.length) * 100).toFixed(1)}%`
    : '0.0%';

  return {
    eventId: event.id,
    capacity: event.capacity,
    totalTicketsSold: paidTickets.length,
    totalCheckedIn: checkedInCount,
    attendanceRate,
    totalRevenue: totalRevenueNum.toFixed(2)
  };
}

module.exports = {
  formatEvent,
  checkUserActiveMembership,
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAttendanceSummary
};
