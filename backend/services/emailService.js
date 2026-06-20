const nodemailer = require("nodemailer");

const transporter =
  nodemailer.createTransport({
    service: "gmail",
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user:
        process.env.EMAIL_USER,
      pass:
        process.env.EMAIL_PASS,
    },
  });

const sendEmail = async (
  to,
  subject,
  otp
) => {
  const html = `
    <div style="font-family: Arial; max-width:600px; margin:auto; padding:20px;">
      <h2 style="color:#2563eb;">
        HireMind
      </h2>

      <p>
        We received a password reset request.
      </p>

      <h1 style="
        background:#f3f4f6;
        padding:15px;
        text-align:center;
        letter-spacing:5px;
      ">
        ${otp}
      </h1>

      <p>
        This OTP will expire in
        10 minutes.
      </p>

      <p>
        If you didn't request this,
        ignore this email.
      </p>

      <hr>

      <small>
        HireMind Team
      </small>
    </div>
  `;

  return transporter.sendMail({
    from:
      process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

module.exports = {
  sendEmail,
};
