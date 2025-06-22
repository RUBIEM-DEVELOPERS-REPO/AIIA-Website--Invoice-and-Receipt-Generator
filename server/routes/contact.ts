
import { Router } from "express";
import sgMail from "@sendgrid/mail";

const router = Router();

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

router.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
    console.error("SendGrid configuration missing");
    return res.status(500).json({ error: "Email service not configured properly" });
  }

  try {
    const msg = {
      to: 'admin@aiinstituteafrica.com',
      from: process.env.SENDGRID_FROM_EMAIL,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await sgMail.send(msg);
    res.json({ success: true });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
