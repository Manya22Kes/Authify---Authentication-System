const { Resend } = require("resend");
const env = require("../config/env");

let resendClient;

function getResendClient() {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing. Check backend/server/.env");
  }

  if (!resendClient) {
    resendClient = new Resend(env.RESEND_API_KEY);
  }

  return resendClient;
}

async function sendEmail({ to, subject, html }) {
  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      const sendError = new Error(
        error.message || "Resend failed to send email",
      );
      sendError.details = error;
      throw sendError;
    }

    return data;
  } catch (error) {
    console.error("Email delivery failed", {
      message: error.message,
      details: error.details || error.cause || null,
      to,
      subject,
    });
    throw error;
  }
}

async function sendVerificationEmail(email, name, verificationUrl) {
  return sendEmail({
    to: email,
    subject: "Verify your email",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
        <h2 style="margin-bottom:12px;">Welcome, ${name}</h2>
        <p style="margin:0 0 16px;">Please verify your email address to secure your account.</p>
        <a
          href="${verificationUrl}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#d4af37;
            color:#111827;
            text-decoration:none;
            border-radius:8px;
            font-weight:700;
          "
        >
          Verify Email
        </a>
        <p style="margin:16px 0 0;">This link expires in 1 hour and can only be used once.</p>
      </div>
    `,
  });
}

async function sendPasswordResetEmail(email, name, resetUrl) {
  return sendEmail({
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
        <h2>Hello ${name}</h2>

        <p>You requested a password reset.</p>

        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#d4af37;
            color:#111827;
            text-decoration:none;
            border-radius:8px;
            font-weight:700;
          "
        >
          Reset Password
        </a>

        <p>This link expires in 10 minutes.</p>

        <p>If you did not request this reset, you can safely ignore this email.</p>
      </div>
    `,
  });
}

async function sendWelcomeEmail(email, name) {
  return sendEmail({
    to: email,
    subject: "Welcome to Authify 🎉",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
        <h2 style="margin-bottom:12px;">Welcome to Authify, ${name} 🎉</h2>
        <p style="margin:0 0 16px;">
          Thanks for joining Authify. Your account is ready to help you sign in securely with modern authentication and security features.
        </p>
        <p style="margin:0 0 8px;">
          You can enjoy secure authentication, password reset support, OAuth sign-in, and account protection built for your peace of mind.
        </p>
        <p style="margin:0;">If you have any questions, we're here to help.</p>
        <p style="margin:16px 0 0;">— Authify Security</p>
      </div>
    `,
  });
}

async function sendLoginNotificationEmail(email, name, provider) {
  return resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: email,
    subject: "New sign in to your Authify account",
    html: `
      <h2>Hello ${name},</h2>

      <p>A new sign in to your <strong>Authify</strong> account was detected.</p>

      <p><strong>Sign-in method:</strong> ${provider}</p>

      <p>If this was you, no action is required.</p>

      <p>If you don't recognize this sign in, please change your password immediately.</p>

      <br>

      <p>— Authify Security</p>
    `,
  });
}
module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendLoginNotificationEmail,
};
