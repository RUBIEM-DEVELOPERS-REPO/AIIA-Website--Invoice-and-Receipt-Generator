import { Router } from "express";
import { db } from "@db";
import {
  programApplications,
  applicationDocuments,
  applicationTimeline,
  refereeRequests,
  users,
} from "@db/schema";
import { eq, desc, asc, sql } from "drizzle-orm";
import { sendRegistrationEmail, generateApplicationConfirmationEmail, generateAdminNotificationEmail } from "../services/email";
import multer from "multer";
import path from "path";
import fs from "fs";
import OpenAI from "openai";

const router = Router();

const openaiClient = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

// Configure multer for application documents
const applicationDocsDir = path.join(process.cwd(), "uploads", "applications");
if (!fs.existsSync(applicationDocsDir)) {
  fs.mkdirSync(applicationDocsDir, { recursive: true, mode: 0o755 });
}

const applicationDocStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(applicationDocsDir)) {
      fs.mkdirSync(applicationDocsDir, { recursive: true, mode: 0o755 });
    }
    cb(null, applicationDocsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `application-${uniqueSuffix}${ext}`);
  },
});

const uploadApplicationDoc = multer({
  storage: applicationDocStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "image/png", "image/jpeg", "image/jpg", 
      "application/pdf", 
      "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only PDF, PNG, JPG, Word, Excel, and CSV files are allowed") as any, false);
      return;
    }
    cb(null, true);
  },
}).any();

// Multer for applicant tracking and referee document uploads
const applicantDocsStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(process.cwd(), "uploads", "applicant-docs");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
    }
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname);
    cb(null, `doc-${unique}${ext}`);
  },
});

const uploadApplicantDoc = multer({
  storage: applicantDocsStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
}).single("file");

// Unique reference generator
function generateReferenceNumber(): string {
  const prefix = "AIIA";
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${year}-${random}`;
}

// Program application submission endpoint
router.post("/api/program-applications", (req, res) => {
  uploadApplicationDoc(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(400).json({ message: err.message || "File upload failed" });
    }

    try {
      const { 
        trainingType,
        firstName, lastName, email, graduateStatus, 
        organizationName, contactFirstName, contactLastName, numberOfAttendees,
        phone, position, bankOrganisation,
        selectedProgramIds 
      } = req.body;

      const isCorporate = trainingType === "corporate";
      const applicantFirstName = isCorporate ? (contactFirstName || firstName) : firstName;
      const applicantLastName = isCorporate ? (contactLastName || lastName) : lastName;
      const applicantEmail = email;

      if (!applicantFirstName || !applicantLastName || !applicantEmail || !selectedProgramIds) {
        return res.status(400).json({ message: "All required fields must be filled" });
      }

      if (!isCorporate && !graduateStatus) {
        return res.status(400).json({ message: "Graduate status is required" });
      }

      let programs;
      try {
        programs = JSON.parse(selectedProgramIds);
      } catch {
        return res.status(400).json({ message: "Invalid program selection format" });
      }

      if (!Array.isArray(programs) || programs.length === 0) {
        return res.status(400).json({ message: "Select at least one program" });
      }

      const referenceNumber = generateReferenceNumber();
      const files = req.files as Express.Multer.File[] | undefined;
      const uploadedFile = files && files.length > 0 ? files[0] : null;
      const documentPath = uploadedFile ? `/uploads/applications/${uploadedFile.filename}` : null;

      const [application] = await db.insert(programApplications).values({
        referenceNumber,
        firstName: applicantFirstName,
        lastName: applicantLastName,
        email: applicantEmail,
        phone: phone || null,
        graduateStatus: isCorporate ? null : graduateStatus,
        trainingType: trainingType || "individual",
        organizationName: isCorporate ? organizationName : null,
        numberOfAttendees: isCorporate && numberOfAttendees ? parseInt(numberOfAttendees) : null,
        selectedPrograms: programs,
        documentPath,
        status: "pending",
        emailSent: false,
      }).returning();

      const programNameMap: Record<string, string> = {
        "iobz_applied": "IoBZ AI Training for Bankers",
        "gradcert": "Graduate AI Certificate Program",
        "nongrad": "Non-Graduate AI Certificate",
        "basic": "Basic AI Certification",
        "advanced": "Advanced AI Certification",
        "postgrad": "Postgrad AI Diploma Program",
        "aidip": "AI Diploma Program",
        "dir": "Master AI for Directors",
        "exec": "Master AI for Executives",
        "prof": "Master AI for Professionals",
      };

      const programObjects = programs.map((p: string) => ({ name: programNameMap[p] || p }));
      const programNames = programs.map((p: string) => programNameMap[p] || p);

      const confirmationEmail = generateApplicationConfirmationEmail(
        applicantFirstName,
        applicantLastName,
        referenceNumber,
        programObjects
      );

      const emailSent = await sendRegistrationEmail({
        to: email,
        subject: "Application Received - AI Institute Africa",
        html: confirmationEmail.html,
        text: confirmationEmail.text,
      });

      if (emailSent) {
        await db.update(programApplications)
          .set({ emailSent: true })
          .where(eq(programApplications.id, application.id));
      }

      const adminEmail = generateAdminNotificationEmail(
        applicantFirstName,
        applicantLastName,
        referenceNumber,
        email,
        programNames,
        position || null,
        isCorporate ? (organizationName || bankOrganisation) : null
      );

      const isIobzProgram = programs.some((p: string) => 
        p.toLowerCase().includes('iobz') || p === 'iobz_applied'
      );

      const adminRecipients = isIobzProgram 
        ? ["admin@aiinstituteafrica.com", "marvellous@iobz.co.zw", "patiencemupikeni@gmail.com", "blessingisheanesu65@gmail.com"]
        : ["admin@aiinstituteafrica.com"];

      const emailAttachments = uploadedFile ? [{
        filename: uploadedFile.originalname,
        path: uploadedFile.path,
      }] : [];

      for (const recipient of adminRecipients) {
        await sendRegistrationEmail({
          to: recipient,
          subject: `New Program Application - ${referenceNumber}`,
          html: adminEmail.html,
          text: adminEmail.text,
          attachments: emailAttachments,
        });
      }

      res.status(201).json({
        message: "Application submitted successfully",
        referenceNumber,
        emailSent,
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      res.status(500).json({ message: "Failed to submit application" });
    }
  });
});

// GET /api/track/:ref — fetch application, documents, and timeline
router.get("/api/track/:referenceNumber", async (req, res) => {
  const { referenceNumber } = req.params;
  try {
    const [application] = await db
      .select()
      .from(programApplications)
      .where(eq(programApplications.referenceNumber, referenceNumber));

    if (!application) {
      return res.status(404).json({ message: "Application not found. Please check your reference number." });
    }

    const documents = await db
      .select()
      .from(applicationDocuments)
      .where(eq(applicationDocuments.referenceNumber, referenceNumber))
      .orderBy(desc(applicationDocuments.uploadedAt));

    const timeline = await db
      .select()
      .from(applicationTimeline)
      .where(eq(applicationTimeline.referenceNumber, referenceNumber))
      .orderBy(asc(applicationTimeline.createdAt));

    if (timeline.length === 0) {
      await db.insert(applicationTimeline).values({
        referenceNumber,
        status: "submitted",
        note: "Application successfully submitted.",
        updatedBy: "system",
        createdAt: application.createdAt,
      });
      timeline.push({
        id: 0,
        referenceNumber,
        status: "submitted",
        note: "Application successfully submitted.",
        updatedBy: "system",
        createdAt: application.createdAt,
      });
    }

    res.json({
      application: {
        referenceNumber: application.referenceNumber,
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        trainingType: application.trainingType,
        selectedPrograms: application.selectedPrograms,
        status: application.status,
        adminNotes: application.adminNotes,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
      },
      documents,
      timeline,
    });
  } catch (err) {
    console.error("Track application error:", err);
    res.status(500).json({ message: "Failed to retrieve application" });
  }
});

// POST /api/track/:ref/documents — upload a document
router.post("/api/track/:referenceNumber/documents", (req, res) => {
  const { referenceNumber } = req.params;

  uploadApplicantDoc(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message || "Upload failed" });
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    try {
      const [application] = await db
        .select({ id: programApplications.id })
        .from(programApplications)
        .where(eq(programApplications.referenceNumber, referenceNumber));

      if (!application) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: "Application not found" });
      }

      const category = (req.body.category as string) || "Other";
      const [doc] = await db.insert(applicationDocuments).values({
        referenceNumber,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        filePath: req.file.path,
        category,
      }).returning();

      await db.insert(applicationTimeline).values({
        referenceNumber,
        status: "document_uploaded",
        note: `Document uploaded: ${req.file.originalname}`,
        updatedBy: "applicant",
      });

      res.json({ message: "File uploaded successfully", document: doc });
    } catch (error) {
      console.error("Document upload error:", error);
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ message: "Failed to save document" });
    }
  });
});

// DELETE /api/track/:ref/documents/:id — remove a document
router.delete("/api/track/:referenceNumber/documents/:docId", async (req, res) => {
  const { referenceNumber, docId } = req.params;
  try {
    const [doc] = await db
      .select()
      .from(applicationDocuments)
      .where(eq(applicationDocuments.id, parseInt(docId)));

    if (!doc || doc.referenceNumber !== referenceNumber) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (fs.existsSync(doc.filePath)) fs.unlinkSync(doc.filePath);
    await db.delete(applicationDocuments).where(eq(applicationDocuments.id, parseInt(docId)));

    res.json({ message: "Document removed" });
  } catch (err) {
    console.error("Delete doc error:", err);
    res.status(500).json({ message: "Failed to delete document" });
  }
});

// GET /api/track/:ref/documents/:id/download — download a document
router.get("/api/track/:referenceNumber/documents/:docId/download", async (req, res) => {
  const { referenceNumber, docId } = req.params;
  try {
    const [doc] = await db
      .select()
      .from(applicationDocuments)
      .where(eq(applicationDocuments.id, parseInt(docId)));

    if (!doc || doc.referenceNumber !== referenceNumber) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (!fs.existsSync(doc.filePath)) {
      return res.status(404).json({ message: "File no longer available" });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${doc.originalName}"`);
    res.setHeader("Content-Type", doc.mimeType);
    res.sendFile(path.resolve(doc.filePath));
  } catch (err) {
    res.status(500).json({ message: "Download failed" });
  }
});

// GET /api/track/:ref/cohort — anonymised cohort members for accepted applicants
router.get("/api/track/:referenceNumber/cohort", async (req, res) => {
  const { referenceNumber } = req.params;
  try {
    const [application] = await db.select().from(programApplications).where(eq(programApplications.referenceNumber, referenceNumber));
    if (!application) return res.status(404).json({ message: "Application not found" });
    if (application.status !== "accepted") return res.status(403).json({ message: "Cohort is only available once your application is accepted." });

    const programs = application.selectedPrograms as any[];
    const programIds = programs.map((p: any) => p.id);

    const all = await db.select({
      referenceNumber: programApplications.referenceNumber,
      firstName: programApplications.firstName,
      trainingType: programApplications.trainingType,
      selectedPrograms: programApplications.selectedPrograms,
      createdAt: programApplications.createdAt,
    }).from(programApplications).where(eq(programApplications.status, "accepted"));

    const cohort = all
      .filter((m) => m.referenceNumber !== referenceNumber)
      .filter((m) => {
        const mProgIds = (m.selectedPrograms as any[]).map((p: any) => p.id);
        return programIds.some((id) => mProgIds.includes(id));
      })
      .map((m) => ({
        initial: m.firstName ? m.firstName[0].toUpperCase() + "." : "?",
        trainingType: m.trainingType,
        programs: (m.selectedPrograms as any[]).map((p: any) => p.name),
        enrolledMonth: new Date(m.createdAt).toLocaleString("en-US", { month: "long", year: "numeric" }),
      }));

    res.json({ cohort, total: cohort.length });
  } catch (err) {
    console.error("Cohort error:", err);
    res.status(500).json({ message: "Failed to load cohort" });
  }
});

// POST /api/track/:ref/documents/:docId/analyze — AI document checker
router.post("/api/track/:referenceNumber/documents/:docId/analyze", async (req, res) => {
  const { referenceNumber, docId } = req.params;
  try {
    const [doc] = await db.select().from(applicationDocuments).where(eq(applicationDocuments.id, parseInt(docId)));
    if (!doc || doc.referenceNumber !== referenceNumber) return res.status(404).json({ message: "Document not found" });

    let analysis = "";
    const isImage = doc.mimeType.startsWith("image/");

    if (isImage && fs.existsSync(doc.filePath)) {
      const base64 = fs.readFileSync(doc.filePath).toString("base64");
      const result = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: `You are reviewing a document submitted for an AI training program application. The applicant labelled this document as: "${doc.category}". Please assess: 1) What type of document this appears to be, 2) Whether it is legible and appears valid, 3) Any issues or recommendations. Be concise (2-4 sentences). Start with "✓" if acceptable or "⚠" if there are concerns.` },
            { type: "image_url", image_url: { url: `data:${doc.mimeType};base64,${base64}` } },
          ],
        }],
        max_tokens: 200,
      });
      analysis = result.choices[0]?.message?.content || "Unable to analyze.";
    } else {
      const sizeMB = (doc.fileSize / (1024 * 1024)).toFixed(2);
      const result = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [{
          role: "user",
          content: `You are reviewing a document for an AI training program application. Details — Filename: "${doc.originalName}", File type: ${doc.mimeType}, Size: ${sizeMB} MB, Category: "${doc.category}". Based on this metadata, provide a brief assessment (2-3 sentences) of whether this seems like the right document type for the stated category, and any recommendations. Start with "✓" if it seems appropriate or "⚠" if there are concerns.`,
        }],
        max_tokens: 150,
      });
      analysis = result.choices[0]?.message?.content || "Unable to analyze.";
    }

    res.json({ analysis, documentName: doc.originalName, category: doc.category });
  } catch (err) {
    console.error("AI analyzer error:", err);
    res.status(500).json({ message: "AI analysis failed. Please try again." });
  }
});

// GET /api/track/:ref/referee-requests — list referee requests
router.get("/api/track/:referenceNumber/referee-requests", async (req, res) => {
  const { referenceNumber } = req.params;
  try {
    const requests = await db.select().from(refereeRequests).where(eq(refereeRequests.referenceNumber, referenceNumber));
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to load referee requests" });
  }
});

// POST /api/track/:ref/referee-request — invite a referee
router.post("/api/track/:referenceNumber/referee-request", async (req, res) => {
  const { referenceNumber } = req.params;
  const { refereeName, refereeEmail } = req.body;
  if (!refereeName || !refereeEmail) return res.status(400).json({ message: "Referee name and email are required" });

  try {
    const [application] = await db.select({ firstName: programApplications.firstName, lastName: programApplications.lastName }).from(programApplications).where(eq(programApplications.referenceNumber, referenceNumber));
    if (!application) return res.status(404).json({ message: "Application not found" });

    const token = require("crypto").randomBytes(24).toString("hex");
    const [request] = await db.insert(refereeRequests).values({ referenceNumber, refereeName, refereeEmail, uniqueToken: token }).returning();

    const uploadUrl = `https://${process.env.REPLIT_DEV_DOMAIN || "aiinstituteafrica.com"}/referee/${token}`;
    await sendRegistrationEmail({
      to: refereeEmail,
      subject: `Reference Letter Request from ${application.firstName} ${application.lastName} — AI Institute Africa`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#0891b2;">Reference Letter Request</h2>
          <p>Dear <strong>${refereeName}</strong>,</p>
          <p><strong>${application.firstName} ${application.lastName}</strong> has applied to the AI Institute Africa training program and listed you as a referee.</p>
          <p>Please click the button below to submit your reference letter (any file type is accepted):</p>
          <div style="text-align:center;margin:30px 0;">
            <a href="${uploadUrl}" style="background:#0891b2;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Submit Reference Letter</a>
          </div>
          <p style="color:#666;font-size:13px;">This link is unique to you. Please do not share it. The applicant will be notified once you submit.</p>
          <p style="color:#666;font-size:12px;">AI Institute Africa · admin@aiinstituteafrica.com</p>
        </div>`,
      text: `Reference request from ${application.firstName} ${application.lastName}. Upload at: ${uploadUrl}`,
    });

    await db.insert(applicationTimeline).values({ referenceNumber, status: "referee_invited", note: `Reference letter requested from ${refereeName} (${refereeEmail})`, updatedBy: "applicant" });

    res.json({ message: "Invitation sent successfully", request });
  } catch (err) {
    console.error("Referee request error:", err);
    res.status(500).json({ message: "Failed to send referee invitation" });
  }
});

// GET /api/referee/:token — referee views their upload page
router.get("/api/referee/:token", async (req, res) => {
  try {
    const [request] = await db.select().from(refereeRequests).where(eq(refereeRequests.uniqueToken, req.params.token));
    if (!request) return res.status(404).json({ message: "Invalid or expired link" });
    const [app] = await db.select({ firstName: programApplications.firstName, lastName: programApplications.lastName }).from(programApplications).where(eq(programApplications.referenceNumber, request.referenceNumber));
    res.json({ refereeName: request.refereeName, applicantName: app ? `${app.firstName} ${app.lastName}` : "the applicant", status: request.status });
  } catch (err) {
    res.status(500).json({ message: "Failed to view referee page" });
  }
});

// POST /api/referee/:token/submit — referee uploads reference letter
router.post("/api/referee/:token/submit", (req, res) => {
  uploadApplicantDoc(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    try {
      const [request] = await db.select().from(refereeRequests).where(eq(refereeRequests.uniqueToken, req.params.token));
      if (!request) { fs.unlinkSync(req.file.path); return res.status(404).json({ message: "Invalid or expired link" }); }
      if (request.status === "received") { fs.unlinkSync(req.file.path); return res.status(400).json({ message: "A reference letter has already been submitted for this request" }); }

      const [doc] = await db.insert(applicationDocuments).values({
        referenceNumber: request.referenceNumber,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        filePath: req.file.path,
        category: "Reference Letter",
      }).returning();

      await db.update(refereeRequests).set({ status: "received", documentId: doc.id }).where(eq(refereeRequests.uniqueToken, req.params.token));
      await db.insert(applicationTimeline).values({ referenceNumber: request.referenceNumber, status: "referee_submitted", note: `Reference letter received from ${request.refereeName}`, updatedBy: "referee" });

      res.json({ message: "Reference letter submitted successfully. Thank you!" });
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ message: "Submission failed" });
    }
  });
});

// PATCH /api/crm/applications/:ref — CRM updates application status
router.patch("/api/crm/applications/:referenceNumber", async (req, res) => {
  const crmKey = req.headers["x-crm-api-key"] || req.query.crm_key;
  if (!crmKey || crmKey !== process.env.CRM_API_KEY) {
    return res.status(401).json({ error: "Unauthorized: invalid CRM API key" });
  }

  const { referenceNumber } = req.params;
  const { status, adminNotes, updatedBy } = req.body;

  const validStatuses = ["pending", "under_review", "accepted", "rejected"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
  }

  try {
    const [application] = await db
      .select()
      .from(programApplications)
      .where(eq(programApplications.referenceNumber, referenceNumber));

    if (!application) return res.status(404).json({ error: "Application not found" });

    const updateData: any = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    await db.update(programApplications).set(updateData).where(eq(programApplications.referenceNumber, referenceNumber));

    if (status && status !== application.status) {
      await db.insert(applicationTimeline).values({
        referenceNumber,
        status,
        note: adminNotes || `Status updated to ${status}`,
        updatedBy: updatedBy || "CRM System",
      });
    }

    res.json({ success: true, referenceNumber, status: status || application.status });
  } catch (err) {
    console.error("CRM update error:", err);
    res.status(500).json({ error: "Failed to update application" });
  }
});

export default router;
