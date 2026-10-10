const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../src/app');

test('Backend Health & Error Handling Tests', async (t) => {
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

  await t.test('GET /api/nonexistent-route returns 404 and structured error', async () => {
    const res = await fetch(`${baseUrl}/api/nonexistent-route`);
    assert.strictEqual(res.status, 404);

    const data = await res.json();
    assert.strictEqual(data.status, 'error');
    assert.ok(data.message.includes('Route not found'));
  });
});
