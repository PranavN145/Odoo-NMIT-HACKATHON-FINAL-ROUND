const defaultPrisma = require('../lib/prisma');
const { ANNUAL_FEE, formatMembership } = require('./memberships.service');
const { formatTicket } = require('./tickets.service');

/**
 * Service: Mock Payment Confirmation (Demo / Hackathon)
 * Atomically updates resource and records financial income transaction
 */
async function mockConfirmPayment({ resourceType, resourceId }, user, prisma = defaultPrisma) {
  if (!resourceType || !resourceId) {
    const err = new Error('resourceType and resourceId are required');
    err.statusCode = 400;
    throw err;
  }

  const normalizedType = resourceType.toUpperCase();
  if (!['TICKET', 'ORDER', 'MEMBERSHIP'].includes(normalizedType)) {
    const err = new Error('resourceType must be one of: TICKET, ORDER, MEMBERSHIP');
    err.statusCode = 400;
    throw err;
  }

  return await prisma.$transaction(async (tx) => {
    if (normalizedType === 'TICKET') {
      const ticket = await tx.ticket.findUnique({
        where: { id: resourceId },
        include: { event: true, user: true }
      });

      if (!ticket) {
        const err = new Error(`Ticket with ID '${resourceId}' not found`);
        err.statusCode = 404;
        throw err;
      }

      // Owner verification (or Admin)
      if (user.role !== 'ADMIN' && ticket.userId !== user.id) {
        const err = new Error('Access forbidden: You cannot confirm payment for another user\'s ticket');
        err.statusCode = 403;
        throw err;
      }

      if (ticket.status === 'PAID' || ticket.status === 'CHECKED_IN') {
        return {
          status: 'ok',
          message: 'Payment already confirmed for this ticket',
          data: formatTicket(ticket)
        };
      }

      if (ticket.status !== 'RESERVED') {
        const err = new Error(`Cannot confirm payment for ticket with status '${ticket.status}'`);
        err.statusCode = 409;
        throw err;
      }

      // Update ticket to PAID
      const updatedTicket = await tx.ticket.update({
        where: { id: ticket.id },
        data: { status: 'PAID' },
        include: { event: true, user: true }
      });

      // Record financial income transaction
      const idempotencyKey = `PAY-TICKET-${ticket.id}`;
      const existingTx = await tx.transaction.findUnique({ where: { idempotencyKey } });
      if (!existingTx) {
        await tx.transaction.create({
          data: {
            idempotencyKey,
            type: 'INCOME',
            category: 'TICKET_SALE',
            amount: ticket.pricePaid,
            description: `Ticket purchase for ${ticket.event?.title || 'Event'} (${ticket.ticketCode})`,
            recordedById: user.id,
            ticketId: ticket.id
          }
        });
      }

      return {
        status: 'ok',
        message: 'Payment confirmed and ticket marked as PAID',
        data: formatTicket(updatedTicket)
      };
    }

    if (normalizedType === 'ORDER') {
      const order = await tx.order.findUnique({
        where: { id: resourceId },
        include: { orderItems: { include: { variant: true } }, user: true }
      });

      if (!order) {
        const err = new Error(`Order with ID '${resourceId}' not found`);
        err.statusCode = 404;
        throw err;
      }

      if (user.role !== 'ADMIN' && order.userId !== user.id) {
        const err = new Error('Access forbidden: You cannot confirm payment for another user\'s order');
        err.statusCode = 403;
        throw err;
      }

      if (order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED') {
        return {
          status: 'ok',
          message: 'Payment already confirmed for this order',
          data: order
        };
      }

      if (order.status !== 'PENDING') {
        const err = new Error(`Cannot confirm payment for order with status '${order.status}'`);
        err.statusCode = 409;
        throw err;
      }

      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { status: 'PAID' }
      });

      const idempotencyKey = `PAY-ORDER-${order.id}`;
      const existingTx = await tx.transaction.findUnique({ where: { idempotencyKey } });
      if (!existingTx) {
        await tx.transaction.create({
          data: {
            idempotencyKey,
            type: 'INCOME',
            category: 'MERCHANDISE_SALE',
            amount: order.totalAmount,
            description: `Merchandise order #${order.id} payment confirmed`,
            recordedById: user.id,
            orderId: order.id
          }
        });
      }

      return {
        status: 'ok',
        message: 'Payment confirmed and order marked as PAID',
        data: updatedOrder
      };
    }

    if (normalizedType === 'MEMBERSHIP') {
      const membership = await tx.membership.findUnique({
        where: { id: resourceId },
        include: { user: true }
      });

      if (!membership) {
        const err = new Error(`Membership with ID '${resourceId}' not found`);
        err.statusCode = 404;
        throw err;
      }

      if (user.role !== 'ADMIN' && membership.userId !== user.id) {
        const err = new Error('Access forbidden: You cannot confirm payment for another user\'s membership');
        err.statusCode = 403;
        throw err;
      }

      const calculatedFee = ANNUAL_FEE * (membership.durationYears || 1);

      if (Number(membership.amountPaid) > 0) {
        return {
          status: 'ok',
          message: 'Membership fee already paid',
          data: formatMembership(membership)
        };
      }

      const updatedMembership = await tx.membership.update({
        where: { id: membership.id },
        data: { amountPaid: calculatedFee }
      });

      const idempotencyKey = `PAY-MEMBERSHIP-${membership.id}`;
      const existingTx = await tx.transaction.findUnique({ where: { idempotencyKey } });
      if (!existingTx) {
        await tx.transaction.create({
          data: {
            idempotencyKey,
            type: 'INCOME',
            category: 'MEMBERSHIP_DUE',
            amount: calculatedFee,
            description: `Membership dues payment (${membership.durationYears} year) for ${membership.user?.name}`,
            recordedById: user.id,
            membershipId: membership.id
          }
        });
      }

      return {
        status: 'ok',
        message: 'Membership payment confirmed. Application remains PENDING until admin activation.',
        data: formatMembership(updatedMembership)
      };
    }
  });
}

module.exports = {
  mockConfirmPayment
};
