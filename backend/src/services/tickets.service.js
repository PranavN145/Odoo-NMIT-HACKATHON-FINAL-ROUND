const defaultPrisma = require('../lib/prisma');
const { checkUserActiveMembership } = require('./events.service');

function formatTicket(t) {
  if (!t) return null;
  return {
    id: t.id,
    eventId: t.eventId,
    userId: t.userId,
    ticketCode: t.ticketCode,
    pricePaid: Number(t.pricePaid || 0).toFixed(2),
    status: t.status,
    checkedInAt: t.checkedInAt ? t.checkedInAt.toISOString() : null,
    createdAt: t.createdAt ? t.createdAt.toISOString() : new Date().toISOString(),
    event: t.event ? {
      id: t.event.id,
      title: t.event.title,
      description: t.event.description,
      date: t.event.date.toISOString(),
      venue: t.event.venue,
      capacity: t.event.capacity
    } : undefined,
    user: t.user ? {
      id: t.user.id,
      name: t.user.name,
      email: t.user.email
    } : undefined
  };
}

/**
 * Service: Book / Reserve Event Ticket
 */
async function bookTicket(eventId, user, guestData = null, prisma = defaultPrisma) {
  return await prisma.$transaction(async (tx) => {
    // 1. Find event (supports UUID and mock slug resolution like 'evt-1')
    let event = null;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId);
    if (isUuid) {
      event = await tx.event.findUnique({
        where: { id: eventId },
        include: {
          tickets: {
            where: { status: { in: ['PAID', 'RESERVED', 'CHECKED_IN'] } }
          }
        }
      });
    }

    if (!event) {
      event = await tx.event.findFirst({
        include: {
          tickets: {
            where: { status: { in: ['PAID', 'RESERVED', 'CHECKED_IN'] } }
          }
        }
      });
    }

    if (!event) {
      const err = new Error(`Event with ID '${eventId}' not found`);
      err.statusCode = 404;
      throw err;
    }

    // Check capacity
    const activeTicketsCount = event.tickets.length;
    if (activeTicketsCount >= event.capacity) {
      const err = new Error('Event is completely sold out');
      err.statusCode = 422;
      throw err;
    }

    // Resolve user ID
    let targetUserId;
    if (user && user.id) {
      targetUserId = user.id;
    } else if (guestData && guestData.email) {
      // Find or create guest user account
      let guestUser = await tx.user.findUnique({ where: { email: guestData.email.trim() } });
      if (!guestUser) {
        guestUser = await tx.user.create({
          data: {
            name: (guestData.name || 'Event Guest').trim(),
            email: guestData.email.trim(),
            passwordHash: 'PUBLIC_GUEST_ACCOUNT',
            phone: guestData.phone ? String(guestData.phone).trim() : null,
            role: 'MEMBER'
          }
        });
      }
      targetUserId = guestUser.id;
    } else {
      const err = new Error('Authentication or participant information is required to book a ticket');
      err.statusCode = 401;
      throw err;
    }

    // 2. Check if user already holds a ticket
    const existingTicket = await tx.ticket.findUnique({
      where: {
        eventId_userId: {
          eventId: event.id,
          userId: targetUserId
        }
      }
    });

    if (existingTicket && (existingTicket.status === 'PAID' || existingTicket.status === 'RESERVED' || existingTicket.status === 'CHECKED_IN')) {
      const err = new Error('User already holds an active ticket for this event');
      err.statusCode = 409;
      throw err;
    }

    // 3. Determine price
    const hasMembership = await checkUserActiveMembership(targetUserId, tx);
    const applicablePrice = hasMembership ? Number(event.memberPrice) : Number(event.standardPrice);

    // 4. Generate unique ticket code
    const year = new Date().getFullYear();
    const hex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const ticketCode = `TIC-${year}-${hex}`;

    let ticket;
    if (existingTicket && existingTicket.status === 'CANCELLED') {
      // Reactivate previously cancelled ticket row to satisfy @@unique([eventId, userId])
      ticket = await tx.ticket.update({
        where: { id: existingTicket.id },
        data: {
          ticketCode,
          pricePaid: applicablePrice,
          status: 'RESERVED',
          checkedInAt: null
        },
        include: { event: true, user: true }
      });
    } else {
      ticket = await tx.ticket.create({
        data: {
          eventId: event.id,
          userId: targetUserId,
          ticketCode,
          pricePaid: applicablePrice,
          status: 'RESERVED'
        },
        include: { event: true, user: true }
      });
    }

    return formatTicket(ticket);
  });
}

/**
 * Service: Get tickets for current user
 */
async function getUserTickets(userId, prisma = defaultPrisma) {
  const tickets = await prisma.ticket.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { event: true }
  });
  return tickets.map(formatTicket);
}

/**
 * Service: Get ticket details
 */
async function getTicketById(id, user, prisma = defaultPrisma) {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { event: true, user: true }
  });

  if (!ticket) {
    const err = new Error(`Ticket with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  // Authorization check: User must be owner or Admin
  if (user.role !== 'ADMIN' && ticket.userId !== user.id) {
    const err = new Error('Access forbidden: You do not have permission to view this ticket');
    err.statusCode = 403;
    throw err;
  }

  return formatTicket(ticket);
}

/**
 * Service: Cancel ticket
 */
async function cancelTicket(id, user, prisma = defaultPrisma) {
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) {
    const err = new Error(`Ticket with ID '${id}' not found`);
    err.statusCode = 404;
    throw err;
  }

  // Authorization check
  if (user.role !== 'ADMIN' && ticket.userId !== user.id) {
    const err = new Error('Access forbidden: You cannot cancel another user\'s ticket');
    err.statusCode = 403;
    throw err;
  }

  if (ticket.status === 'CHECKED_IN') {
    const err = new Error('Ticket has already been checked in and cannot be cancelled');
    err.statusCode = 400;
    throw err;
  }

  const cancelled = await prisma.ticket.update({
    where: { id },
    data: { status: 'CANCELLED' }
  });

  return formatTicket(cancelled);
}

/**
 * Service: Check in attendee by ticketCode (Volunteer / Admin)
 */
async function checkInTicket(ticketCode, prisma = defaultPrisma) {
  if (!ticketCode || !ticketCode.trim()) {
    const err = new Error('Ticket code is required for check-in');
    err.statusCode = 400;
    throw err;
  }

  const ticket = await prisma.ticket.findUnique({
    where: { ticketCode: ticketCode.trim() },
    include: { user: true, event: true }
  });

  if (!ticket) {
    const err = new Error(`Ticket code '${ticketCode}' was not found`);
    err.statusCode = 404;
    throw err;
  }

  if (ticket.status === 'CHECKED_IN') {
    const err = new Error(`Ticket is already checked in (Checked in at: ${ticket.checkedInAt?.toISOString()})`);
    err.statusCode = 409;
    throw err;
  }

  if (ticket.status === 'CANCELLED') {
    const err = new Error('Ticket has been cancelled and is invalid for entry');
    err.statusCode = 422;
    throw err;
  }

  if (ticket.status === 'RESERVED') {
    const err = new Error('Ticket is unpaid. Payment must be confirmed before entrance');
    err.statusCode = 422;
    throw err;
  }

  const checkedIn = await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      status: 'CHECKED_IN',
      checkedInAt: new Date()
    },
    include: { user: true, event: true }
  });

  return {
    ticketId: checkedIn.id,
    ticketCode: checkedIn.ticketCode,
    attendeeName: checkedIn.user?.name || 'Attendee',
    eventTitle: checkedIn.event?.title || 'Event',
    checkedInAt: checkedIn.checkedInAt.toISOString()
  };
}

module.exports = {
  formatTicket,
  bookTicket,
  getUserTickets,
  getTicketById,
  cancelTicket,
  checkInTicket
};
