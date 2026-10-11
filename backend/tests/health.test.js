process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_health_tests_only';

const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

test('Backend Health, Events & Products API Integration Tests', async (t) => {
  let server;
  let baseUrl;

  // Start server on an ephemeral free port for testing
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });

  t.after(() => {
    server.close();
  });

  await t.test('GET /api/health returns 200 and valid health status payload', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
    assert.strictEqual(data.message, 'Student Organization System API is healthy');
    assert.ok(typeof data.timestamp === 'string');
    assert.ok(typeof data.uptime === 'number');
  });

  await t.test('GET /api/events returns 200 and list of events', async () => {
    const res = await fetch(`${baseUrl}/api/events`);
    assert.strictEqual(res.status, 200);

    const payload = await res.json();
    const items = Array.isArray(payload) ? payload : payload.data?.items;
    assert.ok(Array.isArray(items));
    assert.ok(items.length > 0);
    assert.ok(items[0].id);
    assert.ok(items[0].title);
  });

  await t.test('POST /api/events/evt-1/tickets registers ticket successfully', async () => {
    const testEmail = `alex-${Date.now()}@skyline.edu`;
    const res = await fetch(`${baseUrl}/api/events/evt-1/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alex Mercer', email: testEmail, participantType: 'guest' })
    });
    assert.strictEqual(res.status, 201);

    const payload = await res.json();
    const ticketCode = payload.ticketCode || payload.data?.ticketCode || payload.data?.ticket?.ticketCode;
    assert.ok(ticketCode);
    assert.ok(ticketCode.startsWith('TKT-') || ticketCode.startsWith('TIC-'));
  });

  await t.test('GET /api/products returns 200 and list of merchandise items', async () => {
    const res = await fetch(`${baseUrl}/api/products`);
    assert.strictEqual(res.status, 200);

    const payload = await res.json();
    const items = Array.isArray(payload) ? payload : payload.data?.items;
    assert.ok(Array.isArray(items));
    assert.ok(items.length > 0);
    assert.ok(items[0].name);
  });

  await t.test('GET /api/nonexistent-route returns 404 and structured error', async () => {
    const res = await fetch(`${baseUrl}/api/nonexistent-route`);
    assert.strictEqual(res.status, 404);

    const data = await res.json();
    assert.strictEqual(data.status, 'error');
    assert.ok(data.message.includes('Route not found'));
  });
});
