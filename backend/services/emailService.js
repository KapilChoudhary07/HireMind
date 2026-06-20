const { Resend } = require("resend");

const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  return new Resend(process.env.RESEND_API_KEY);
};

const sendEmail = async (to, subject, otp) => {
  const from =
    process.env.RESEND_FROM_EMAIL ||
    "HireMind <onboarding@resend.dev>";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;color:#0f172a">
      <h2 style="color:#2563eb">HireMind</h2>
      <p>We received a password reset request.</p>
      <h1 style="background:#f3f4f6;padding:15px;text-align:center;letter-spacing:5px">
        ${otp}
      </h1>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, you can ignore this email.</p>
      <hr>
      <small>HireMind Team</small>
    </div>
  `;

  const sendRequest = getResendClient().emails.send({
    from,
    to: [to],
    subject,
    html,
  });

  const timeout = new Promise((_, reject) => {
    setTimeout(
      () => reject(new Error("Email service timed out")),
      15000
    );
  });

  const { data, error } = await Promise.race([
    sendRequest,
    timeout,
  ]);

  if (error) {
    throw new Error(error.message || "Resend failed to send email");
  }

  return data;
};

module.exports = {
  sendEmail,
};
