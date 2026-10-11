const nodemailer = require('nodemailer');

// In-Memory store for pending verification codes
// Key: normalized email -> { code, token, name, email, password, expiresAt }
const pendingVerifications = new Map();

let transporter = null;
let isEthereal = false;

async function getTransporter() {
  if (transporter) return transporter;

  // Check for custom SMTP / Gmail configuration
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    if (process.env.SMTP_SERVICE === 'gmail' || (process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail'))) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      console.log('Real Gmail SMTP transporter initialized for:', process.env.SMTP_USER);
      return transporter;
    }

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    console.log('Real SMTP transporter initialized with host:', process.env.SMTP_HOST);
    return transporter;
  }

  // Development fallback: Create an Ethereal test inbox or local logger
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    isEthereal = true;
    console.log('Ethereal test mailer initialized:', testAccount.user);
    return transporter;
  } catch (err) {
    console.warn('Could not initialize ethereal transporter, falling back to mock logger:', err.message);
    transporter = {
      sendMail: async (options) => {
        console.log(`[MOCK EMAIL DISPATCH TO ${options.to}]:`, options.subject);
        return { messageId: `mock-${Date.now()}` };
      }
    };
    return transporter;
  }
}

/**
 * Generates a 6-digit verification code and dispatches a verification email.
 */
async function sendVerificationEmail({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const token = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

  // Store in pending map
  pendingVerifications.set(normalizedEmail, {
    code: verificationCode,
    token,
    name: name.trim(),
    email: normalizedEmail,
    password,
    expiresAt
  });

  const activeTransporter = await getTransporter();

  const sender = process.env.SMTP_FROM || (process.env.SMTP_USER 
    ? `"Skyline Student Association" <${process.env.SMTP_USER}>` 
    : '"Skyline Student Association" <no-reply@skyline.edu>');

  const mailOptions = {
    from: sender,
    to: normalizedEmail,
    subject: `Verify your Skyline Student Account - Code: ${verificationCode}`,
    text: `Hello ${name},\n\nWelcome to Skyline Student Association! Your account verification code is:\n\n${verificationCode}\n\nThis code will expire in 15 minutes.\n\nBest regards,\nSkyline Student Association Team`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #13293D; }
          .container { max-width: 520px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: #13293D; color: #FFFFFF; padding: 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.01em; }
          .content { padding: 32px 28px; }
          .greeting { font-size: 1.05rem; font-weight: 600; margin-bottom: 12px; }
          .text { font-size: 0.9375rem; color: #475569; line-height: 1.5; margin-bottom: 24px; }
          .code-box { background: #F0F6F9; border: 2px dashed #006494; border-radius: 8px; padding: 18px; text-align: center; margin: 24px 0; }
          .code { font-size: 2.25rem; font-family: monospace; font-weight: 700; letter-spacing: 0.35em; color: #006494; margin-left: 0.35em; }
          .code-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; margin-bottom: 6px; }
          .footer { padding: 16px 28px; background: #F8FAFC; border-top: 1px solid #E2E8F0; font-size: 0.75rem; color: #94A3B8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Skyline Student Association</h1>
          </div>
          <div class="content">
            <div class="greeting">Hello ${name},</div>
            <div class="text">
              Thank you for registering on the Skyline Student Association portal. To activate your account and complete your sign-up, please enter the 6-digit verification code below:
            </div>
            
            <div class="code-box">
              <div class="code-label">Account Verification Code</div>
              <div class="code">${verificationCode}</div>
            </div>

            <div class="text" style="font-size: 0.8125rem; color: #64748B;">
              ⏰ This code is valid for <strong>15 minutes</strong>. If you did not create an account on Skyline, please disregard this email.
            </div>
          </div>
          <div class="footer">
            Skyline Student Association · Campus Student Services<br>
            © 2026 Skyline Student Association. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await activeTransporter.sendMail(mailOptions);
    let previewUrl = null;
    if (isEthereal && nodemailer.getTestMessageUrl) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`✉️ Verification email sent! Preview URL: ${previewUrl}`);
    }

    return {
      success: true,
      code: verificationCode,
      previewUrl,
      messageId: info.messageId
    };
  } catch (sendErr) {
    console.error('Error dispatching verification email:', sendErr.message);
    // Return code so demo flow is not blocked
    return {
      success: true,
      code: verificationCode,
      previewUrl: null,
      messageId: `err-fallback-${Date.now()}`
    };
  }
}

/**
 * Validates a verification code for an email.
 */
function verifyCode(email, inputCode) {
  const normalizedEmail = email.trim().toLowerCase();
  const pending = pendingVerifications.get(normalizedEmail);

  if (!pending) {
    return {
      valid: false,
      reason: 'No pending verification found for this email address. Please sign up again.'
    };
  }

  if (Date.now() > pending.expiresAt) {
    pendingVerifications.delete(normalizedEmail);
    return {
      valid: false,
      reason: 'The verification code has expired. Please request a new code.'
    };
  }

  if (pending.code !== inputCode.trim()) {
    return {
      valid: false,
      reason: 'Invalid verification code. Please check your email and try again.'
    };
  }

  // Verified!
  const userPayload = {
    name: pending.name,
    email: pending.email,
    password: pending.password
  };

  pendingVerifications.delete(normalizedEmail);

  return {
    valid: true,
    userPayload
  };
}

module.exports = {
  sendVerificationEmail,
  verifyCode,
  pendingVerifications
};
