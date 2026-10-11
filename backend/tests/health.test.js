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

    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
    assert.ok(data[0].id);
    assert.ok(data[0].title);
  });

  await t.test('POST /api/events/evt-1/tickets registers ticket successfully', async () => {
    const res = await fetch(`${baseUrl}/api/events/evt-1/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alex Mercer', email: 'alex@skyline.edu', participantType: 'guest' })
    });
    assert.strictEqual(res.status, 201);

    const data = await res.json();
    assert.ok(data.ticketCode);
    assert.ok(data.ticketCode.startsWith('TKT-'));
  });

  await t.test('GET /api/products returns 200 and list of merchandise items', async () => {
    const res = await fetch(`${baseUrl}/api/products`);
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
    assert.ok(data[0].name);
  });

  await t.test('GET /api/nonexistent-route returns 404 and structured error', async () => {
    const res = await fetch(`${baseUrl}/api/nonexistent-route`);
    assert.strictEqual(res.status, 404);

    const data = await res.json();
    assert.strictEqual(data.status, 'error');
    assert.ok(data.message.includes('Route not found'));
  });
});
