/**
 * Validation and Formatting Helper Utilities
 * Skyline Student Association Platform
 */

export function validateRegistrationForm(name, email) {
  const errors = [];
  
  if (!name || name.trim().length === 0) {
    errors.push("Full Name is required.");
  } else if (name.trim().length < 2) {
    errors.push("Full Name must be at least 2 characters.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim().length === 0) {
    errors.push("Email Address is required.");
  } else if (!emailRegex.test(email.trim())) {
    errors.push("Please enter a valid email address (e.g., student@skyline.edu).");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function formatCurrency(amount) {
  if (typeof amount === "number") {
    return `₹${amount.toLocaleString()}`;
  }
  return amount ? `₹${amount}` : "Free";
}
