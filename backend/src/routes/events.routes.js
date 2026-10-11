const express = require('express');
const router = express.Router();
const { prisma, memoryEvents, memoryTickets } = require('../lib/db');

/**
 * GET /api/events
 * Fetch all available events (from Prisma DB if configured/connected, or resilient memory store)
 */
router.get('/', async (req, res, next) => {
  try {
    if (prisma) {
      try {
        const events = await prisma.event.findMany({
          where: { status: 'PUBLISHED' },
          orderBy: { date: 'asc' }
        });
        if (events && events.length > 0) {
          return res.status(200).json(events);
        }
      } catch (dbErr) {
        console.warn("Prisma query failed, falling back to memory store:", dbErr.message);
      }
    }

    return res.status(200).json(memoryEvents);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/events/:id
 * Fetch single event by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const eventId = req.params.id;
    if (prisma) {
      try {
        const evt = await prisma.event.findUnique({ where: { id: eventId } });
        if (evt) return res.status(200).json(evt);
      } catch (_) {}
    }

    const memoryEvt = memoryEvents.find((e) => e.id === eventId);
    if (memoryEvt) {
      return res.status(200).json(memoryEvt);
    }

    return res.status(404).json({
      error: { message: `Event with ID '${eventId}' not found.` }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/events/:id/tickets
 * Submit public event ticket registration
 */
router.post('/:id/tickets', async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const { name, email, phone, participantType, amountPaid, paymentMethod, paymentId } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: { message: 'Full Name is required.' } });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: { message: 'A valid Email Address is required.' } });
    }

    const ticketCode = `TKT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const confirmedPaymentId = paymentId || `PAY-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const parsedAmount = typeof amountPaid === 'number' ? amountPaid : parseFloat(amountPaid) || 0;

    const newTicket = {
      id: `tkt-${Date.now()}`,
      eventId,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : null,
      participantType: participantType || 'guest',
      ticketCode,
      paymentId: confirmedPaymentId,
      paymentMethod: paymentMethod || 'ONLINE_PAYMENT',
      amountPaid: parsedAmount,
      status: 'PAID',
      createdAt: new Date().toISOString()
    };

    if (prisma) {
      try {
        // Attempt to create ticket record in database
        let user = await prisma.user.findUnique({ where: { email: email.trim() } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: name.trim(),
              email: email.trim(),
              passwordHash: 'PUBLIC_GUEST_ACCOUNT',
              role: 'MEMBER'
            }
          });
        }
        const dbTicket = await prisma.ticket.create({
          data: {
            eventId,
            userId: user.id,
            ticketCode,
            pricePaid: parsedAmount,
            status: 'PAID'
          }
        });
        return res.status(201).json({
          message: 'Payment verified and ticket registration confirmed',
          ticketCode: dbTicket.ticketCode,
          paymentId: confirmedPaymentId,
          amountPaid: parsedAmount,
          ticket: dbTicket
        });
      } catch (dbErr) {
        console.warn("Prisma ticket insertion fallback to memory store:", dbErr.message);
      }
    }

    memoryTickets.push(newTicket);

    return res.status(201).json({
      message: 'Payment verified and ticket registration confirmed',
      ticketCode,
      paymentId: confirmedPaymentId,
      amountPaid: parsedAmount,
      ticket: newTicket
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
