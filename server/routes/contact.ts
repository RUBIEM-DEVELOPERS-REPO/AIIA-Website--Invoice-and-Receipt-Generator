import { Router } from "express";
import { db } from "@db";
import { contacts } from "@db/schema";
import { ZodError } from "zod";
import nodemailer from "nodemailer";
import { sendRegistrationEmail } from "../services/email";

const router = Router();

// General contact: save and send email using Nodemailer (Gmail fallback)
router.post("/api/contact/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    await db.insert(contacts).values({
      name,
      email,
      subject: subject || "Contact Form",
      message,
    });

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
      res.json({ success: true, note: "Saved but email delivery delayed" });
    }
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Original database-only contact post endpoint
router.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: email,
      to: "admin@aiinstituteafrica.com",
      subject: `Message from ${name}`,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    const contact = await db.insert(contacts).values(req.body);
    res.json({ success: true, data: contact });
  } catch (error) {
    console.error("Error sending email:", error);
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Invalid form data", errors: error.errors });
    } else {
      res.status(500).json({ message: "Failed to send message" });
    }
  }
});

// Conference contact endpoint using SMTP2GO
router.post("/api/conference/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Import the SMTP2GO email service
    const { sendRegistrationEmail: sendConfEmail } = await import("../services/email");
    
    // Create email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
          AI Africa Summit 2025 - Contact Form Submission
        </h2>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #1e40af; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Message</h3>
          <p style="line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #1e40af; font-size: 14px;">
            <strong>Note:</strong> This inquiry was submitted through the AI Africa Summit 2025 contact form.
          </p>
        </div>
      </div>
    `;

    // Send email using SMTP2GO
    const emailSent = await sendConfEmail({
      to: "events@alphamedia.co.zw",
      subject: `AI Africa Summit 2025 - ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: emailContent,
    });

    if (emailSent) {
      // Also save to database for record keeping
      await db.insert(contacts).values({
        name,
        email,
        subject: `AI Africa Summit 2025 - ${subject}`,
        message,
        createdAt: new Date(),
      });

      res.json({ success: true, message: "Your message has been sent successfully!" });
    } else {
      res.status(500).json({ message: "Failed to send email. Please try again." });
    }
  } catch (error) {
    console.error("Error sending conference contact email:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;
