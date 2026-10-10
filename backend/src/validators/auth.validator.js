/**
 * Authentication Input Validators
 * Validates and normalizes request payloads for registration and login.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates registration input payload.
 * Enforces name length >= 2, valid email format, and password length >= 8.
 * Never allows privileged fields (role, isVolunteer, etc.) from the client.
 */
function validateRegister(body) {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Request body must be a valid JSON object' };
  }

  const { name, email, password, phone } = body;

  // Validate Name
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return { isValid: false, error: 'Name is required and must be at least 2 characters long' };
  }

  // Validate Email
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return { isValid: false, error: 'A valid email address is required' };
  }

  // Validate Password
  if (!password || typeof password !== 'string' || password.length < 8) {
    return { isValid: false, error: 'Password is required and must be at least 8 characters long' };
  }

  // Validate optional phone
  let normalizedPhone = null;
  if (phone !== undefined && phone !== null) {
    if (typeof phone !== 'string') {
      return { isValid: false, error: 'Phone number must be a string' };
    }
    const trimmedPhone = phone.trim();
    if (trimmedPhone.length > 0) {
      normalizedPhone = trimmedPhone;
    }
  }

  return {
    isValid: true,
    value: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: normalizedPhone
    }
  };
}

/**
 * Validates user login input payload.
 */
function validateLogin(body) {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Request body must be a valid JSON object' };
  }

  const { email, password } = body;

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return { isValid: false, error: 'A valid email address is required' };
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    return { isValid: false, error: 'Password is required' };
  }

  return {
    isValid: true,
    value: {
      email: email.trim().toLowerCase(),
      password
    }
  };
}

module.exports = {
  validateRegister,
  validateLogin
};
