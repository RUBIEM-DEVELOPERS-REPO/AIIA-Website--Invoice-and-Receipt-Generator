import { Router } from "express";
import { sendRegistrationEmail } from "../services/email";

const router = Router();

router.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <img src="cid:preloader" alt="AI Institute Africa Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
        <h2 style="color: #0891b2;">New Contact Form Submission</h2>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
          <p style="margin: 0;"><strong>Message:</strong></p>
          <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="color: #666; font-size: 12px;">Reply directly to this email to respond to ${name} at ${email}</p>
      </div>
    `;

    const text = `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`;

    const success = await sendRegistrationEmail({
      to: 'admin@aiinstituteafrica.com',
      subject: `Contact Form: ${subject}`,
      html,
      text,
    });

    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: "Failed to send email" });
    }
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
