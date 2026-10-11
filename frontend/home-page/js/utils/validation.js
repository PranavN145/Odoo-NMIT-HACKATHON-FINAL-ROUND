/**
 * Validation and Formatting Helper Utilities
 * Skyline Student Association Platform
 */

export function validateRegistrationForm(name, phone, email, type) {
  const errors = [];
  
  if (!name || name.trim().length === 0) {
    errors.push("Full Name is required.");
  } else if (name.trim().length < 2) {
    errors.push("Full Name must be at least 2 characters.");
  }

  if (!phone || phone.trim().length === 0) {
    errors.push("Phone Number is required.");
  } else if (phone.trim().replace(/\D/g, "").length < 8) {
    errors.push("Please enter a valid Phone Number (at least 8 digits).");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim().length === 0) {
    errors.push("Email Address is required.");
  } else if (!emailRegex.test(email.trim())) {
    errors.push("Please enter a valid Email Address (e.g., student@skyline.edu).");
  }

  if (!type || (type !== "member" && type !== "guest")) {
    errors.push("Participant Type selection is required.");
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
  return amount ? `₹${amount}` : "₹0";
}
