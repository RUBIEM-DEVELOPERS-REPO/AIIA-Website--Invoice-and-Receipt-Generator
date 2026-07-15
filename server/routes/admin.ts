import { Router } from "express";
import { db } from "@db";
import {
  users,
  payments,
  contacts,
  summitRegistrations,
  events,
  articles,
  localArticles,
  programApplications,
  eventCreationSchema,
  insertArticleSchema,
  insertLocalArticleSchema,
} from "@db/schema";
import { eq, inArray, sql, desc } from "drizzle-orm";
import { ZodError } from "zod";
import { isAdmin } from "../middleware/auth";
import { sendRegistrationEmail, generateApplicationStatusEmail } from "../services/email";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Configure multer for article images specifically
const articleImagesDir = path.join(process.cwd(), "client", "src", "lib", "articleimages");
const eventImagesDir = path.join(process.cwd(), "client", "src", "lib", "event_images");

const articleImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(articleImagesDir)) {
      fs.mkdirSync(articleImagesDir, { recursive: true, mode: 0o755 });
    }
    cb(null, articleImagesDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `article-${uniqueSuffix}${ext}`);
  },
});

const uploadArticleImage = multer({
  storage: articleImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB for article images
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only .png, .jpg, and .webp files are allowed") as any, false);
      return;
    }
    cb(null, true);
  },
}).single('image');

// Configure multer for event images
const eventImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(eventImagesDir)) {
      fs.mkdirSync(eventImagesDir, { recursive: true, mode: 0o755 });
    }
    cb(null, eventImagesDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `event-${uniqueSuffix}${ext}`);
  },
});

const uploadEventImage = multer({
  storage: eventImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB for event images
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only .png, .jpg, and .webp files are allowed") as any, false);
      return;
    }
    cb(null, true);
  },
}).single('image');

// Member Management
router.get("/api/admin/members", isAdmin, async (req, res) => {
  try {
    const members = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        membershipType: users.membershipType,
        membershipStatus: users.membershipStatus,
        level: users.level,
        organization: users.organization,
        country: users.country,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(users.createdAt);

    console.log("Fetched members:", members.length);
    res.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Failed to fetch members" });
  }
});

router.post("/api/admin/members/bulk", isAdmin, async (req, res) => {
  const { memberIds, action } = req.body;

  if (!Array.isArray(memberIds) || memberIds.length === 0) {
    return res.status(400).json({ message: "Invalid member IDs" });
  }

  if (!["activate", "deactivate", "delete", "promote", "demote"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  try {
    if (action === "delete") {
      for (const memberId of memberIds) {
        try {
          await db.delete(payments).where(eq(payments.userId, memberId));
          console.log(`Deleted payment records for user ${memberId}`);
        } catch (err) {
          console.log(`No payment records found for user ${memberId} or error:`, err);
        }
      }
      await db.delete(users).where(inArray(users.id, memberIds));
    } else if (action === "promote" || action === "demote") {
      await db
        .update(users)
        .set({
          level: action === "promote" ? "admin" : "user",
          updatedAt: new Date(),
        })
        .where(inArray(users.id, memberIds));
    } else {
      await db
        .update(users)
        .set({
          membershipStatus: action === "activate" ? "Active" : "Inactive",
          updatedAt: new Date(),
        })
        .where(inArray(users.id, memberIds));
    }

    res.json({ message: "Bulk operation completed successfully" });
  } catch (error) {
    console.error("Error performing bulk operation:", error);
    res.status(500).json({ message: "Failed to perform bulk operation" });
  }
});

// Payments & Contacts lists
router.get("/api/admin/payments", isAdmin, async (req, res) => {
  try {
    const paymentsList = await db.select().from(payments);
    res.json(paymentsList);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

router.get("/api/admin/contacts", isAdmin, async (req, res) => {
  try {
    const contactsList = await db.select().from(contacts);
    res.json(contactsList);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
});

router.get("/api/admin/summit-registrations", isAdmin, async (req, res) => {
  try {
    const registrations = await db.select().from(summitRegistrations).orderBy(desc(summitRegistrations.createdAt));
    res.json(registrations);
  } catch (error) {
    console.error("Error fetching summit registrations:", error);
    res.status(500).json({ message: "Failed to fetch summit registrations" });
  }
});

router.get("/api/admin/dashboard/stats", isAdmin, async (req, res) => {
  try {
    const [totalMembers] = await db
      .select({ count: sql`count(*)::int` })
      .from(users);

    const [activeMembers] = await db
      .select({ count: sql`count(*)::int` })
      .from(users)
      .where(eq(users.membershipStatus, "Active"));

    const [pendingMembers] = await db
      .select({ count: sql`count(*)::int` })
      .from(users)
      .where(eq(users.membershipStatus, "Pending"));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [recentApplications] = await db
      .select({ count: sql`count(*)::int` })
      .from(users)
      .where(sql`created_at >= ${thirtyDaysAgo}`);

    const recentMembers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        membershipType: users.membershipType,
        membershipStatus: users.membershipStatus,
        level: users.level,
        organization: users.organization,
        country: users.country,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(sql`created_at DESC`)
      .limit(5);

    res.json({
      totalMembers: totalMembers?.count || 0,
      activeMembers: activeMembers?.count || 0,
      pendingMembers: pendingMembers?.count || 0,
      recentApplications: recentApplications?.count || 0,
      recentMembers,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard statistics" });
  }
});

// Events CRUD
router.get("/api/admin/events", isAdmin, async (req, res) => {
  try {
    const eventsList = await db.select().from(events).orderBy(desc(events.createdAt));
    res.json(eventsList);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

router.get("/api/admin/events/:id", isAdmin, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    
    if (event.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.json(event[0]);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Failed to fetch event" });
  }
});

router.post("/api/admin/events", isAdmin, async (req, res) => {
  try {
    const eventData = eventCreationSchema.parse(req.body);
    const result = await db.insert(events).values({
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      location: eventData.location,
      type: eventData.type,
      capacity: eventData.capacity || null,
      registrationRequired: eventData.registrationRequired,
      registrationUrl: eventData.registrationUrl || null,
      imageUrl: eventData.imageUrl || null,
      organizer: eventData.organizer,
      status: eventData.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error creating event:", error);
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create event" });
  }
});

router.put("/api/admin/events/:id", isAdmin, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const eventData = eventCreationSchema.parse(req.body);
    
    const result = await db.update(events)
      .set({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        location: eventData.location,
        type: eventData.type,
        capacity: eventData.capacity || null,
        registrationRequired: eventData.registrationRequired,
        registrationUrl: eventData.registrationUrl || null,
        imageUrl: eventData.imageUrl || null,
        organizer: eventData.organizer,
        status: eventData.status,
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId))
      .returning();
    
    if (result.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error("Error updating event:", error);
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to update event" });
  }
});

router.delete("/api/admin/events/:id", isAdmin, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const result = await db.delete(events).where(eq(events.id, eventId)).returning();
    
    if (result.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event" });
  }
});

// Articles CRUD
router.get("/api/admin/articles", isAdmin, async (req, res) => {
  try {
    const articlesList = await db.select().from(articles).orderBy(desc(articles.createdAt));
    res.json(articlesList);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
});

router.get("/api/admin/articles/:id", isAdmin, async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const article = await db.select().from(articles).where(eq(articles.id, articleId)).limit(1);
    
    if (article.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    res.json(article[0]);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Failed to fetch article" });
  }
});

router.post("/api/admin/articles", isAdmin, async (req, res) => {
  try {
    const articleData = insertArticleSchema.parse(req.body);
    const result = await db.insert(articles).values({
      title: articleData.title,
      author: articleData.author,
      content: articleData.content,
      imageUrl: articleData.imageUrl || null,
      requirement: articleData.requirement || "Free",
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error creating article:", error);
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create article" });
  }
});

router.put("/api/admin/articles/:id", isAdmin, async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const articleData = insertArticleSchema.parse(req.body);
    
    const result = await db.update(articles)
      .set({
        title: articleData.title,
        author: articleData.author,
        content: articleData.content,
        imageUrl: articleData.imageUrl || null,
        requirement: articleData.requirement || "Free",
        updatedAt: new Date(),
      })
      .where(eq(articles.id, articleId))
      .returning();
    
    if (result.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error("Error updating article:", error);
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to update article" });
  }
});

router.delete("/api/admin/articles/:id", isAdmin, async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const result = await db.delete(articles).where(eq(articles.id, articleId)).returning();
    
    if (result.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Failed to delete article" });
  }
});

// Image Uploads for Events and Articles
router.post("/api/admin/event-image-upload", isAdmin, (req, res) => {
  uploadEventImage(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: err.message, success: false });
      } else if (err) {
        console.error('Upload error:', err);
        return res.status(500).json({ error: err.message, success: false });
      }

      if (!req.file) {
        console.log("Missing file in request");
        return res.status(400).json({ error: "Missing file", success: false });
      }

      const imagePath = `/lib/event_images/${path.basename(req.file.path)}`;
      console.log("Event image uploaded successfully:", imagePath);

      res.json({ success: true, imagePath });
    } catch (error) {
      console.error("Event image upload error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to upload image", success: false });
    }
  });
});

router.post("/api/admin/article-image-upload", isAdmin, (req, res) => {
  uploadArticleImage(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: err.message, success: false });
      } else if (err) {
        console.error('Upload error:', err);
        return res.status(500).json({ error: err.message, success: false });
      }

      if (!req.file) {
        console.log("Missing file in request");
        return res.status(400).json({ error: "Missing file", success: false });
      }

      const imagePath = `/lib/articleimages/${path.basename(req.file.path)}`;
      console.log("Article image uploaded successfully:", imagePath);

      res.json({ success: true, imagePath });
    } catch (error) {
      console.error("Article image upload error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to upload image", success: false });
    }
  });
});

// Local Articles CRUD
router.get("/api/admin/local-articles", isAdmin, async (req, res) => {
  try {
    const allLocalArticles = await db.select().from(localArticles).orderBy(desc(localArticles.createdAt));
    res.json(allLocalArticles);
  } catch (error) {
    console.error("Error fetching local articles in admin:", error);
    res.status(500).json({ message: "Failed to fetch local articles" });
  }
});

router.get("/api/admin/local-articles/:id", isAdmin, async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const article = await db.select().from(localArticles).where(eq(localArticles.id, articleId)).limit(1);
    
    if (article.length === 0) {
      return res.status(404).json({ message: "Local article not found" });
    }
    
    res.json(article[0]);
  } catch (error) {
    console.error("Error fetching local article in admin:", error);
    res.status(500).json({ message: "Failed to fetch local article" });
  }
});

router.post("/api/admin/local-articles", isAdmin, async (req, res) => {
  try {
    const articleData = insertLocalArticleSchema.parse(req.body);
    const result = await db.insert(localArticles).values({
      title: articleData.title,
      author: articleData.author,
      content: articleData.content,
      imageUrl: articleData.imageUrl,
      requirement: articleData.requirement || "Free",
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error creating local article:", error);
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create local article" });
  }
});

router.put("/api/admin/local-articles/:id", isAdmin, async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const articleData = insertLocalArticleSchema.parse(req.body);
    
    const result = await db.update(localArticles)
      .set({
        title: articleData.title,
        author: articleData.author,
        content: articleData.content,
        imageUrl: articleData.imageUrl,
        requirement: articleData.requirement || "Free",
        updatedAt: new Date(),
      })
      .where(eq(localArticles.id, articleId))
      .returning();
    
    if (result.length === 0) {
      return res.status(404).json({ message: "Local article not found" });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error("Error updating local article:", error);
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to update local article" });
  }
});

router.delete("/api/admin/local-articles/:id", isAdmin, async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const result = await db.delete(localArticles).where(eq(localArticles.id, articleId)).returning();
    
    if (result.length === 0) {
      return res.status(404).json({ message: "Local article not found" });
    }
    
    res.json({ message: "Local article deleted successfully" });
  } catch (error) {
    console.error("Error deleting local article:", error);
    res.status(500).json({ message: "Failed to delete local article" });
  }
});

// Program Applications Review
router.get("/api/admin/program-applications", isAdmin, async (_req, res) => {
  try {
    const applications = await db.select()
      .from(programApplications)
      .orderBy(desc(programApplications.createdAt));
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

router.get("/api/admin/program-applications/:id", isAdmin, async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    const [application] = await db.select()
      .from(programApplications)
      .where(eq(programApplications.id, applicationId));

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "Failed to fetch application" });
  }
});

router.get("/api/admin/program-applications/:id/documents", isAdmin, async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    const [application] = await db.select()
      .from(programApplications)
      .where(eq(programApplications.id, applicationId));

    if (!application) return res.status(404).json({ message: "Application not found" });

    const refNum = (application as any).referenceNumber;
    if (!refNum) return res.json({ documents: [], referenceNumber: null });

    const documents = await db.execute(
      sql`SELECT id, reference_number, original_name, category, mime_type, file_size, file_path, created_at
          FROM application_documents WHERE reference_number = ${refNum} ORDER BY created_at DESC`
    );

    const docsWithUrls = (documents.rows as any[]).map((d: any) => ({
      id: d.id,
      originalName: d.original_name,
      category: d.category,
      mimeType: d.mime_type,
      fileSize: Number(d.file_size),
      createdAt: d.created_at,
      downloadUrl: `/api/track/${refNum}/documents/${d.id}/download`,
    }));

    res.json({ documents: docsWithUrls, referenceNumber: refNum });
  } catch (error) {
    console.error("Error fetching tracking documents:", error);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
});

router.patch("/api/admin/program-applications/:id", isAdmin, async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    const { status, adminNotes } = req.body;

    if (!["pending", "under_review", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [application] = await db.select()
      .from(programApplications)
      .where(eq(programApplications.id, applicationId));

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const [updated] = await db.update(programApplications)
      .set({
        status,
        adminNotes,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(programApplications.id, applicationId))
      .returning();

    if (status === "accepted" || status === "rejected") {
      const statusEmail = generateApplicationStatusEmail(
        application.firstName,
        application.lastName,
        application.referenceNumber,
        status,
        adminNotes
      );

      await sendRegistrationEmail({
        to: application.email,
        subject: `Application ${status === "accepted" ? "Accepted" : "Update"} - AI Institute Africa`,
        html: statusEmail.html,
        text: statusEmail.text,
      });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Failed to update application" });
  }
});

// Marketing Emails
router.post("/api/admin/marketing-email", isAdmin, async (req, res) => {
  try {
    const { subject, message, htmlContent } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    const registeredUsers = await db
      .select({ email: users.email, name: users.name })
      .from(users)
      .where(eq(users.isActive, true));

    if (registeredUsers.length === 0) {
      return res.status(404).json({ message: "No registered users found" });
    }

    const emailResults = {
      total: registeredUsers.length,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const user of registeredUsers) {
      try {
        const personalizedMessage = message.replace(/{name}/g, user.name || 'Valued Member');
        const personalizedHtml = htmlContent 
          ? htmlContent.replace(/{name}/g, user.name || 'Valued Member')
          : `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e40af;">Hello ${user.name || 'Valued Member'},</h2>
              <div style="margin: 20px 0; line-height: 1.6;">
                ${personalizedMessage.replace(/\n/g, '<br>')}
              </div>
              <hr style="border: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="color: #6b7280; font-size: 14px;">
                Best regards,<br>
                AI Institute Africa Team
              </p>
            </div>
          `;

        const emailSent = await sendRegistrationEmail({
          to: user.email,
          subject: subject,
          text: personalizedMessage,
          html: personalizedHtml,
        });

        if (emailSent) {
          emailResults.successful++;
        } else {
          emailResults.failed++;
          emailResults.errors.push(`Failed to send to ${user.email}`);
        }
      } catch (emailError) {
        console.error(`Error sending email to ${user.email}:`, emailError);
        emailResults.failed++;
        emailResults.errors.push(`Error sending to ${user.email}: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`);
      }
    }

    res.json({
      message: `Marketing email sent to ${emailResults.successful} out of ${emailResults.total} users`,
      results: emailResults
    });
  } catch (error) {
    console.error("Error sending marketing emails:", error);
    res.status(500).json({ message: "Failed to send marketing emails" });
  }
});

export default router;
