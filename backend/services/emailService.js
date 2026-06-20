const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

const requireEnv = (name) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
};

const sendEmail = async (to, subject, otp) => {
  const serviceId = requireEnv("EMAILJS_SERVICE_ID");
  const templateId = requireEnv("EMAILJS_TEMPLATE_ID");
  const publicKey = requireEnv("EMAILJS_PUBLIC_KEY");
  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim();

  const templateParams = {
    to_email: to,
    user_email: to,
    email: to,
    subject,
    otp,
    passcode: otp,
    app_name: "HireMind",
    expiry_minutes: "10",
  };

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: templateParams,
  };

  if (privateKey) {
    payload.accessToken = privateKey;
  }

  const response = await fetch(EMAILJS_SEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error("EmailJS send failed:", {
      status: response.status,
      response: responseText,
      serviceId,
      templateId,
      to,
      hasPublicKey: Boolean(publicKey),
      hasPrivateKey: Boolean(privateKey),
    });

    throw new Error(responseText || "EmailJS failed to send email");
  }

  return {
    status: response.status,
    text: responseText,
  };
};

module.exports = {
  sendEmail,
};
