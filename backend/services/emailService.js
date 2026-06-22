const https = require("https");

const EMAILJS_HOST = "api.emailjs.com";
const EMAILJS_PATH = "/api/v1.0/email/send";

const requireEnv = (name) => {
  const value = process.env[name]?.trim();

  if (!value) {
    const error = new Error(`${name} is not configured`);
    error.statusCode = 500;
    error.isEmailConfigError = true;
    throw error;
  }

  return value;
};

const postJson = (payload) => {
  const body = JSON.stringify(payload);

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: EMAILJS_HOST,
        path: EMAILJS_PATH,
        method: "POST",
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";

        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            body: data,
          });
        });
      }
    );

    req.on("timeout", () => {
      req.destroy(new Error("EmailJS request timed out"));
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
};

const sendEmail = async (to, subject, otp) => {
  const serviceId = requireEnv("EMAILJS_SERVICE_ID");
  const templateId = requireEnv("EMAILJS_TEMPLATE_ID");
  const publicKey = requireEnv("EMAILJS_PUBLIC_KEY");
  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim();

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      to_name: to.split("@")[0],
      to_email: to,
      user_email: to,
      email: to,
      reply_to: to,
      from_name: "HireMind",
      name: to.split("@")[0],
      subject,
      title: subject,
      otp,
      code: otp,
      reset_otp: otp,
      passcode: otp,
      message: `Your HireMind password reset OTP is ${otp}. It expires in 10 minutes.`,
      app_name: "HireMind",
      expiry_minutes: "10",
    },
  };

  if (privateKey) {
    payload.accessToken = privateKey;
  }

  console.log("EmailJS Request:", {
    service_id: serviceId,
    template_id: templateId,
    hasPublicKey: Boolean(publicKey),
    hasPrivateKey: Boolean(privateKey),
    to_email: to,
  });

  const response = await postJson(payload);

  console.log("EmailJS Response:", {
    statusCode: response.statusCode,
    body: response.body,
  });

  if (response.statusCode < 200 || response.statusCode >= 300) {
    const error = new Error(
      `EmailJS ${response.statusCode}: ${response.body || "Email send failed"}`
    );
    error.statusCode = response.statusCode;
    error.isEmailProviderError = true;

    console.error("EmailJS send failed:", {
      statusCode: response.statusCode,
      response: response.body,
    });

    throw error;
  }

  console.log("EmailJS email sent successfully to:", to);
  return response;
};

module.exports = {
  sendEmail,
};
