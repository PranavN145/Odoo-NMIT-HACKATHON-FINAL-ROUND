const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

test('Backend Auth API Integration Tests', async (t) => {
  let server;
  let baseUrl;

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

  const timestamp = Date.now();
  const testEmail = `student_${timestamp}@skyline.edu`;
  let verificationCode = null;

  await t.test('POST /api/auth/register dispatches verification email and returns code', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Student User ${timestamp}`,
        email: testEmail,
        password: 'pass@123'
      })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.verificationRequired, true);
    assert.ok(data.demoCode);
    verificationCode = data.demoCode;
  });

  await t.test('POST /api/auth/verify fails with invalid code', async () => {
    const res = await fetch(`${baseUrl}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        code: '000000'
      })
    });

    assert.strictEqual(res.status, 400);
  });

  await t.test('POST /api/auth/verify creates user upon valid code', async () => {
    const res = await fetch(`${baseUrl}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        code: verificationCode
      })
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.email, testEmail);
    assert.strictEqual(data.user.role, 'USER');
    assert.ok(data.user.id);
  });

  await t.test('POST /api/auth/login validates newly created user', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'pass@123'
      })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.email, testEmail);
  });

  await t.test('POST /api/auth/register fails with 400 when required fields are missing', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'missingname@test.com'
      })
    });

    assert.strictEqual(res.status, 400);
  });

  await t.test('POST /api/auth/login validates existing demo user', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@demo.in',
        password: 'pass@123'
      })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.email, 'user@demo.in');
  });

  await t.test('POST /api/auth/login rejects wrong credentials with 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@demo.in',
        password: 'wrong_password'
      })
    });

    assert.strictEqual(res.status, 401);
  });
});
