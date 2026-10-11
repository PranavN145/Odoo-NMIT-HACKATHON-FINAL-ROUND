process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_integration_tests';
require('dotenv').config();

const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const prisma = require('../src/lib/prisma');

test('Comprehensive Student Organization System API Integration Suite', async (t) => {
  let server;
  let baseUrl;
  let adminToken;
  let adminUser;
  let memberToken;
  let memberUser;
  let volunteerToken;
  let volunteerUser;

  // Start server on free ephemeral port
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });

  t.after(async () => {
    server.close();
    // Do NOT delete production data, but clean up our specific test users
    try {
      if (adminUser?.id) await prisma.user.delete({ where: { id: adminUser.id } }).catch(() => {});
      if (memberUser?.id) await prisma.user.delete({ where: { id: memberUser.id } }).catch(() => {});
      if (volunteerUser?.id) await prisma.user.delete({ where: { id: volunteerUser.id } }).catch(() => {});
    } catch (_) {}
  });

  // Setup test accounts
  const timestamp = Date.now();
  adminUser = await prisma.user.create({
    data: {
      name: 'Integration Admin',
      email: `test.admin.${timestamp}@skyline.edu`,
      passwordHash: 'dummy_hash',
      role: 'ADMIN',
      isVolunteer: false
    }
  });
  adminToken = jwt.sign({ id: adminUser.id, email: adminUser.email, role: 'ADMIN', isVolunteer: false }, process.env.JWT_SECRET);

  memberUser = await prisma.user.create({
    data: {
      name: 'Integration Member',
      email: `test.member.${timestamp}@skyline.edu`,
      passwordHash: 'dummy_hash',
      role: 'MEMBER',
      isVolunteer: false
    }
  });
  memberToken = jwt.sign({ id: memberUser.id, email: memberUser.email, role: 'MEMBER', isVolunteer: false }, process.env.JWT_SECRET);

  volunteerUser = await prisma.user.create({
    data: {
      name: 'Integration Volunteer',
      email: `test.volunteer.${timestamp}@skyline.edu`,
      passwordHash: 'dummy_hash',
      role: 'MEMBER',
      isVolunteer: true
    }
  });
  volunteerToken = jwt.sign({ id: volunteerUser.id, email: volunteerUser.email, role: 'MEMBER', isVolunteer: true }, process.env.JWT_SECRET);

  // 1. User Profile & Role Management
  await t.test('PATCH /api/users/me updates self profile name and phone', async () => {
    const res = await fetch(`${baseUrl}/api/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberToken}`
      },
      body: JSON.stringify({ name: 'Updated Member Name', phone: '+1234567890' })
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
    assert.strictEqual(body.data.name, 'Updated Member Name');
    assert.strictEqual(body.data.phone, '+1234567890');
  });

  await t.test('PATCH /api/users/:id/role enforces admin-volunteer exclusivity invariant', async () => {
    // Attempting to set role = ADMIN forces isVolunteer = false
    const res = await fetch(`${baseUrl}/api/users/${volunteerUser.id}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ role: 'ADMIN', isVolunteer: true })
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
    assert.strictEqual(body.data.role, 'ADMIN');
    assert.strictEqual(body.data.isVolunteer, false, 'Admin cannot be volunteer');

    // Reset volunteer back to MEMBER + isVolunteer = true
    await fetch(`${baseUrl}/api/users/${volunteerUser.id}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ role: 'MEMBER', isVolunteer: true })
    });
  });

  // 2. Memberships Module
  let createdMembershipId;
  await t.test('POST /api/memberships creates pending application', async () => {
    const res = await fetch(`${baseUrl}/api/memberships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberToken}`
      },
      body: JSON.stringify({ durationYears: 1 })
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
    assert.strictEqual(body.data.status, 'PENDING');
    createdMembershipId = body.data.id;
  });

  await t.test('PATCH /api/memberships/:id/status rejects activating unpaid membership', async () => {
    const res = await fetch(`${baseUrl}/api/memberships/${createdMembershipId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'ACTIVE' })
    });
    assert.strictEqual(res.status, 422, 'Cannot activate unpaid membership');
  });

  await t.test('POST /api/payments/mock-confirm confirms membership payment and records ledger', async () => {
    const res = await fetch(`${baseUrl}/api/payments/mock-confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberToken}`
      },
      body: JSON.stringify({ resourceType: 'MEMBERSHIP', resourceId: createdMembershipId })
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
    assert.strictEqual(body.data.amountPaid, '25.00');

    // Now activation by Admin succeeds
    const actRes = await fetch(`${baseUrl}/api/memberships/${createdMembershipId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'ACTIVE' })
    });
    assert.strictEqual(actRes.status, 200);
    const actBody = await actRes.json();
    assert.strictEqual(actBody.data.status, 'ACTIVE');
  });

  // 3. Events, Tickets & Check-In
  let testEventId;
  await t.test('POST /api/events creates new event by Admin', async () => {
    const res = await fetch(`${baseUrl}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: `Integration Workshop ${timestamp}`,
        description: 'Hands on test event',
        date: new Date('2027-02-15T10:00:00.000Z').toISOString(),
        venue: 'Room 101',
        capacity: 50,
        memberPrice: 10.00,
        standardPrice: 20.00
      })
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    testEventId = body.data.id;
    assert.ok(testEventId);
  });

  let bookedTicketCode;
  let bookedTicketId;
  await t.test('POST /api/events/:id/tickets reserves ticket for member', async () => {
    const res = await fetch(`${baseUrl}/api/events/${testEventId}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberToken}`
      }
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
    bookedTicketId = body.data.ticket.id;
    bookedTicketCode = body.data.ticket.ticketCode;
    assert.strictEqual(body.data.ticket.status, 'RESERVED');
  });

  await t.test('POST /api/tickets/check-in rejects unpaid reserved ticket', async () => {
    const res = await fetch(`${baseUrl}/api/tickets/check-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${volunteerToken}`
      },
      body: JSON.stringify({ ticketCode: bookedTicketCode })
    });
    assert.strictEqual(res.status, 422, 'Unpaid ticket cannot check in');
  });

  await t.test('POST /api/payments/mock-confirm marks ticket PAID and allows volunteer check-in', async () => {
    // Confirm payment
    const payRes = await fetch(`${baseUrl}/api/payments/mock-confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberToken}`
      },
      body: JSON.stringify({ resourceType: 'TICKET', resourceId: bookedTicketId })
    });
    assert.strictEqual(payRes.status, 200);

    // Volunteer check-in
    const checkRes = await fetch(`${baseUrl}/api/tickets/check-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${volunteerToken}`
      },
      body: JSON.stringify({ ticketCode: bookedTicketCode })
    });
    assert.strictEqual(checkRes.status, 200);
    const checkBody = await checkRes.json();
    assert.strictEqual(checkBody.status, 'ok');
    assert.strictEqual(checkBody.data.ticketCode, bookedTicketCode);

    // Duplicate check-in is rejected with 409
    const dupRes = await fetch(`${baseUrl}/api/tickets/check-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${volunteerToken}`
      },
      body: JSON.stringify({ ticketCode: bookedTicketCode })
    });
    assert.strictEqual(dupRes.status, 409);
  });

  // 4. Merchandise, Variants & Orders
  let testProductId;
  let testVariantId;
  await t.test('POST /api/products creates product with variants', async () => {
    const res = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: `Integration Tee ${timestamp}`,
        basePrice: 20.00,
        variants: [{ size: 'M', stockQuantity: 10 }]
      })
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    testProductId = body.data.id;
    testVariantId = body.data.variants[0].id;
  });

  let createdOrderId;
  await t.test('POST /api/orders reserves stock and creates pending order', async () => {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberToken}`
      },
      body: JSON.stringify({
        items: [{ variantId: testVariantId, quantity: 2 }]
      })
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.data.status, 'PENDING');
    assert.strictEqual(body.data.totalAmount, '40.00');
    createdOrderId = body.data.id;
  });

  await t.test('PATCH /api/orders/:id/cancel restores variant stock quantity', async () => {
    const res = await fetch(`${baseUrl}/api/orders/${createdOrderId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberToken}`
      }
    });
    assert.strictEqual(res.status, 200);

    // Verify stock restored to 10
    const prodRes = await fetch(`${baseUrl}/api/products/${testProductId}`);
    const prodBody = await prodRes.json();
    assert.strictEqual(prodBody.data.variants[0].stockQuantity, 10);
  });

  // 5. Volunteer Tasks Module
  let testTaskId;
  await t.test('POST /api/tasks verifies assignee is a volunteer, rejects admin assignee', async () => {
    // Attempt assigning to admin fails with 422
    const failRes = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Admin Duty',
        assigneeId: adminUser.id
      })
    });
    assert.strictEqual(failRes.status, 422);

    // Assigning to volunteer succeeds
    const okRes = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Check-in Desk Ops',
        assigneeId: volunteerUser.id,
        eventId: testEventId
      })
    });
    assert.strictEqual(okRes.status, 201);
    const body = await okRes.json();
    testTaskId = body.data.id;
  });

  await t.test('PATCH /api/tasks/:id/status updates progress by assigned volunteer', async () => {
    const res = await fetch(`${baseUrl}/api/tasks/${testTaskId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${volunteerToken}`
      },
      body: JSON.stringify({ status: 'COMPLETED' })
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.status, 'COMPLETED');
  });

  // 6. Announcements Module
  await t.test('POST /api/announcements creates announcement and filters by audience', async () => {
    const res = await fetch(`${baseUrl}/api/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Important Club Notice',
        content: 'All hands general body meeting Friday.',
        audience: 'ALL'
      })
    });
    assert.strictEqual(res.status, 201);

    // Public visitor can view ALL audience announcements
    const listRes = await fetch(`${baseUrl}/api/announcements`);
    assert.strictEqual(listRes.status, 200);
    const listBody = await listRes.json();
    assert.ok(listBody.data.items.length > 0);
  });

  // 7. Finance & Reimbursements Module
  let testReimbId;
  await t.test('POST /api/reimbursements submits expense claim by member', async () => {
    const res = await fetch(`${baseUrl}/api/reimbursements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberToken}`
      },
      body: JSON.stringify({
        amount: 35.50,
        reason: 'Event poster printouts'
      })
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.data.status, 'PENDING');
    testReimbId = body.data.id;
  });

  await t.test('PATCH /api/reimbursements/:id/status approves and marks claim PAID', async () => {
    // Approve
    const appRes = await fetch(`${baseUrl}/api/reimbursements/${testReimbId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'APPROVED' })
    });
    assert.strictEqual(appRes.status, 200);

    // Mark PAID (triggers EXPENSE transaction)
    const payRes = await fetch(`${baseUrl}/api/reimbursements/${testReimbId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'PAID' })
    });
    assert.strictEqual(payRes.status, 200);
  });

  await t.test('GET /api/finance/summary returns live calculated balance and totals', async () => {
    const res = await fetch(`${baseUrl}/api/finance/summary`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
    assert.ok(typeof body.data.totalIncome === 'string');
    assert.ok(typeof body.data.totalExpense === 'string');
    assert.ok(typeof body.data.currentBalance === 'string');
  });

  // 8. Consolidated Dashboards
  await t.test('GET /api/dashboard/admin returns consolidated organizational summary', async () => {
    const res = await fetch(`${baseUrl}/api/dashboard/admin`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
    assert.ok(body.data.members);
    assert.ok(body.data.events);
    assert.ok(body.data.volunteers);
    assert.ok(body.data.finances);
  });

  await t.test('GET /api/dashboard/volunteer returns assigned tasks and check-in capability', async () => {
    const res = await fetch(`${baseUrl}/api/dashboard/volunteer`, {
      headers: { Authorization: `Bearer ${volunteerToken}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
    assert.strictEqual(body.data.canCheckInTickets, true);
    assert.ok(Array.isArray(body.data.assignedTasks));
  });

  await t.test('GET /api/dashboard/member returns membership validity and tickets', async () => {
    const res = await fetch(`${baseUrl}/api/dashboard/member`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
    assert.ok(body.data.membership);
    assert.ok(Array.isArray(body.data.myTickets));
  });
});
