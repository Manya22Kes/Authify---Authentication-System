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

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
