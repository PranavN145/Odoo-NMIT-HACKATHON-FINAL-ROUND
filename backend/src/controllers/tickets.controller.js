const ticketsService = require('../services/tickets.service');

const getMyTickets = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const tickets = await ticketsService.getUserTickets(req.user.id, prisma);
    return res.status(200).json({
      status: 'ok',
      data: tickets
    });
  } catch (err) {
    next(err);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const ticket = await ticketsService.getTicketById(req.params.id, req.user, prisma);
    return res.status(200).json({
      status: 'ok',
      data: ticket
    });
  } catch (err) {
    next(err);
  }
};

const cancelTicket = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const cancelled = await ticketsService.cancelTicket(req.params.id, req.user, prisma);
    return res.status(200).json({
      status: 'ok',
      message: 'Ticket cancelled successfully',
      data: cancelled
    });
  } catch (err) {
    next(err);
  }
};

const checkInTicket = async (req, res, next) => {
  try {
    const prisma = req.app?.get('prisma');
    const { ticketCode } = req.body;
    const result = await ticketsService.checkInTicket(ticketCode, prisma);
    return res.status(200).json({
      status: 'ok',
      message: 'Check-in successful',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyTickets,
  getTicketById,
  cancelTicket,
  checkInTicket
};
