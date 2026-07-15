import { Router } from "express";
import { db } from "@db";
import {
  summitRegistrations,
  summitInvoices,
  summitPaymentProofs,
  summitDelegates,
} from "@db/schema";
import { eq } from "drizzle-orm";
import { sendRegistrationEmail } from "../services/email";
import { isAdmin } from "../middleware/auth";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// In-memory token store for short-lived admin invoice links
// token => { expires: timestamp, createdBy?: adminId }
export const adminInvoiceTokenStore = new Map<string, { expires: number; createdBy?: number }>();

// Configure multer for payment proofs
const paymentProofStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(process.cwd(), "uploads", "payment-proofs");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
    }
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname);
    cb(null, `proof-${unique}${ext}`);
  },
});

const uploadPaymentProof = multer({
  storage: paymentProofStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("proof");

// Summit/Event registration endpoint
router.post("/api/summit-applications", async (req, res) => {
  try {
    const { fullName, email, phone, country, organization, notes, selectedSummits } = req.body;

    if (!fullName || !email || !phone || !country) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    if (!selectedSummits || !Array.isArray(selectedSummits) || selectedSummits.length === 0) {
      return res.status(400).json({ message: "Select at least one summit" });
    }

    const referenceNumber = `SUMMIT-${Date.now().toString(36).toUpperCase()}`;

    // Save to database
    await db.insert(summitRegistrations).values({
      referenceNumber,
      fullName,
      email,
      phone,
      country,
      organization: organization || null,
      notes: notes || null,
      selectedSummits: selectedSummits,
    });

    const summitNames = selectedSummits.map((s: any) => s?.title || "Event").join(", ");
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const portalLink = `${baseUrl}/summit-portal?ref=${referenceNumber}`;

    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0891b2, #1e40af); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Event Registration Confirmed</h1>
        </div>
        <div style="padding: 30px; background: #fff; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px;">Dear <strong>${fullName}</strong>,</p>
          <p>Thank you for registering for our upcoming summit event(s). Your registration has been received and is confirmed.</p>
          <div style="background-color: #f0fdfa; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #0891b2;">
            <p style="margin: 0 0 8px 0;"><strong>Reference Number:</strong> <span style="font-size: 18px; color: #0891b2;">${referenceNumber}</span></p>
            <p style="margin: 0;"><strong>Events Registered:</strong> ${summitNames}</p>
          </div>
          
          <p style="font-size: 15px; margin-top: 20px;">Please click the links below to download the event fliers, concept notes, and pricing/schedule documents for your reference:</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #e2e8f0;">
            <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
              <li>📄 <a href="${baseUrl}/docs/AI%20TECH%20FORUM%20ZIMBABWE%202026%20-%20SUMMARY.pdf" target="_blank" style="color: #0891b2; text-decoration: none; font-weight: bold;">AI Tech Forum Zimbabwe 2026 - Summary (PDF)</a></li>
              <li>📄 <a href="${baseUrl}/docs/NATIONAL%20AI%20SUMMIT%202026%20-%20SUMMARY.pdf" target="_blank" style="color: #0891b2; text-decoration: none; font-weight: bold;">National AI Summit 2026 - Summary (PDF)</a></li>
              <li>📄 <a href="${baseUrl}/docs/Masvingo%20Summit%20Price%20%26%20schedule%20%202026%20Summits%20pdf%20(3).pdf" target="_blank" style="color: #0891b2; text-decoration: none; font-weight: bold;">Masvingo Summit Price & Schedule (PDF)</a></li>
              <li>🖼️ <a href="${baseUrl}/docs/AI%20TECH%20FORUM%20FLIER.jpeg" target="_blank" style="color: #0891b2; text-decoration: none; font-weight: bold;">AI Tech Forum Flier (JPEG)</a></li>
              <li>🖼️ <a href="${baseUrl}/docs/AI%20FOR%20NATIONAL%20TRANSFORMATION%20FLIER.jpeg" target="_blank" style="color: #0891b2; text-decoration: none; font-weight: bold;">AI for National Transformation Flier (JPEG)</a></li>
            </ul>
          </div>

          <div style="background: #eff6ff; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #1e40af;">
            <p style="margin: 0 0 10px 0;"><strong>Next Step: Complete Your Booking</strong></p>
            <p style="margin: 0 0 15px 0;">Please use your reference number to access the payment portal and generate your invoice:</p>
            <a href="${portalLink}" style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Access Payment Portal →</a>
            <p style="margin: 15px 0 0 0; font-size: 13px; color: #6b7280;">Or visit: ${portalLink}</p>
          </div>
          <p style="margin-top: 30px;">Best regards,<br><strong>AI Institute Africa Team</strong></p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="font-size: 12px; color: #9ca3af;">275 Herbert Chitepo Ave, Harare, Zimbabwe | +263 78 643 4988 | admin@aiinstituteafrica.com</p>
        </div>
      </div>
    `;

    await sendRegistrationEmail({
      to: email,
      subject: "Event Registration Confirmed - AI Institute Africa",
      html: confirmationHtml,
      text: `Event Registration Confirmed\n\nDear ${fullName},\n\nThank you for registering. Reference: ${referenceNumber}\nEvents: ${summitNames}\n\nAccess your payment portal: ${portalLink}`,
      attachments: [],
    });

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0891b2;">New Event Registration</h2>
        <div style="background-color: #f0fdfa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <p><strong>Reference:</strong> ${referenceNumber}</p>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>Organization:</strong> ${organization || "N/A"}</p>
          <p><strong>Notes:</strong> ${notes || "N/A"}</p>
          <p><strong>Events:</strong> ${summitNames}</p>
        </div>
      </div>
    `;

    await sendRegistrationEmail({
      to: "admin@aiinstituteafrica.com",
      subject: `New Event Registration - ${referenceNumber}`,
      html: adminHtml,
      text: `New Registration: ${fullName}, ${email}, Events: ${summitNames}`,
    });

    res.json({
      message: "Registration successful",
      referenceNumber,
    });
  } catch (error) {
    console.error("Error submitting summit application:", error);
    res.status(500).json({ message: "Failed to submit registration" });
  }
});

// GET: Lookup registration by reference number
router.get("/api/summit-portal/:referenceNumber", async (req, res) => {
  try {
    const { referenceNumber } = req.params;
    const [registration] = await db
      .select()
      .from(summitRegistrations)
      .where(eq(summitRegistrations.referenceNumber, referenceNumber))
      .limit(1);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found. Please check your reference number." });
    }

    const [invoice] = await db
      .select()
      .from(summitInvoices)
      .where(eq(summitInvoices.referenceNumber, referenceNumber))
      .limit(1);

    res.json({ registration, invoice: invoice || null });
  } catch (error) {
    console.error("Summit portal lookup error:", error);
    res.status(500).json({ message: "Failed to fetch registration" });
  }
});

// POST: Generate invoice
router.post("/api/summit-portal/:referenceNumber/invoice", async (req, res) => {
  try {
    const { referenceNumber } = req.params;
    const {
      paymentMethod, currency, numberOfDelegates, packageType,
      packageDescription, packagePrice, summitEvent, address,
      secondEventPrice, bothEvents,
    } = req.body;

    const [registration] = await db
      .select()
      .from(summitRegistrations)
      .where(eq(summitRegistrations.referenceNumber, referenceNumber))
      .limit(1);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const numDelegates = parseInt(numberOfDelegates);
    const price1 = parseFloat(packagePrice);
    const price2 = parseFloat(secondEventPrice || "0");
    const pricePerDelegate = bothEvents === true || bothEvents === "true" ? price1 + price2 : price1;
    const totalAmount = (pricePerDelegate * numDelegates).toFixed(2);
    const invoiceNumber = `SN-${Date.now().toString().slice(-6)}`;

    const [invoice] = await db.insert(summitInvoices).values({
      referenceNumber,
      invoiceNumber,
      fullName: registration.fullName,
      organization: registration.organization || null,
      address: address || null,
      email: registration.email,
      phone: registration.phone,
      paymentMethod,
      currency,
      numberOfDelegates: numDelegates,
      packageType,
      packageDescription,
      packagePrice,
      secondEventPrice: price2.toFixed(2),
      bothEvents: bothEvents ? "true" : "false",
      totalAmount,
      summitEvent,
    }).returning();

    res.json({ invoice, message: "Invoice generated successfully" });
  } catch (error) {
    console.error("Invoice generation error:", error);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
});

// POST: Email invoice to user and admin
router.post("/api/summit-portal/:referenceNumber/email-invoice", async (req, res) => {
  try {
    const { referenceNumber } = req.params;
    const { pdfBase64 } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({ message: "PDF data is required" });
    }

    const pdfData = typeof pdfBase64 === "string"
      ? pdfBase64.replace(/^data:[^;]+;base64,/, "").trim()
      : "";

    if (!pdfData) {
      return res.status(400).json({ message: "PDF data is invalid" });
    }

    const [registration] = await db
      .select()
      .from(summitRegistrations)
      .where(eq(summitRegistrations.referenceNumber, referenceNumber))
      .limit(1);

    const [invoice] = await db
      .select()
      .from(summitInvoices)
      .where(eq(summitInvoices.referenceNumber, referenceNumber))
      .limit(1);

    if (!registration || !invoice) {
      return res.status(404).json({ message: "Registration or invoice not found" });
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Summit Payment Invoice</h2>
        <p>Dear ${registration.fullName},</p>
        <p>Your invoice for the upcoming summit has been generated successfully. Please find the PDF invoice attached to this email.</p>
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
          <p><strong>Total Amount:</strong> ${invoice.currency} ${invoice.totalAmount}</p>
        </div>
        <p>Please proceed to make the payment using your selected method and submit the proof of payment through the portal.</p>
        <p>Thank you,<br/>AI Institute Africa</p>
      </div>
    `;

    await sendRegistrationEmail({
      to: registration.email,
      subject: `Your Summit Invoice - ${invoice.invoiceNumber}`,
      html: emailHtml,
      text: `Your Invoice: ${invoice.invoiceNumber}. Total: ${invoice.currency} ${invoice.totalAmount}`,
      attachments: [{
        filename: `Invoice-${invoice.invoiceNumber}.pdf`,
        content: pdfData,
        contentType: "application/pdf"
      }]
    });

    await sendRegistrationEmail({
      to: "admin@aiinstituteafrica.com",
      subject: `New Invoice Generated - ${invoice.invoiceNumber} (${registration.fullName})`,
      html: emailHtml,
      text: `New Invoice: ${invoice.invoiceNumber} for ${registration.fullName}.`,
      attachments: [{
        filename: `Invoice-${invoice.invoiceNumber}.pdf`,
        content: pdfData,
        contentType: "application/pdf"
      }]
    });

    res.json({ message: "Invoice emailed successfully" });
  } catch (error) {
    console.error("Invoice generation error:", error);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
});

// POST: Submit payment proof (with optional file upload)
router.post("/api/summit-portal/:referenceNumber/payment-proof", (req, res) => {
  uploadPaymentProof(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    try {
      const { referenceNumber } = req.params;
      const { payerName, paymentReference, paymentDate, paymentLocation } = req.body;

      const [registration] = await db
        .select()
        .from(summitRegistrations)
        .where(eq(summitRegistrations.referenceNumber, referenceNumber))
        .limit(1);

      if (!registration) return res.status(404).json({ message: "Registration not found" });

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const proofFilePath = req.file ? `/uploads/payment-proofs/${req.file.filename}` : null;
      const proofFileUrl = proofFilePath ? `${baseUrl}${proofFilePath}` : null;

      await db.insert(summitPaymentProofs).values({
        referenceNumber,
        payerName,
        paymentReference,
        paymentDate,
        paymentLocation,
        proofFilePath,
      });

      const attachments = req.file ? [{ filename: req.file.originalname, path: req.file.path }] : [];

      const adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Payment Proof Submitted</h2>
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Reference Number:</strong> ${referenceNumber}</p>
            <p><strong>Registrant:</strong> ${registration.fullName}</p>
            <p><strong>Payer Name/Organization:</strong> ${payerName}</p>
            <p><strong>Payment Reference:</strong> ${paymentReference}</p>
            <p><strong>Payment Date:</strong> ${paymentDate}</p>
            <p><strong>Paid At:</strong> ${paymentLocation}</p>
            ${proofFileUrl ? `<p><strong>Proof of Payment File:</strong> <a href="${proofFileUrl}" target="_blank" style="color: #059669; font-weight: bold; text-decoration: underline;">Click here to download/view file</a></p>` : ""}
          </div>
        </div>
      `;

      await sendRegistrationEmail({
        to: "admin@aiinstituteafrica.com",
        subject: `Payment Proof Submitted - ${referenceNumber} (${registration.fullName})`,
        html: adminHtml,
        text: `Payment proof from ${payerName} for ref ${referenceNumber}. Paid at ${paymentLocation} on ${paymentDate}.`,
        attachments,
      });

      res.json({ message: "Payment proof submitted successfully" });
    } catch (error) {
      console.error("Payment proof error:", error);
      res.status(500).json({ message: "Failed to submit payment proof" });
    }
  });
});

// POST: Submit delegate list
router.post("/api/summit-portal/:referenceNumber/delegates", async (req, res) => {
  try {
    const { referenceNumber } = req.params;
    const { delegates } = req.body;

    if (!delegates || !Array.isArray(delegates) || delegates.length === 0) {
      return res.status(400).json({ message: "Please provide at least one delegate" });
    }

    const [registration] = await db
      .select()
      .from(summitRegistrations)
      .where(eq(summitRegistrations.referenceNumber, referenceNumber))
      .limit(1);

    if (!registration) return res.status(404).json({ message: "Registration not found" });

    await db.insert(summitDelegates).values({
      referenceNumber,
      delegates,
    });

    const delegateRows = delegates.map((name: string, i: number) =>
      `<tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${i + 1}</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${name}</td></tr>`
    ).join("");

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Delegate List Submitted</h2>
        <div style="background: #f5f3ff; padding: 20px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Reference Number:</strong> ${referenceNumber}</p>
          <p><strong>Organization/Registrant:</strong> ${registration.fullName}${registration.organization ? " / " + registration.organization : ""}</p>
          <p><strong>Total Delegates:</strong> ${delegates.length}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <thead>
            <tr style="background: #7c3aed; color: white;">
              <th style="padding: 10px; text-align: left;">#</th>
              <th style="padding: 10px; text-align: left;">Delegate Name</th>
            </tr>
          </thead>
          <tbody>${delegateRows}</tbody>
        </table>
      </div>
    `;

    await sendRegistrationEmail({
      to: "admin@aiinstituteafrica.com",
      subject: `Delegate List Submitted - ${referenceNumber} (${registration.fullName})`,
      html: adminHtml,
      text: `Delegate list from ${registration.fullName} (ref: ${referenceNumber}):\n${delegates.map((n: string, i: number) => `${i + 1}. ${n}`).join("\n")}`,
    });

    res.json({ message: "Delegate list submitted successfully" });
  } catch (error) {
    console.error("Delegate list error:", error);
    res.status(500).json({ message: "Failed to submit delegate list" });
  }
});

// POST: Create new invoice registration (without reference number)
router.post("/api/summit-portal/register-new", async (req, res) => {
  try {
    console.log("[admin] Create registration request body:", req.body);
    const { fullName, email, organization, phone } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ message: "Full name, email, and phone number are required" });
    }

    const referenceNumber = `SUMMIT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const registrationData = {
      referenceNumber,
      fullName,
      email,
      phone,
      organization: organization || null,
      country: "Zimbabwe",
      notes: "Created via admin invoice module",
      status: "registered" as const,
    };

    await db.insert(summitRegistrations).values(registrationData);

    res.status(201).json({
      message: "Registration created successfully",
      referenceNumber,
      registration: registrationData,
    });
  } catch (error) {
    console.error("Registration creation error:", error);
    const message = error instanceof Error ? error.message : "Failed to create registration";
    const payload: any = { message };
    if (process.env.NODE_ENV !== "production" && error instanceof Error) {
      payload.details = error.stack;
    }
    res.status(500).json(payload);
  }
});

// Admin-only: generate a short-lived link token for staff to open the invoice creation UI
router.post("/api/summit-portal/admin/generate-invoice-link", isAdmin, async (req, res) => {
  try {
    const token = Math.random().toString(36).slice(2, 12).toUpperCase();
    const expires = Date.now() + (60 * 60 * 1000); // 1 hour
    const adminId = (req.user as any)?.id;
    adminInvoiceTokenStore.set(token, { expires, createdBy: adminId });

    const link = `/admin/create-invoice?token=${token}`;
    res.json({ link, token, expires });
  } catch (error) {
    console.error("Generate invoice link error:", error);
    res.status(500).json({ message: "Failed to generate admin invoice link" });
  }
});

// Public-facing redirect endpoint: validate token then redirect to frontend admin UI
router.get('/admin/create-invoice/:token?', async (req, res) => {
  try {
    const token = (req.params && (req.params as any).token) || (req.query && String(req.query.token));
    if (!token) return res.status(400).send('Missing token');
    const record = adminInvoiceTokenStore.get(token);
    if (!record || record.expires < Date.now()) {
      return res.status(404).send('Link not found or expired');
    }

    return res.redirect(`/admin/create-invoice?token=${token}`);
  } catch (error) {
    console.error('Admin create-invoice redirect error:', error);
    res.status(500).send('Server error');
  }
});

export default router;
