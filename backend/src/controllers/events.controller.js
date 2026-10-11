const eventsService = require('../services/events.service');
const ticketsService = require('../services/tickets.service');

const listEvents = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { upcoming, page, limit } = req.query;
    const result = await eventsService.listEvents({
      upcoming,
      page,
      limit,
      user: req.user
    }, prisma);

    return res.status(200).json({
      status: 'ok',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const event = await eventsService.getEventById(req.params.id, req.user, prisma);
    return res.status(200).json({
      status: 'ok',
      data: event
    });
  } catch (err) {
    next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const created = await eventsService.createEvent(req.body, prisma);
    return res.status(201).json({
      status: 'ok',
      message: 'Event created successfully',
      data: created
    });
  } catch (err) {
    next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const updated = await eventsService.updateEvent(req.params.id, req.body, prisma);
    return res.status(200).json({
      status: 'ok',
      message: 'Event updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const result = await eventsService.deleteEvent(req.params.id, prisma);
    return res.status(200).json({
      status: 'ok',
      message: result.message
    });
  } catch (err) {
    next(err);
  }
};

const getAttendance = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const summary = await eventsService.getEventAttendanceSummary(req.params.id, prisma);
    return res.status(200).json({
      status: 'ok',
      data: summary
    });
  } catch (err) {
    next(err);
  }
};

const bookTicket = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { name, email, phone, participantType, amountPaid, paymentMethod, paymentId } = req.body || {};

    const guestData = (name || email) ? { name, email, phone, participantType } : null;
    const ticket = await ticketsService.bookTicket(req.params.id, req.user, guestData, prisma);

    // If request submitted from public registration with direct payment metadata:
    return res.status(201).json({
      status: 'ok',
      message: 'Ticket reserved; payment is pending',
      data: {
        ticket,
        ticketCode: ticket.ticketCode,
        paymentId: paymentId || `PAY-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        amountPaid: ticket.pricePaid
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getAttendance,
  bookTicket
};
