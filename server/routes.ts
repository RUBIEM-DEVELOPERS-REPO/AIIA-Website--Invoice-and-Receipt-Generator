import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { 
  contacts, 
  newsletters, 
  users, 
  payments, 
  events, 
  articles,
  localArticles, 
  studentLeads,
  programApplications,
  eventCreationSchema, 
  insertArticleSchema,
  insertLocalArticleSchema,
  insertStudentLeadSchema
} from "@db/schema";
import { ZodError } from "zod";
import newsRouter from "./routes/news";
import contactRouter from "./routes/contact";
import chatRouter from "./routes/chat";
import visionRouter from "./routes/vision";
import { setupAuth } from "./auth";
import nodemailer from "nodemailer";
import membershipRouter from "./routes/membership";
import { initiatePayment } from "./services/paynow";
import multer from "multer";
import { verify_document } from "./service";
import path from "path";
import fs from "fs";
import { eq, inArray, sql, asc, desc } from "drizzle-orm";
import { 
  sendRegistrationEmail, 
  generateRegistrationEmailContent,
  generateApplicationConfirmationEmail,
  generateApplicationStatusEmail,
  generateAdminNotificationEmail
} from "./services/email";

// Ensure uploads directory exists and is writable
const uploadsDir = path.join(process.cwd(), "client", "src", "lib", "uploads");
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o755 });
  }
  // Test write permissions
  const testFile = path.join(uploadsDir, '.test-write');
  fs.writeFileSync(testFile, '');
  fs.unlinkSync(testFile);
  console.log('Uploads directory verified:', uploadsDir);
} catch (error) {
  console.error('Error setting up uploads directory:', error);
  throw new Error('Failed to setup uploads directory. Please check permissions.');
}

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Double-check directory exists before writing
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o755 });
    }
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `document-${uniqueSuffix}${ext}`);
  },
});

// Update multer configuration with better error handling
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 4032 * 4032, // Limit file size to 2MB
  },
  fileFilter: (_req, file, cb) => {
    // Check file extension and mime type
    const allowedTypes = ["image/png", "image/jpeg", "image/tiff"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only .png, .jpg and .tiff files are allowed") as any, false);
      return;
    }
    cb(null, true);
  },
}).single('file');

// Configure multer for article images specifically
const articleImagesDir = path.join(process.cwd(), "client", "src", "lib", "articleimages");
const eventImagesDir = path.join(process.cwd(), "client", "src", "lib", "event_images");
const articleImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Ensure directory exists before writing
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
    // Check file extension and mime type
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
    // Ensure directory exists before writing
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
    // Check file extension and mime type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only .png, .jpg, and .webp files are allowed") as any, false);
      return;
    }
    cb(null, true);
  },
}).single('image');

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Setup authentication for regular users
  setupAuth(app);

  // Middleware to check if user has admin level
  const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    console.log("Checking admin auth:", req.isAuthenticated(), req.user);
    
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = req.user as { level?: string, id: number };
    if (user.level !== 'admin') {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }

    next();
  };

  // /api/auth/me endpoint is now handled in auth.ts

  // Register existing routers
  app.use(newsRouter);
  app.use("/api/contact", contactRouter);
  app.use(chatRouter);
  app.use("/api/membership", membershipRouter);
  app.use("/api/vision", visionRouter);

  // Admin routes
  app.get("/api/admin/members", isAdmin, async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.isAuthenticated()) {
        console.log("User not authenticated:", req.user);
        return res.status(401).json({ message: "Unauthorized" });
      }

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

  app.post("/api/admin/members/bulk", isAdmin, async (req: Request, res: Response) => {
    const { memberIds, action } = req.body;

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({ message: "Invalid member IDs" });
    }

    if (!["activate", "deactivate", "delete", "promote", "demote"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    try {
      if (action === "delete") {
        // First delete any related payment records to avoid foreign key constraint violations
        for (const memberId of memberIds) {
          try {
            // Delete payment records for this user
            await db.delete(payments).where(eq(payments.userId, memberId));
            console.log(`Deleted payment records for user ${memberId}`);
          } catch (err) {
            console.log(`No payment records found for user ${memberId} or error:`, err);
            // Continue with the next user
          }
        }
        // Now delete the users
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

  app.get("/api/admin/payments", isAdmin, async (req: Request, res: Response) => {
    try {
      const paymentsList = await db.select().from(payments);
      res.json(paymentsList);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.get("/api/admin/contacts", isAdmin, async (req: Request, res: Response) => {
    try {
      const contactsList = await db.select().from(contacts);
      res.json(contactsList);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.get("/api/admin/dashboard/stats", isAdmin, async (req: Request, res: Response) => {
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

      // Count applications from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [recentApplications] = await db
        .select({ count: sql`count(*)::int` })
        .from(users)
        .where(sql`created_at >= ${thirtyDaysAgo}`);

      // Get the 5 most recent members
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

  // Document verification endpoint with improved error handling
  app.post("/api/verify-document", (req: Request, res: Response) => {
    upload(req, res, async (err) => {
      try {
        if (err instanceof multer.MulterError) {
          console.error('Multer error:', err);
          return res.status(400).json({
            error: err.message,
            isId: false,
            nameMatch: false,
            confidence: "none",
            type: "Free Membership",
          });
        } else if (err) {
          console.error('Upload error:', err);
          return res.status(500).json({
            error: err.message,
            isId: false,
            nameMatch: false,
            confidence: "none",
            type: "Free Membership",
          });
        }

        if (!req.file || !req.body.fullName) {
          console.log("Missing file or full name in request");
          return res.status(400).json({
            error: "Missing file or full name",
            isId: false,
            nameMatch: false,
            confidence: "none",
            type: "Free Membership",
          });
        }

        console.log(`Processing document for ${req.body.fullName}`);
        const result = await verify_document(req.file.path, req.body.fullName);

        console.log("Document Verification Results:", {
          isId: result.isId,
          nameMatch: result.nameMatch,
          confidence: result.confidence,
          membershipType: result.type,
        });

        res.json(result);
      } catch (error) {
        console.error("Document verification error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to verify document";
        res.status(500).json({
          error: errorMessage,
          isId: false,
          nameMatch: false,
          confidence: "none",
          type: "Free Membership",
        });
      } finally {
        // Clean up the uploaded file
        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting uploaded file:", err);
          });
        }
      }
    });
  });

  // Payment and registration endpoint
  app.post("/api/payments", async (req: Request, res: Response) => {
    try {
      console.log("Starting payment/registration process", {
        email: req.body.email,
        planName: req.body.planName,
        membershipType: req.body.planName,
        memberKey: req.body.memberKey,
      });

      const membershipType = req.body.planName;
      const planName = membershipType === "Free Membership" ? "free" : "paid";

      // Import the password utility
      const { hashPassword } = await import("./utils/password");

      // Hash the password before storing it
      const hashedPassword = await hashPassword(req.body.password);

      const [user] = await db
        .insert(users)
        .values({
          email: req.body.email,
          password: hashedPassword,
          name: req.body.fullName,
          organization: req.body.organization || null,
          role: "member",
          level: req.body.level || "user", // Add level field with default
          membershipType: membershipType,
          membershipStatus: "Active",
          membershipStartDate: new Date(),
          membershipEndDate:
            req.body.billingCycle === "yearly"
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          country: req.body.country,
          interests: [],
          membership_key: req.body.memberKey,
        })
        .returning();

      // No need to add to admins table anymore, since we're using the level field


      console.log("User created successfully:", {
        userId: user.id,
        membershipType: user.membershipType,
        membershipKey: user.membership_key,
      });

      // Send registration confirmation email with error handling
      try {
        const emailContent = generateRegistrationEmailContent(
          user.name || '',
          user.membershipType,
          user.membership_key || ''
        );

        const emailSent = await sendRegistrationEmail({
          to: user.email,
          subject: "Welcome to AI Institute Africa - Registration Confirmed",
          html: emailContent.html,
          text: emailContent.text,
        });

        if (!emailSent) {
          console.warn(`Failed to send welcome email to ${user.email}`);
        }
      } catch (emailError) {
        console.error("Failed to send registration email:", emailError);
        // Continue with registration process despite email failure
      }

      const [payment] = await db
        .insert(payments)
        .values({
          userId: user.id, // Using the typescript property name
          amount: req.body.amount || "0",
          currency: "USD",
          status: "Completed",
          paymentMethod: req.body.paymentMethod || "free", // Using camelCase to match TS schema
          billingAddress: `${req.body.address || ''}, ${req.body.city || ''}, ${req.body.country || ''}`,
        })
        .returning();

      console.log("Payment record created:", {
        paymentId: payment.id,
        amount: payment.amount,
      });

      if (req.body.amount === "0") {
        res.json({
          success: true,
          data: {
            user,
            payment,
            memberKey: user.membership_key,
          },
        });
      } else {
        const paymentResponse = await initiatePayment(payment);
        res.json({
          success: true,
          data: {
            user,
            payment,
            pollUrl: paymentResponse.pollUrl,
            paymentRef: paymentResponse.paymentRef,
            memberKey: user.membership_key,
          },
        });
      }
    } catch (error) {
      console.error("Payment/Registration Error:", error);
      if (error instanceof ZodError) {
        res
          .status(400)
          .json({ message: "Invalid form data", errors: error.errors });
      } else {
        res
          .status(500)
          .json({ message: "Failed to process registration/payment" });
      }
    }
  });

  // Contact endpoint
  app.post("/api/contact", async (req: Request, res: Response) => {
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
  app.post("/api/conference/contact", async (req: Request, res: Response) => {
    try {
      const { name, email, subject, message } = req.body;
      
      // Validate required fields
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Import the SMTP2GO email service
      const { sendRegistrationEmail } = await import("./services/email");
      
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
      const emailSent = await sendRegistrationEmail({
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

  // Newsletter endpoint
  app.post("/api/newsletter", async (req: Request, res: Response) => {
    try {
      const newsletter = await db.insert(newsletters).values({
        email: req.body.email,
      });
      res.json({ success: true, data: newsletter });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid email address" });
      } else {
        res.status(500).json({ message: "Failed to subscribe" });
      }
    }
  });

  // Student leads endpoint for March 2026 intake
  app.post("/api/student-leads", async (req: Request, res: Response) => {
    try {
      const leadData = insertStudentLeadSchema.parse(req.body);
      await db.insert(studentLeads).values({
        email: leadData.email,
        phone: leadData.phone,
        courseInterest: leadData.courseInterest,
        educationLevel: leadData.educationLevel || null,
      });
      res.json({ success: true, message: "Thank you for your interest! We will contact you soon." });
    } catch (error) {
      console.error("Error saving student lead:", error);
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid information provided" });
      } else {
        res.status(500).json({ message: "Failed to submit. Please try again." });
      }
    }
  });

  // Applications endpoint
  app.post(
    "/api/applications",
    (req: Request, res: Response, next: NextFunction) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      next();
    },
    async (req: Request, res: Response) => {
      res.json({ message: "Application Received" });
    },
  );

  // Events CRUD operations
  app.get("/api/admin/events", isAdmin, async (req: Request, res: Response) => {
    try {
      const eventsList = await db.select().from(events).orderBy(desc(events.createdAt));
      res.json(eventsList);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/admin/events/:id", isAdmin, async (req: Request, res: Response) => {
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

  app.post("/api/admin/events", isAdmin, async (req: Request, res: Response) => {
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

  app.put("/api/admin/events/:id", isAdmin, async (req: Request, res: Response) => {
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

  app.delete("/api/admin/events/:id", isAdmin, async (req: Request, res: Response) => {
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

  // Articles CRUD operations
  app.get("/api/admin/articles", isAdmin, async (req: Request, res: Response) => {
    try {
      const articlesList = await db.select().from(articles).orderBy(desc(articles.createdAt));
      res.json(articlesList);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/admin/articles/:id", isAdmin, async (req: Request, res: Response) => {
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

  app.post("/api/admin/articles", isAdmin, async (req: Request, res: Response) => {
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

  app.put("/api/admin/articles/:id", isAdmin, async (req: Request, res: Response) => {
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

  app.delete("/api/admin/articles/:id", isAdmin, async (req: Request, res: Response) => {
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

  // Public API endpoints for events and articles
  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const allEvents = await db.select().from(events)
        .where(eq(events.status, "Upcoming"))
        .orderBy(asc(events.date));
      res.json(allEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/articles", async (req: Request, res: Response) => {
    try {
      const allArticles = await db.select().from(articles)
        .orderBy(desc(articles.createdAt));
      res.json(allArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });
  
  // Local Articles endpoints
  app.get("/api/local-articles", async (req: Request, res: Response) => {
    try {
      const allLocalArticles = await db.select().from(localArticles)
        .orderBy(desc(localArticles.createdAt));
      res.json(allLocalArticles);
    } catch (error) {
      console.error("Error fetching local articles:", error);
      res.status(500).json({ message: "Failed to fetch local articles" });
    }
  });

  app.get("/api/local-articles/:id", async (req: Request, res: Response) => {
    try {
      const articleId = parseInt(req.params.id);
      const article = await db.select().from(localArticles).where(eq(localArticles.id, articleId)).limit(1);
      
      if (article.length === 0) {
        return res.status(404).json({ message: "Local article not found" });
      }
      
      res.json(article[0]);
    } catch (error) {
      console.error("Error fetching local article:", error);
      res.status(500).json({ message: "Failed to fetch local article" });
    }
  });
  
  // Event image upload endpoint
  app.post("/api/admin/event-image-upload", isAdmin, (req: Request, res: Response) => {
    uploadEventImage(req, res, async (err) => {
      try {
        if (err instanceof multer.MulterError) {
          console.error('Multer error:', err);
          return res.status(400).json({
            error: err.message,
            success: false
          });
        } else if (err) {
          console.error('Upload error:', err);
          return res.status(500).json({
            error: err.message,
            success: false
          });
        }

        if (!req.file) {
          console.log("Missing file in request");
          return res.status(400).json({
            error: "Missing file",
            success: false
          });
        }

        // Return the path to the uploaded image relative to the public directory
        const imagePath = `/lib/event_images/${path.basename(req.file.path)}`;
        console.log("Event image uploaded successfully:", imagePath);

        res.json({
          success: true,
          imagePath: imagePath
        });
      } catch (error) {
        console.error("Event image upload error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
        res.status(500).json({
          error: errorMessage,
          success: false
        });
      }
    });
  });

  // Admin Local Articles endpoints
  app.get("/api/admin/local-articles", isAdmin, async (req: Request, res: Response) => {
    try {
      const allLocalArticles = await db.select().from(localArticles)
        .orderBy(desc(localArticles.createdAt));
      res.json(allLocalArticles);
    } catch (error) {
      console.error("Error fetching local articles in admin:", error);
      res.status(500).json({ message: "Failed to fetch local articles" });
    }
  });
  
  // Upload article image endpoint
  app.post("/api/admin/article-image-upload", isAdmin, (req: Request, res: Response) => {
    uploadArticleImage(req, res, async (err) => {
      try {
        if (err instanceof multer.MulterError) {
          console.error('Multer error:', err);
          return res.status(400).json({
            error: err.message,
            success: false
          });
        } else if (err) {
          console.error('Upload error:', err);
          return res.status(500).json({
            error: err.message,
            success: false
          });
        }

        if (!req.file) {
          console.log("Missing file in request");
          return res.status(400).json({
            error: "Missing file",
            success: false
          });
        }

        // Return the path to the uploaded image relative to the public directory
        const imagePath = `/lib/articleimages/${path.basename(req.file.path)}`;
        console.log("Article image uploaded successfully:", imagePath);

        res.json({
          success: true,
          imagePath: imagePath
        });
      } catch (error) {
        console.error("Article image upload error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
        res.status(500).json({
          error: errorMessage,
          success: false
        });
      }
    });
  });

  app.get("/api/admin/local-articles/:id", isAdmin, async (req: Request, res: Response) => {
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

  app.post("/api/admin/local-articles", isAdmin, async (req: Request, res: Response) => {
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

  app.put("/api/admin/local-articles/:id", isAdmin, async (req: Request, res: Response) => {
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

  app.delete("/api/admin/local-articles/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const articleId = parseInt(req.params.id);
      const result = await db.delete(localArticles)
        .where(eq(localArticles.id, articleId))
        .returning();
      
      if (result.length === 0) {
        return res.status(404).json({ message: "Local article not found" });
      }
      
      res.json({ message: "Local article deleted successfully" });
    } catch (error) {
      console.error("Error deleting local article:", error);
      res.status(500).json({ message: "Failed to delete local article" });
    }
  });

  // Configure multer for application documents - stored in server/uploads for proper serving
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

  // Serve application documents statically
  app.use("/uploads/applications", express.static(applicationDocsDir));

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

  // Generate unique reference number
  function generateReferenceNumber(): string {
    const prefix = "AIIA";
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${year}-${random}`;
  }

  // Program application submission endpoint
  app.post("/api/program-applications", (req: Request, res: Response) => {
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
        // For IOBZ, firstName/lastName are sent directly; for other corporate, use contactFirstName/contactLastName
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

        // Save to database
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

        // Map program IDs to human-readable names
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

        // Send confirmation email to applicant
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

        // Update email sent status
        if (emailSent) {
          await db.update(programApplications)
            .set({ emailSent: true })
            .where(eq(programApplications.id, application.id));
        }

        // Send notification to admin(s)
        const adminEmail = generateAdminNotificationEmail(
          applicantFirstName,
          applicantLastName,
          referenceNumber,
          email,
          programNames,
          position || null,
          isCorporate ? (organizationName || bankOrganisation) : null
        );

        // Check if any IOBZ program is selected
        const isIobzProgram = programs.some((p: string) => 
          p.toLowerCase().includes('iobz') || p === 'iobz_applied'
        );

        // Determine recipients based on program type
        const adminRecipients = isIobzProgram 
          ? ["admin@aiinstituteafrica.com", "marvellous@iobz.co.zw", "patiencemupikeni@gmail.com", "blessingisheanesu65@gmail.com"]
          : ["admin@aiinstituteafrica.com"];

        // Prepare attachment if document was uploaded
        const emailAttachments = uploadedFile ? [{
          filename: uploadedFile.originalname,
          path: uploadedFile.path,
        }] : [];

        // Send to all recipients with document attachment
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

  // Admin: Get all program applications
  app.get("/api/admin/program-applications", isAdmin, async (_req: Request, res: Response) => {
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

  // Admin: Get single application
  app.get("/api/admin/program-applications/:id", isAdmin, async (req: Request, res: Response) => {
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

  // Admin: Update application status (accept/reject)
  app.patch("/api/admin/program-applications/:id", isAdmin, async (req: Request, res: Response) => {
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

      // Update the application
      const [updated] = await db.update(programApplications)
        .set({
          status,
          adminNotes,
          reviewedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(programApplications.id, applicationId))
        .returning();

      // Send status email if accepted or rejected
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

  // Marketing email endpoint
  app.post("/api/admin/marketing-email", isAdmin, async (req: Request, res: Response) => {
    try {
      const { subject, message, htmlContent } = req.body;

      if (!subject || !message) {
        return res.status(400).json({ message: "Subject and message are required" });
      }

      // Get all active registered users with valid emails
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

      // Send emails to all registered users
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

  // Summit/Event registration endpoint
  app.post("/api/summit-applications", async (req: Request, res: Response) => {
    try {
      const { fullName, email, phone, country, organization, notes, selectedSummits } = req.body;

      if (!fullName || !email || !phone || !country) {
        return res.status(400).json({ message: "All required fields must be filled" });
      }

      if (!selectedSummits || !Array.isArray(selectedSummits) || selectedSummits.length === 0) {
        return res.status(400).json({ message: "Select at least one summit" });
      }

      const referenceNumber = `SUMMIT-${Date.now().toString(36).toUpperCase()}`;

      // Format summit names for email
      const summitNames = selectedSummits.map((s: any) => s?.title || "Event").join(", ");

      // Send confirmation email to applicant
      const confirmationHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2;">Event Registration Confirmed</h2>
          <p>Dear ${fullName},</p>
          <p>Thank you for registering for our upcoming event(s). Your registration has been received.</p>
          <div style="background-color: #f0fdfa; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #0891b2;">
            <p style="margin: 0 0 10px 0;"><strong>Reference Number:</strong> ${referenceNumber}</p>
            <p style="margin: 0;"><strong>Events Registered:</strong> ${summitNames}</p>
          </div>
          <p>We will send you more details as the event date approaches.</p>
          <p style="margin-top: 30px;">Best regards,<br><strong>AI Institute Africa Team</strong></p>
        </div>
      `;

      await sendRegistrationEmail({
        to: email,
        subject: "Event Registration Confirmed - AI Institute Africa",
        html: confirmationHtml,
        text: `Event Registration Confirmed\n\nDear ${fullName},\n\nThank you for registering. Reference: ${referenceNumber}\nEvents: ${summitNames}`,
      });

      // Send notification to admin
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

  return httpServer;
}