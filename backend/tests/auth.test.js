const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = require('../src/app');
const { validateRegister, validateLogin } = require('../src/validators/auth.validator');
const authService = require('../src/services/auth.service');
const { authenticate, authorize } = require('../src/middleware/auth.middleware');

test('Authentication Module Tests', async (t) => {
  let server;
  let baseUrl;

  // Spin up an ephemeral testing server
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

  // -------------------------------------------------------------
  // 1. Validator Tests
  // -------------------------------------------------------------
  await t.test('Validator - Registration input validation', () => {
    // Valid input
    const valid = validateRegister({
      name: '  Jane Doe  ',
      email: '  JANE@University.EDU  ',
      password: 'StrongPassword123!',
      phone: '  +1234567890  ',
      role: 'ADMIN', // Attacker attempt
      isVolunteer: true // Attacker attempt
    });

    assert.strictEqual(valid.isValid, true);
    assert.strictEqual(valid.value.name, 'Jane Doe');
    assert.strictEqual(valid.value.email, 'jane@university.edu');
    assert.strictEqual(valid.value.phone, '+1234567890');
    assert.strictEqual(valid.value.role, undefined, 'Privileged role must be stripped');
    assert.strictEqual(valid.value.isVolunteer, undefined, 'Privileged isVolunteer must be stripped');

    // Missing / short name
    const shortName = validateRegister({
      name: 'A',
      email: 'jane@university.edu',
      password: 'password123'
    });
    assert.strictEqual(shortName.isValid, false);
    assert.match(shortName.error, /Name is required/);

    // Invalid email
    const badEmail = validateRegister({
      name: 'Jane Doe',
      email: 'not-an-email',
      password: 'password123'
    });
    assert.strictEqual(badEmail.isValid, false);
    assert.match(badEmail.error, /valid email/);

    // Short password (< 8 chars)
    const shortPass = validateRegister({
      name: 'Jane Doe',
      email: 'jane@university.edu',
      password: 'short'
    });
    assert.strictEqual(shortPass.isValid, false);
    assert.match(shortPass.error, /at least 8 characters/);
  });

  await t.test('Validator - Login input validation', () => {
    const valid = validateLogin({
      email: '  JANE@University.EDU  ',
      password: 'SecretPassword123!'
    });
    assert.strictEqual(valid.isValid, true);
    assert.strictEqual(valid.value.email, 'jane@university.edu');
    assert.strictEqual(valid.value.password, 'SecretPassword123!');

    const missingPass = validateLogin({
      email: 'jane@university.edu',
      password: ''
    });
    assert.strictEqual(missingPass.isValid, false);
    assert.match(missingPass.error, /Password is required/);
  });

  // -------------------------------------------------------------
  // 2. Token Signing & Password Hashing Unit Tests
  // -------------------------------------------------------------
  await t.test('Service - Password hashing and token generation', async () => {
    const mockUser = {
      id: 'uuid-1234',
      name: 'Alice Member',
      email: 'alice@university.edu',
      role: 'MEMBER',
      isVolunteer: false,
      createdAt: new Date().toISOString()
    };

    const token = authService.signToken(mockUser);
    assert.ok(typeof token === 'string' && token.length > 20);

    const decoded = jwt.decode(token);
    assert.strictEqual(decoded.id, 'uuid-1234');
    assert.strictEqual(decoded.email, 'alice@university.edu');
    assert.strictEqual(decoded.role, 'MEMBER');
    assert.strictEqual(decoded.isVolunteer, false);

    // Safe user serialization must never output passwordHash
    const safe = authService.sanitizeUser({
      ...mockUser,
      passwordHash: 'secret_bcrypt_hash'
    });
    assert.strictEqual(safe.passwordHash, undefined);
  });

  // -------------------------------------------------------------
  // 3. Authorization RBAC Middleware Tests
  // -------------------------------------------------------------
  await t.test('Middleware - Authorize role and volunteer restrictions', () => {
    const memberUser = { id: '1', role: 'MEMBER', isVolunteer: false };
    const volunteerUser = { id: '2', role: 'MEMBER', isVolunteer: true };
    const adminUser = { id: '3', role: 'ADMIN', isVolunteer: false };

    const mockRes = () => {
      const res = {};
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      res.json = (body) => {
        res.body = body;
        return res;
      };
      return res;
    };

    // Test 1: Admin Route
    const adminOnly = authorize('ADMIN');
    let nextCalled = false;
    adminOnly({ user: adminUser }, mockRes(), () => { nextCalled = true; });
    assert.strictEqual(nextCalled, true, 'Admin should access ADMIN route');

    nextCalled = false;
    const deniedRes1 = mockRes();
    adminOnly({ user: memberUser }, deniedRes1, () => { nextCalled = true; });
    assert.strictEqual(nextCalled, false);
    assert.strictEqual(deniedRes1.statusCode, 403);

    // Test 2: Volunteer Route
    const volunteerOnly = authorize('VOLUNTEER');
    nextCalled = false;
    volunteerOnly({ user: volunteerUser }, mockRes(), () => { nextCalled = true; });
    assert.strictEqual(nextCalled, true, 'Volunteer should access VOLUNTEER route');

    // Strict Rule: Admin is NOT automatically a volunteer!
    nextCalled = false;
    const deniedRes2 = mockRes();
    volunteerOnly({ user: adminUser }, deniedRes2, () => { nextCalled = true; });
    assert.strictEqual(nextCalled, false, 'Admin must not have access to VOLUNTEER-only route');
    assert.strictEqual(deniedRes2.statusCode, 403);

    // Member without isVolunteer = true is rejected
    nextCalled = false;
    const deniedRes3 = mockRes();
    volunteerOnly({ user: memberUser }, deniedRes3, () => { nextCalled = true; });
    assert.strictEqual(nextCalled, false);
    assert.strictEqual(deniedRes3.statusCode, 403);

    // Test 3: Public access
    const publicRoute = authorize('PUBLIC');
    nextCalled = false;
    publicRoute({ user: null }, mockRes(), () => { nextCalled = true; });
    assert.strictEqual(nextCalled, true, 'Public access allows unauthenticated calls');
  });

  // -------------------------------------------------------------
  // 4. HTTP API Endpoints Validation & Auth Header Tests
  // -------------------------------------------------------------
  await t.test('POST /api/auth/register rejects invalid requests with 400', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '',
        email: 'invalid-email',
        password: '123'
      })
    });

    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.status, 'error');
    assert.ok(data.message);
  });

  await t.test('POST /api/auth/login rejects invalid input with 400', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'bad-email',
        password: ''
      })
    });

    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.status, 'error');
    assert.ok(data.message);
  });

  await t.test('GET /api/auth/me without token returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`);
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.status, 'error');
    assert.match(data.message, /missing or malformed/i);
  });

  await t.test('GET /api/auth/me with invalid token returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: 'Bearer this.is.an.invalid.token' }
    });
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.status, 'error');
    assert.match(data.message, /Invalid authentication token/i);
  });

  await t.test('POST /api/auth/logout without token returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST'
    });
    assert.strictEqual(res.status, 401);
  });

  // -------------------------------------------------------------
  // 5. Mocked Integration / Unit Tests for Business Logic
  // -------------------------------------------------------------
  await t.test('Service - registerUser succeeds and enforces MEMBER role', async () => {
    let createdRecord = null;
    const mockPrisma = {
      user: {
        create: async ({ data }) => {
          createdRecord = {
            id: 'mock-uuid-1',
            ...data,
            createdAt: new Date()
          };
          return createdRecord;
        }
      }
    };

    const result = await authService.registerUser(
      {
        name: 'Bob Student',
        email: 'bob@university.edu',
        password: 'Password123!',
        phone: '1234567890'
      },
      mockPrisma
    );

    assert.ok(result.token);
    assert.strictEqual(result.user.name, 'Bob Student');
    assert.strictEqual(result.user.email, 'bob@university.edu');
    assert.strictEqual(result.user.role, 'MEMBER');
    assert.strictEqual(result.user.isVolunteer, false);
    assert.strictEqual(result.user.passwordHash, undefined, 'passwordHash must never be returned');

    // Verify hash in database mock is a bcrypt hash
    assert.ok(createdRecord.passwordHash.startsWith('$2'));
    const isCorrect = await bcrypt.compare('Password123!', createdRecord.passwordHash);
    assert.strictEqual(isCorrect, true);
  });

  await t.test('Service - registerUser handles duplicate email (P2002) with 409', async () => {
    const mockPrisma = {
      user: {
        create: async () => {
          const pError = new Error('Unique constraint failed');
          pError.code = 'P2002';
          throw pError;
        }
      }
    };

    await assert.rejects(
      async () => {
        await authService.registerUser(
          {
            name: 'Duplicate User',
            email: 'duplicate@university.edu',
            password: 'Password123!'
          },
          mockPrisma
        );
      },
      (err) => {
        assert.strictEqual(err.statusCode, 409);
        assert.strictEqual(err.message, 'Email already in use');
        return true;
      }
    );
  });

  await t.test('Service - loginUser verifies bcrypt password and returns token', async () => {
    const passwordHash = await bcrypt.hash('CorrectPassword123!', 10);
    const mockPrisma = {
      user: {
        findUnique: async ({ where }) => {
          if (where.email === 'alice@university.edu') {
            return {
              id: 'alice-id',
              name: 'Alice',
              email: 'alice@university.edu',
              passwordHash,
              role: 'MEMBER',
              isVolunteer: false
            };
          }
          return null;
        }
      }
    };

    // Valid credentials
    const result = await authService.loginUser(
      { email: 'alice@university.edu', password: 'CorrectPassword123!' },
      mockPrisma
    );
    assert.ok(result.token);
    assert.strictEqual(result.user.email, 'alice@university.edu');

    // Invalid password
    await assert.rejects(
      async () => {
        await authService.loginUser(
          { email: 'alice@university.edu', password: 'WrongPassword' },
          mockPrisma
        );
      },
      (err) => {
        assert.strictEqual(err.statusCode, 401);
        assert.strictEqual(err.message, 'Invalid email or password');
        return true;
      }
    );

    // Non-existent email
    await assert.rejects(
      async () => {
        await authService.loginUser(
          { email: 'nobody@university.edu', password: 'Password123!' },
          mockPrisma
        );
      },
      (err) => {
        assert.strictEqual(err.statusCode, 401);
        assert.strictEqual(err.message, 'Invalid email or password');
        return true;
      }
    );
  });
});
