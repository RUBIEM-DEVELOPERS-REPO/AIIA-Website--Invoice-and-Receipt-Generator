const nodemailer = require('nodemailer');

console.log("Loaded Environment Variables:");
console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_SECURE:", process.env.SMTP_SECURE);
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_FROM:", process.env.SMTP_FROM);
console.log("SMTP_PASS length:", process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0);

const host = process.env.SMTP_HOST || "mail.smtp2go.com";
const port = parseInt(process.env.SMTP_PORT || "2525", 10);
const secure = process.env.SMTP_SECURE === "true" || port === 465;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || "admin@aiinstituteafrica.com";

if (!user || !pass) {
  console.error("Error: SMTP_USER and SMTP_PASS must be set!");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass },
  connectionTimeout: 10000,
});

console.log("Verifying connection to SMTP server...");
transporter.verify()
  .then(() => {
    console.log("SMTP Connection verified successfully!");
    console.log("Sending test email...");
    
    return transporter.sendMail({
      from: `"AI Institute Africa" <${from}>`,
      to: "patiencemupikeni@gmail.com", // You can edit this email address to your own
      subject: "Test Email from AI Institute Africa",
      text: "Hello! If you are reading this, your SendPulse SMTP email configuration is working perfectly!",
      html: "<h3>Hello!</h3><p>If you are reading this, your SendPulse SMTP email configuration is working perfectly!</p>"
    });
  })
  .then((info) => {
    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
  })
  .catch((err) => {
    console.error("Error sending email:", err);
  });
