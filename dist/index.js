var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  admins: () => admins,
  applicationDocuments: () => applicationDocuments,
  applicationTimeline: () => applicationTimeline,
  articles: () => articles,
  contacts: () => contacts,
  eventCreationSchema: () => eventCreationSchema,
  events: () => events,
  insertAdminSchema: () => insertAdminSchema,
  insertArticleSchema: () => insertArticleSchema,
  insertContactSchema: () => insertContactSchema,
  insertEventSchema: () => insertEventSchema,
  insertLocalArticleSchema: () => insertLocalArticleSchema,
  insertNewsletterSchema: () => insertNewsletterSchema,
  insertPaymentSchema: () => insertPaymentSchema,
  insertProgramApplicationSchema: () => insertProgramApplicationSchema,
  insertStudentLeadSchema: () => insertStudentLeadSchema,
  insertSummitRegistrationSchema: () => insertSummitRegistrationSchema,
  insertUserSchema: () => insertUserSchema,
  localArticles: () => localArticles,
  membershipCount: () => membershipCount,
  newsletters: () => newsletters,
  pageVisits: () => pageVisits,
  paymentProcessSchema: () => paymentProcessSchema,
  payments: () => payments,
  programApplications: () => programApplications,
  refereeRequests: () => refereeRequests,
  selectAdminSchema: () => selectAdminSchema,
  selectArticleSchema: () => selectArticleSchema,
  selectContactSchema: () => selectContactSchema,
  selectEventSchema: () => selectEventSchema,
  selectLocalArticleSchema: () => selectLocalArticleSchema,
  selectNewsletterSchema: () => selectNewsletterSchema,
  selectPaymentSchema: () => selectPaymentSchema,
  selectProgramApplicationSchema: () => selectProgramApplicationSchema,
  selectStudentLeadSchema: () => selectStudentLeadSchema,
  selectSummitRegistrationSchema: () => selectSummitRegistrationSchema,
  selectUserSchema: () => selectUserSchema,
  studentLeads: () => studentLeads,
  summitDelegates: () => summitDelegates,
  summitInvoices: () => summitInvoices,
  summitPaymentProofs: () => summitPaymentProofs,
  summitRegistrations: () => summitRegistrations,
  userRegistrationSchema: () => userRegistrationSchema,
  users: () => users
});
import { pgTable, text, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
var contacts, newsletters, membershipCount, articles, localArticles, events, users, payments, admins, studentLeads, programApplications, summitRegistrations, applicationDocuments, applicationTimeline, refereeRequests, pageVisits, summitInvoices, summitPaymentProofs, summitDelegates, insertSummitRegistrationSchema, selectSummitRegistrationSchema, insertContactSchema, selectContactSchema, insertNewsletterSchema, selectNewsletterSchema, insertUserSchema, selectUserSchema, insertPaymentSchema, selectPaymentSchema, insertEventSchema, selectEventSchema, insertArticleSchema, selectArticleSchema, insertLocalArticleSchema, selectLocalArticleSchema, insertAdminSchema, selectAdminSchema, insertStudentLeadSchema, selectStudentLeadSchema, insertProgramApplicationSchema, selectProgramApplicationSchema, userRegistrationSchema, paymentProcessSchema, eventCreationSchema;
var init_schema = __esm({
  "db/schema.ts"() {
    "use strict";
    contacts = pgTable("contacts", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      email: text("email").notNull(),
      subject: text("subject").notNull(),
      message: text("message").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    newsletters = pgTable("newsletters", {
      id: serial("id").primaryKey(),
      email: text("email").unique().notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    membershipCount = pgTable("membership_count", {
      id: serial("id").primaryKey(),
      count: integer("count").notNull().default(0),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    articles = pgTable("articles", {
      id: serial("id").primaryKey(),
      title: text("title").notNull(),
      author: text("author").notNull(),
      content: text("content").notNull(),
      imageUrl: text("image_url"),
      requirement: text("requirement", {
        enum: ["Free", "Membership"]
      }).notNull().default("Free"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    localArticles = pgTable("local_articles", {
      id: serial("id").primaryKey(),
      title: text("title").notNull(),
      author: text("author").notNull(),
      content: text("content").notNull(),
      imageUrl: text("image_url").notNull(),
      requirement: text("requirement", {
        enum: ["Free", "Membership"]
      }).notNull().default("Free"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    events = pgTable("events", {
      id: serial("id").primaryKey(),
      title: text("title").notNull(),
      description: text("description").notNull(),
      date: timestamp("date").notNull(),
      location: text("location").notNull(),
      type: text("type", {
        enum: ["Conference", "Workshop", "Webinar", "Meetup", "Other"]
      }).notNull(),
      capacity: integer("capacity"),
      registrationRequired: boolean("registration_required").default(false),
      registrationUrl: text("registration_url"),
      imageUrl: text("image_url"),
      organizer: text("organizer").notNull(),
      status: text("status", {
        enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"]
      }).notNull().default("Upcoming"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      email: text("email").unique().notNull(),
      password: text("password").notNull(),
      name: text("name").notNull(),
      membershipType: text("membership_type", {
        enum: ["Free", "Student", "Full", "Fellow", "Institution"]
      }).notNull().default("Free"),
      membershipStatus: text("membership_status", {
        enum: ["Active", "Inactive", "Pending", "Expired"]
      }).notNull().default("Pending"),
      membershipStartDate: timestamp("membership_start_date"),
      membershipEndDate: timestamp("membership_end_date"),
      organization: text("organization"),
      companyName: text("company_name"),
      companyNumber: text("company_number"),
      contactPerson: text("contact_person"),
      role: text("role"),
      level: text("level", {
        enum: ["admin", "user"]
      }).notNull().default("user"),
      interests: text("interests").array(),
      country: text("country"),
      membership_key: text("membership_key").unique(),
      isActive: boolean("is_active").default(true).notNull(),
      resetToken: text("reset_token").unique(),
      resetTokenExpiry: timestamp("reset_token_expiry"),
      lastLoginAt: timestamp("last_login_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    payments = pgTable("payments", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull().references(() => users.id),
      amount: text("amount").notNull(),
      currency: text("currency").notNull().default("USD"),
      status: text("status", {
        enum: ["Pending", "Completed", "Failed", "Refunded"]
      }).notNull().default("Pending"),
      paymentMethod: text("payment_method"),
      billingAddress: text("billing_address"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    admins = pgTable("admins", {
      id: serial("id").primaryKey(),
      username: text("username").unique().notNull(),
      password: text("password").notNull(),
      fullName: text("full_name").notNull(),
      role: text("role", {
        enum: ["super_admin", "content_admin", "member_admin"]
      }).notNull().default("content_admin"),
      isActive: boolean("is_active").default(true),
      resetToken: text("reset_token").unique(),
      resetTokenExpiry: timestamp("reset_token_expiry"),
      lastLoginAt: timestamp("last_login_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    studentLeads = pgTable("student_leads", {
      id: serial("id").primaryKey(),
      email: text("email").notNull(),
      phone: text("phone").notNull(),
      courseInterest: text("course_interest", {
        enum: ["3_day", "6_month", "12_month"]
      }).notNull(),
      educationLevel: text("education_level"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    programApplications = pgTable("program_applications", {
      id: serial("id").primaryKey(),
      referenceNumber: text("reference_number").unique().notNull(),
      trainingType: text("training_type", {
        enum: ["individual", "corporate"]
      }).notNull().default("individual"),
      firstName: text("first_name").notNull(),
      lastName: text("last_name").notNull(),
      email: text("email").notNull(),
      phone: text("phone"),
      graduateStatus: text("graduate_status", {
        enum: ["graduate", "non_graduate"]
      }),
      organizationName: text("organization_name"),
      numberOfAttendees: integer("number_of_attendees"),
      selectedPrograms: jsonb("selected_programs").notNull(),
      documentPath: text("document_path"),
      status: text("status", {
        enum: ["pending", "under_review", "accepted", "rejected"]
      }).notNull().default("pending"),
      adminNotes: text("admin_notes"),
      reviewedBy: integer("reviewed_by").references(() => admins.id),
      reviewedAt: timestamp("reviewed_at"),
      emailSent: boolean("email_sent").default(false),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    summitRegistrations = pgTable("summit_registrations", {
      id: serial("id").primaryKey(),
      referenceNumber: text("reference_number").unique().notNull(),
      fullName: text("full_name").notNull(),
      email: text("email").notNull(),
      phone: text("phone").notNull(),
      country: text("country").notNull(),
      organization: text("organization"),
      notes: text("notes"),
      selectedSummits: jsonb("selected_summits").default([]).notNull(),
      status: text("status", {
        enum: ["registered", "confirmed", "attended", "cancelled"]
      }).notNull().default("registered"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    applicationDocuments = pgTable("application_documents", {
      id: serial("id").primaryKey(),
      referenceNumber: text("reference_number").notNull(),
      fileName: text("file_name").notNull(),
      originalName: text("original_name").notNull(),
      mimeType: text("mime_type").notNull(),
      fileSize: integer("file_size").notNull(),
      filePath: text("file_path").notNull(),
      category: text("category").notNull().default("Other"),
      uploadedAt: timestamp("uploaded_at").defaultNow().notNull()
    });
    applicationTimeline = pgTable("application_timeline", {
      id: serial("id").primaryKey(),
      referenceNumber: text("reference_number").notNull(),
      status: text("status").notNull(),
      note: text("note"),
      updatedBy: text("updated_by").notNull().default("system"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    refereeRequests = pgTable("referee_requests", {
      id: serial("id").primaryKey(),
      referenceNumber: text("reference_number").notNull(),
      refereeName: text("referee_name").notNull(),
      refereeEmail: text("referee_email").notNull(),
      uniqueToken: text("unique_token").unique().notNull(),
      status: text("status").notNull().default("pending"),
      documentId: integer("document_id"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    pageVisits = pgTable("page_visits", {
      id: serial("id").primaryKey(),
      path: text("path").notNull(),
      ip: text("ip").notNull(),
      userAgent: text("user_agent"),
      referer: text("referer"),
      visitedAt: timestamp("visited_at").defaultNow().notNull()
    });
    summitInvoices = pgTable("summit_invoices", {
      id: serial("id").primaryKey(),
      referenceNumber: text("reference_number").notNull(),
      invoiceNumber: text("invoice_number").unique().notNull(),
      fullName: text("full_name").notNull(),
      organization: text("organization"),
      address: text("address"),
      email: text("email").notNull(),
      phone: text("phone"),
      paymentMethod: text("payment_method").notNull(),
      currency: text("currency").notNull().default("USD"),
      numberOfDelegates: integer("number_of_delegates").notNull(),
      packageType: text("package_type").notNull(),
      packageDescription: text("package_description").notNull(),
      packagePrice: text("package_price").notNull(),
      secondEventPrice: text("second_event_price").default("0"),
      bothEvents: text("both_events").default("false"),
      totalAmount: text("total_amount").notNull(),
      summitEvent: text("summit_event").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    summitPaymentProofs = pgTable("summit_payment_proofs", {
      id: serial("id").primaryKey(),
      referenceNumber: text("reference_number").notNull(),
      payerName: text("payer_name").notNull(),
      paymentReference: text("payment_reference").notNull(),
      paymentDate: text("payment_date").notNull(),
      paymentLocation: text("payment_location").notNull(),
      proofFilePath: text("proof_file_path"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    summitDelegates = pgTable("summit_delegates", {
      id: serial("id").primaryKey(),
      referenceNumber: text("reference_number").notNull(),
      delegates: jsonb("delegates").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertSummitRegistrationSchema = createInsertSchema(summitRegistrations);
    selectSummitRegistrationSchema = createSelectSchema(summitRegistrations);
    insertContactSchema = createInsertSchema(contacts);
    selectContactSchema = createSelectSchema(contacts);
    insertNewsletterSchema = createInsertSchema(newsletters);
    selectNewsletterSchema = createSelectSchema(newsletters);
    insertUserSchema = createInsertSchema(users);
    selectUserSchema = createSelectSchema(users);
    insertPaymentSchema = createInsertSchema(payments);
    selectPaymentSchema = createSelectSchema(payments);
    insertEventSchema = createInsertSchema(events);
    selectEventSchema = createSelectSchema(events);
    insertArticleSchema = createInsertSchema(articles);
    selectArticleSchema = createSelectSchema(articles);
    insertLocalArticleSchema = createInsertSchema(localArticles);
    selectLocalArticleSchema = createSelectSchema(localArticles);
    insertAdminSchema = createInsertSchema(admins, {
      username: z.string().min(3, "Username must be at least 3 characters"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      fullName: z.string().min(2, "Full name must be at least 2 characters"),
      role: z.enum(["super_admin", "content_admin", "member_admin"])
    });
    selectAdminSchema = createSelectSchema(admins);
    insertStudentLeadSchema = createInsertSchema(studentLeads, {
      email: z.string().email("Invalid email address"),
      phone: z.string().min(5, "Phone number is required"),
      courseInterest: z.enum(["3_day", "6_month", "12_month"]),
      educationLevel: z.string().optional()
    });
    selectStudentLeadSchema = createSelectSchema(studentLeads);
    insertProgramApplicationSchema = createInsertSchema(programApplications, {
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Invalid email address"),
      trainingType: z.enum(["individual", "corporate"]).optional(),
      graduateStatus: z.enum(["graduate", "non_graduate"]).nullable().optional(),
      phone: z.string().optional().nullable(),
      organizationName: z.string().optional().nullable(),
      numberOfAttendees: z.number().optional().nullable(),
      selectedPrograms: z.array(z.object({
        id: z.string(),
        name: z.string(),
        category: z.string().optional()
      })).min(1, "Select at least one program")
    });
    selectProgramApplicationSchema = createSelectSchema(programApplications);
    userRegistrationSchema = z.object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      name: z.string().min(2, "Name must be at least 2 characters"),
      membershipType: z.enum(["Free", "Student", "Full", "Fellow", "Institution"]),
      organization: z.string().optional(),
      companyName: z.string().optional(),
      companyNumber: z.string().optional(),
      contactPerson: z.string().optional(),
      role: z.string().optional(),
      level: z.enum(["admin", "user"]).default("user"),
      interests: z.array(z.string()).optional(),
      country: z.string().optional()
    });
    paymentProcessSchema = z.object({
      userId: z.number(),
      amount: z.string(),
      currency: z.string().default("USD"),
      paymentMethod: z.string(),
      billingAddress: z.string()
    });
    eventCreationSchema = z.object({
      title: z.string().min(3, "Title must be at least 3 characters"),
      description: z.string().min(10, "Description must be at least 10 characters"),
      date: z.string().transform((str) => new Date(str)),
      location: z.string(),
      type: z.enum(["Conference", "Workshop", "Webinar", "Meetup", "Other"]),
      capacity: z.number().optional(),
      registrationRequired: z.boolean().default(false),
      // Accept regular URLs or allow empty string
      registrationUrl: z.union([
        z.string().url(),
        z.string().max(0)
      ]).optional(),
      // Accept regular URLs, local file paths, or empty string
      imageUrl: z.union([
        z.string().url(),
        z.string().startsWith("/"),
        z.string().max(0)
      ]).optional(),
      organizer: z.string(),
      status: z.enum(["Upcoming", "Ongoing", "Completed", "Cancelled"]).default("Upcoming")
    });
  }
});

// db/index.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
var pool, db;
var init_db = __esm({
  "db/index.ts"() {
    "use strict";
    init_schema();
    neonConfig.webSocketConstructor = ws;
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 1e4,
      idleTimeoutMillis: 6e4,
      max: 10
    });
    pool.on("error", (err) => {
      console.error("Unexpected error on idle database client:", err.message);
    });
    db = drizzle(pool, { schema: schema_exports });
  }
});

// server/services/email.ts
var email_exports = {};
__export(email_exports, {
  generateAdminNotificationEmail: () => generateAdminNotificationEmail,
  generateApplicationConfirmationEmail: () => generateApplicationConfirmationEmail,
  generateApplicationStatusEmail: () => generateApplicationStatusEmail,
  generatePasswordResetEmailContent: () => generatePasswordResetEmailContent,
  generateRegistrationEmailContent: () => generateRegistrationEmailContent,
  sendPasswordResetEmail: () => sendPasswordResetEmail,
  sendRegistrationEmail: () => sendRegistrationEmail
});
import axios from "axios";
import fs from "fs";
import nodemailer from "nodemailer";
async function sendRegistrationEmail(params) {
  try {
    const sendpulseApiKey = process.env.SENDPULSE_API_KEY;
    const sendpulseClientId = process.env.SENDPULSE_CLIENT_ID;
    const sendpulseClientSecret = process.env.SENDPULSE_CLIENT_SECRET;
    const smtp2goApiKey = process.env.SMTP2GO_API_KEY;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "2525", 10);
    const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
    const smtpUser = process.env.SMTP_USER || process.env.SMTP2GO_USERNAME;
    const smtpPass = process.env.SMTP_PASS || process.env.SMTP2GO_PASSWORD;
    const senderEmail = process.env.SMTP_FROM || process.env.SMTP2GO_FROM_EMAIL || "admin@aiinstituteafrica.com";
    const logoUrl = process.env.LOGO_URL;
    let htmlContent = params.html || params.text || "";
    if (logoUrl) {
      htmlContent = htmlContent.replace(/cid:preloader/g, logoUrl);
    }
    const allAttachments = [
      { filename: "preloader.png", path: logoImage, cid: "preloader" },
      ...params.attachments || []
    ];
    let accessToken = sendpulseApiKey;
    if (!accessToken && sendpulseClientId && sendpulseClientSecret) {
      const tokenResponse = await emailHttpClient.post(
        "https://api.sendpulse.com/oauth/access_token",
        {
          grant_type: "client_credentials",
          client_id: sendpulseClientId,
          client_secret: sendpulseClientSecret
        }
      );
      accessToken = tokenResponse.data?.access_token;
    }
    if (accessToken) {
      const attachmentsBinary = {};
      for (const att of allAttachments) {
        if (att.cid === "preloader" && logoUrl) {
          continue;
        }
        try {
          let fileData = "";
          if (Buffer.isBuffer(att.content)) {
            fileData = att.content.toString("base64");
          } else if (typeof att.content === "string") {
            fileData = att.content.replace(/^data:[^;]+;base64,/, "");
          } else if (att.path) {
            fileData = fs.readFileSync(att.path).toString("base64");
          }
          if (fileData) {
            attachmentsBinary[att.filename] = fileData;
          }
        } catch (err) {
          console.warn(`Could not process attachment for SendPulse: ${att.filename}`, err);
        }
      }
      const emailPayload = {
        email: {
          html: htmlContent,
          text: params.text || "",
          subject: params.subject,
          from: {
            name: "AI Institute Africa",
            email: senderEmail
          },
          to: [{ name: "", email: params.to }]
        }
      };
      if (params.bcc) {
        emailPayload.email.bcc = [{ email: params.bcc }];
      }
      if (Object.keys(attachmentsBinary).length > 0) {
        emailPayload.email.attachments_binary = attachmentsBinary;
      }
      const response = await emailHttpClient.post(
        "https://api.sendpulse.com/smtp/emails",
        emailPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      if (response.data?.is_error || response.data?.error_code) {
        throw new Error(`SendPulse Send Error: ${JSON.stringify(response.data)}`);
      }
      console.log("Email sent successfully via SendPulse REST API:", response.data);
      return true;
    }
    if (smtp2goApiKey) {
      const inlines = [];
      const attachments = [];
      for (const att of allAttachments) {
        try {
          let fileblob = "";
          let mimetype = "application/octet-stream";
          if (att.filename.endsWith(".png")) mimetype = "image/png";
          else if (att.filename.endsWith(".jpg") || att.filename.endsWith(".jpeg")) mimetype = "image/jpeg";
          else if (att.filename.endsWith(".pdf")) mimetype = "application/pdf";
          if (att.content) {
            fileblob = typeof att.content === "string" ? att.content.replace(/^data:[^;]+;base64,/, "") : Buffer.isBuffer(att.content) ? att.content.toString("base64") : "";
          } else if (att.path) {
            fileblob = fs.readFileSync(att.path).toString("base64");
          }
          if (!fileblob) continue;
          const item = { filename: att.filename, fileblob, mimetype };
          if (att.cid) {
            item.cid = att.cid;
            inlines.push(item);
          } else {
            attachments.push(item);
          }
        } catch (err) {
          console.warn(`Could not process attachment for SMTP2GO: ${att.filename}`, err);
        }
      }
      const payload = {
        api_key: smtp2goApiKey,
        to: [params.to],
        sender: `AI Institute Africa <${senderEmail}>`,
        subject: params.subject,
        text_body: params.text || "",
        html_body: htmlContent
      };
      if (params.bcc) {
        payload.bcc = [params.bcc];
      }
      if (attachments.length > 0) payload.attachments = attachments;
      if (inlines.length > 0) payload.inlines = inlines;
      const response = await emailHttpClient.post(
        "https://api.smtp2go.com/v3/email/send",
        payload
      );
      if (response.data?.data?.error || response.data?.data?.failures?.length > 0) {
        throw new Error(`SMTP2GO API Error: ${JSON.stringify(response.data)}`);
      }
      console.log("Email sent successfully via SMTP2GO:", response.data?.data?.email_id || "success");
      return true;
    }
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass
        },
        connectionTimeout: 15e3,
        greetingTimeout: 15e3,
        socketTimeout: 15e3
      });
      await transporter.verify();
      const mailAttachments = [];
      for (const att of allAttachments) {
        try {
          let content;
          if (att.content) {
            content = typeof att.content === "string" ? Buffer.from(att.content.replace(/^data:[^;]+;base64,/, ""), "base64") : att.content;
          } else if (att.path) {
            content = fs.readFileSync(att.path);
          }
          if (!content) continue;
          mailAttachments.push({
            filename: att.filename,
            content,
            cid: att.cid
          });
        } catch (err) {
          console.warn(`Could not attach file to SMTP email: ${att.filename}`, err);
        }
      }
      await transporter.sendMail({
        from: {
          name: "AI Institute Africa",
          address: senderEmail
        },
        to: params.to,
        bcc: params.bcc,
        subject: params.subject,
        text: params.text || "",
        html: htmlContent,
        attachments: mailAttachments
      });
      console.log("Email sent successfully via SMTP:", params.to);
      return true;
    }
    console.error("No email provider configured");
    return false;
  } catch (error) {
    console.error("Email send error:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    if (axios.isAxiosError(error) && error.response) {
      console.error("Email provider response:", error.response.data);
    }
    return false;
  }
}
function generateRegistrationEmailContent(name, membershipType, memberKey) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="cid:preloader" alt="AI Institute Africa Logo" style="max-width: 100%; height: auto;" />
      <h2>Welcome to AI Institute Africa!</h2>
      <p>Dear ${name},</p>
      <p>Thank you for registering with AI Institute Africa. Your membership has been successfully activated.</p>
      <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <p style="margin: 0;"><strong>Membership Type:</strong> ${membershipType}</p>
        <p style="margin: 10px 0 0 0;"><strong>Your Membership Key:</strong> ${memberKey}</p>
      </div>
      <p>Please keep your membership key safe as it will be required for future reference.</p>
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>AI Institute Africa Team</p>
    </div>
  `;
  const text2 = `
Welcome to AI Institute Africa!

Dear ${name},

Thank you for registering with AI Institute Africa. Your membership has been successfully activated.

Membership Type: ${membershipType}
Your Membership Key: ${memberKey}

Please keep your membership key safe as it will be required for future reference.

If you have any questions or need assistance, please don't hesitate to contact our support team.

Best regards,
AI Institute Africa Team
  `;
  return { html, text: text2 };
}
function generatePasswordResetEmailContent(name, resetToken, resetUrl) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="cid:preloader" alt="AI Institute Africa Logo" style="max-width: 100%; height: auto;" />
      <h2>Password Reset Request</h2>
      <p>Dear ${name},</p>
      <p>We received a request to reset your password for your AI Institute Africa account.</p>
      <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <p style="margin: 10px 0 0 0;">Click the button below to reset your password. This link will expire in 1 hour.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
        </div>
        <p style="margin: 10px 0 0 0;">If you did not request a password reset, please ignore this email or contact our support team if you have concerns.</p>
      </div>
      <p>Best regards,<br>AI Institute Africa Team</p>
    </div>
  `;
  const text2 = `
Password Reset Request

Dear ${name},

We received a request to reset your password for your AI Institute Africa account.

To reset your password, please visit the following link (expires in 1 hour):
${resetUrl}

If you did not request a password reset, please ignore this email or contact our support team if you have concerns.

Best regards,
AI Institute Africa Team
  `;
  return { html, text: text2 };
}
async function sendPasswordResetEmail(params) {
  return sendRegistrationEmail(params);
}
function generateApplicationConfirmationEmail(firstName, lastName, referenceNumber, selectedPrograms) {
  const programList = selectedPrograms.map((p) => `<li>${p.name}${p.category ? ` (${p.category})` : ""}</li>`).join("");
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="cid:preloader" alt="AI Institute Africa Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
      <h2 style="color: #0891b2;">Application Received</h2>
      <p>Dear ${firstName} ${lastName},</p>
      <p>Thank you for applying to AI Institute Africa! We have received your application for the March 2026 intake.</p>
      <div style="background-color: #f0fdfa; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #0891b2;">
        <p style="margin: 0 0 10px 0;"><strong>Reference Number:</strong> ${referenceNumber}</p>
        <p style="margin: 0;"><strong>Programs Applied:</strong></p>
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
          ${programList}
        </ul>
      </div>
      <p><strong>What happens next?</strong></p>
      <ol style="line-height: 1.8;">
        <li>Our admissions team will review your application</li>
        <li>You will receive an email notification once a decision is made</li>
        <li>If accepted, you will receive enrollment instructions</li>
      </ol>
      <p>If you have any questions, please contact us at <a href="mailto:admin@aiinstituteafrica.com">admin@aiinstituteafrica.com</a></p>
      <p style="margin-top: 30px;">Best regards,<br><strong>AI Institute Africa Admissions Team</strong></p>
    </div>
  `;
  const text2 = `
Application Received

Dear ${firstName} ${lastName},

Thank you for applying to AI Institute Africa! We have received your application for the March 2026 intake.

Reference Number: ${referenceNumber}
Programs Applied:
${selectedPrograms.map((p) => `- ${p.name}${p.category ? ` (${p.category})` : ""}`).join("\n")}

What happens next?
1. Our admissions team will review your application
2. You will receive an email notification once a decision is made
3. If accepted, you will receive enrollment instructions

If you have any questions, please contact us at admin@aiinstituteafrica.com

Best regards,
AI Institute Africa Admissions Team
  `;
  return { html, text: text2 };
}
function generateApplicationStatusEmail(firstName, lastName, referenceNumber, status, adminNotes) {
  const isAccepted = status === "accepted";
  const statusColor = isAccepted ? "#22c55e" : "#ef4444";
  const statusText = isAccepted ? "Accepted" : "Not Accepted";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="cid:preloader" alt="AI Institute Africa Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
      <h2 style="color: ${statusColor};">Application ${statusText}</h2>
      <p>Dear ${firstName} ${lastName},</p>
      <p>We have reviewed your application (Reference: <strong>${referenceNumber}</strong>) for AI Institute Africa.</p>
      <div style="background-color: ${isAccepted ? "#f0fdf4" : "#fef2f2"}; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid ${statusColor};">
        <p style="margin: 0; font-size: 18px;"><strong>Status: ${statusText}</strong></p>
        ${adminNotes ? `<p style="margin: 15px 0 0 0;"><strong>Notes:</strong> ${adminNotes}</p>` : ""}
      </div>
      ${isAccepted ? `
        <p><strong>Congratulations!</strong> You have been accepted into our program. Here are your next steps:</p>
        <ol style="line-height: 1.8;">
          <li>Review the enrollment package that will be sent separately</li>
          <li>Complete the payment for your selected program(s)</li>
          <li>Submit any additional required documents</li>
        </ol>
        <p>Our team will contact you shortly with further details about the enrollment process.</p>
      ` : `
        <p>We appreciate your interest in AI Institute Africa. While we were unable to accept your application at this time, we encourage you to:</p>
        <ul style="line-height: 1.8;">
          <li>Review the admission requirements for future intakes</li>
          <li>Consider our shorter programs that may have different requirements</li>
          <li>Contact us for feedback on how to strengthen your application</li>
        </ul>
      `}
      <p>If you have any questions, please contact us at <a href="mailto:admin@aiinstituteafrica.com">admin@aiinstituteafrica.com</a></p>
      <p style="margin-top: 30px;">Best regards,<br><strong>AI Institute Africa Admissions Team</strong></p>
    </div>
  `;
  const text2 = `
Application ${statusText}

Dear ${firstName} ${lastName},

We have reviewed your application (Reference: ${referenceNumber}) for AI Institute Africa.

Status: ${statusText}
${adminNotes ? `Notes: ${adminNotes}` : ""}

${isAccepted ? `Congratulations! You have been accepted into our program. Our team will contact you shortly with further details about the enrollment process.` : `We appreciate your interest in AI Institute Africa. While we were unable to accept your application at this time, we encourage you to review the admission requirements for future intakes.`}

If you have any questions, please contact us at admin@aiinstituteafrica.com

Best regards,
AI Institute Africa Admissions Team
  `;
  return { html, text: text2 };
}
function generateAdminNotificationEmail(firstName, lastName, referenceNumber, email, selectedPrograms, position, organization) {
  const programList = selectedPrograms.map((p) => {
    if (typeof p === "string") {
      return `<li>${p}</li>`;
    }
    return `<li>${p.name}${p.category ? ` (${p.category})` : ""}</li>`;
  }).join("");
  const programNames = selectedPrograms.map((p) => typeof p === "string" ? p : p.name).join(", ");
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="cid:preloader" alt="AI Institute Africa Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
      <h2 style="color: #0891b2;">New Program Application</h2>
      <p>A new program application has been submitted and requires review.</p>
      <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <p style="margin: 0 0 10px 0;"><strong>Reference:</strong> ${referenceNumber}</p>
        <p style="margin: 0 0 10px 0;"><strong>First Name:</strong> ${firstName}</p>
        <p style="margin: 0 0 10px 0;"><strong>Surname:</strong> ${lastName}</p>
        <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
        ${position ? `<p style="margin: 0 0 10px 0;"><strong>Position / Designation:</strong> ${position}</p>` : ""}
        ${organization ? `<p style="margin: 0 0 10px 0;"><strong>Bank / Organisation:</strong> ${organization}</p>` : ""}
        <p style="margin: 0;"><strong>Program:</strong></p>
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
          ${programList}
        </ul>
      </div>
      <p>Please log in to the admin panel to review and process this application.</p>
    </div>
  `;
  const text2 = `
New Program Application

Reference: ${referenceNumber}
First Name: ${firstName}
Surname: ${lastName}
Email: ${email}
${position ? `Position / Designation: ${position}` : ""}
${organization ? `Bank / Organisation: ${organization}` : ""}
Program: ${programNames}

Please log in to the admin panel to review and process this application.
  `;
  return { html, text: text2 };
}
var logoImage, emailHttpClient;
var init_email = __esm({
  "server/services/email.ts"() {
    "use strict";
    logoImage = "client/src/lib/logos/preloader.png";
    emailHttpClient = axios.create({
      timeout: 15e3,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
});

// server/utils/password.ts
var password_exports = {};
__export(password_exports, {
  comparePasswords: () => comparePasswords,
  hashPassword: () => hashPassword
});
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  try {
    const [hashed, salt] = stored.split(".");
    if (!salt) {
      return false;
    }
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = await scryptAsync(supplied, salt, 64);
    return Buffer.compare(hashedBuf, suppliedBuf) === 0;
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}
var scryptAsync;
var init_password = __esm({
  "server/utils/password.ts"() {
    "use strict";
    scryptAsync = promisify(scrypt);
  }
});

// server/migrations/events.ts
import path3 from "path";
import fs4 from "fs";
async function copyEventImages() {
  try {
    const sourceDir = path3.join(process.cwd(), "client", "src", "lib", "event_images");
    const targetDir = path3.join(process.cwd(), "client", "src", "lib", "articleimages");
    if (!fs4.existsSync(targetDir)) {
      fs4.mkdirSync(targetDir, { recursive: true });
    }
    if (fs4.existsSync(sourceDir)) {
      const files = fs4.readdirSync(sourceDir);
      for (const file of files) {
        const sourcePath = path3.join(sourceDir, file);
        const targetPath = path3.join(targetDir, file);
        if (!fs4.existsSync(targetPath)) {
          fs4.copyFileSync(sourcePath, targetPath);
          console.log(`Copied ${file} to articleimages directory`);
        }
      }
    } else {
      console.log("Event images directory not found, skipping image copy");
    }
  } catch (error) {
    console.error("Error copying event images:", error);
  }
}
async function migrateEvents() {
  try {
    console.log("Starting events migration...");
    await copyEventImages();
    const tableExists = await db.execute(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'events'
      );
    `);
    if (tableExists.rows[0]?.exists === true) {
      const eventCount = await db.execute(`
        SELECT COUNT(*) FROM events;
      `);
      const count = eventCount.rows[0]?.count;
      if (typeof count === "string") {
        const countNum = parseInt(count);
        if (countNum > 0) {
          console.log(`Found ${countNum} existing events, skipping migration`);
          return;
        }
      } else if (typeof count === "number" && count > 0) {
        console.log(`Found ${count} existing events, skipping migration`);
        return;
      }
    }
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS "events" (
          "id" SERIAL PRIMARY KEY,
          "title" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "date" TIMESTAMP NOT NULL,
          "location" TEXT NOT NULL,
          "type" TEXT NOT NULL CHECK ("type" IN ('Conference', 'Workshop', 'Webinar', 'Meetup', 'Other')),
          "capacity" INTEGER,
          "registration_required" BOOLEAN DEFAULT false,
          "registration_url" TEXT,
          "image_url" TEXT,
          "organizer" TEXT NOT NULL,
          "status" TEXT NOT NULL CHECK ("status" IN ('Upcoming', 'Ongoing', 'Completed', 'Cancelled')) DEFAULT 'Upcoming',
          "created_at" TIMESTAMP DEFAULT now() NOT NULL,
          "updated_at" TIMESTAMP DEFAULT now() NOT NULL
        );
      `);
      console.log("Events table created successfully");
      const insertResult = await db.execute(`
        INSERT INTO "events" (
          "title", "description", "date", "location", "type", 
          "capacity", "registration_required", "registration_url", 
          "image_url", "organizer", "status", "created_at", "updated_at"
        ) VALUES (
          'AI Conference Africa 2025', 
          'The AI Conference Africa 2025, taking place from April 14\u201317, 2025, at Elephant Hills Hotel, Victoria Falls, will bring together government leaders, academia, organizations, and industry captains to explore advancements in artificial intelligence. The event will feature panel discussions, keynote speeches, and workshops on AI trends, ethics, and policy, alongside networking sessions for collaboration. Attendees can also engage in hands-on AI workshops, startup showcases, and innovation exhibitions, highlighting AI solutions tailored for Africa. Additionally, discussions on AI governance and regulation will shape the future of responsible AI adoption across the continent.',
          '2025-04-14T09:00:00',
          'Elephant Hills Victoria Falls',
          'Conference',
          500,
          true,
          'https://example.com/register',
          '/src/lib/articleimages/AI events.jpg',
          'AI Institute of Africa',
          'Upcoming',
          now(),
          now()
        ) RETURNING "id";
      `);
      console.log("Event inserted with ID:", insertResult.rows[0]?.id);
    } catch (error) {
      console.error("Error creating events table or inserting data:", error);
      throw error;
    }
    console.log("Migrated event to database");
  } catch (error) {
    console.error("Error migrating events:", error);
  }
}
var init_events = __esm({
  "server/migrations/events.ts"() {
    "use strict";
    init_db();
  }
});

// server/migrationRunner.ts
var migrationRunner_exports = {};
__export(migrationRunner_exports, {
  runMigrations: () => runMigrations
});
import { sql as sql2 } from "drizzle-orm";
async function runMigrations() {
  try {
    console.log("Running database migrations...");
    await db.execute(sql2`SELECT 1`);
    await migrateEvents();
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Migration error:", error);
  }
}
var init_migrationRunner = __esm({
  "server/migrationRunner.ts"() {
    "use strict";
    init_db();
    init_events();
  }
});

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path4, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename, __dirname, vite_config_default;
var init_vite_config = __esm({
  "vite.config.ts"() {
    "use strict";
    __filename = fileURLToPath(import.meta.url);
    __dirname = dirname(__filename);
    vite_config_default = defineConfig({
      plugins: [react(), runtimeErrorOverlay(), themePlugin()],
      resolve: {
        alias: {
          "@db": path4.resolve(__dirname, "db"),
          "@": path4.resolve(__dirname, "client", "src")
        }
      },
      root: path4.resolve(__dirname, "client"),
      build: {
        outDir: path4.resolve(__dirname, "dist/public"),
        emptyOutDir: true
      }
    });
  }
});

// server/vite.ts
var vite_exports = {};
__export(vite_exports, {
  log: () => log,
  serveStatic: () => serveStatic,
  setupVite: () => setupVite
});
import express4 from "express";
import fs5 from "fs";
import path5, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: {
      middlewareMode: true,
      hmr: { server }
    },
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path5.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs5.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(`src="/src/main.tsx"`, `src="/src/main.tsx?v=${nanoid()}"`);
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path5.resolve(__dirname2, "public");
  if (!fs5.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express4.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path5.resolve(distPath, "index.html"));
  });
}
var __filename2, __dirname2, viteLogger;
var init_vite = __esm({
  "server/vite.ts"() {
    "use strict";
    init_vite_config();
    __filename2 = fileURLToPath2(import.meta.url);
    __dirname2 = dirname2(__filename2);
    viteLogger = createLogger();
  }
});

// server/index.ts
import express5 from "express";

// server/routes.ts
init_db();
init_schema();
import express3 from "express";
import { createServer } from "http";
import { ZodError } from "zod";

// server/routes/news.ts
import express from "express";
import OpenAI from "openai";
var router = express.Router();
var openai = new OpenAI();
router.get("/api/news", async (req, res) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=artificial+intelligence+AND+(AI+OR+machine+learning+OR+neural+networks+OR+deep+learning)&sortBy=publishedAt&pageSize=12&language=en`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEWS_API_KEY}`
        }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }
    const data = await response.json();
    let articles2 = data.articles.filter((article) => {
      const text2 = `${article.title} ${article.description}`.toLowerCase();
      return text2.includes("ai") || text2.includes("artificial intelligence") || text2.includes("machine learning") || text2.includes("deep learning");
    }).sort(() => Math.random() - 0.5);
    if (process.env.OPENAI_API_KEY) {
      try {
        articles2 = await Promise.all(
          articles2.map(async (article) => {
            try {
              const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
                messages: [
                  {
                    role: "system",
                    content: "You are an AI expert who analyzes news articles. Enhance the description to focus on AI implications, technological advancements, and potential impact. Keep the enhanced description under 200 characters while maintaining key AI-related insights."
                  },
                  {
                    role: "user",
                    content: `Enhance this AI news article description: ${article.description}`
                  }
                ]
              });
              return {
                ...article,
                description: completion.choices[0].message.content || article.description
              };
            } catch (error) {
              console.error("OpenAI enhancement failed for article:", error);
              return article;
            }
          })
        );
      } catch (error) {
        console.error("OpenAI batch processing failed:", error);
      }
    }
    res.json(articles2);
  } catch (error) {
    console.error("News API error:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});
var news_default = router;

// server/routes/contact.ts
init_email();
init_db();
init_schema();
import { Router } from "express";
var router2 = Router();
router2.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    await db.insert(contacts).values({
      name,
      email,
      subject: subject || "Contact Form",
      message
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
    const text2 = `New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}`;
    const success = await sendRegistrationEmail({
      to: "admin@aiinstituteafrica.com",
      subject: `Contact Form: ${subject}`,
      html,
      text: text2
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
var contact_default = router2;

// server/routes/chat.ts
import { Router as Router2 } from "express";
import OpenAI2 from "openai";
var router3 = Router2();
var openai2 = new OpenAI2({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL
});
router3.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const completion = await openai2.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for the AI Institute Africa website. Provide concise, accurate information about our programs, courses, and initiatives. Keep responses friendly and professional."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_completion_tokens: 1024
    });
    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});
var chat_default = router3;

// server/routes/vision.ts
import { Router as Router3 } from "express";
import express2 from "express";
var router4 = Router3();
router4.use("/api/vision", express2.Router());
var vision_default = router4;

// server/auth.ts
init_db();
init_schema();
init_password();
init_email();
init_password();
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { eq } from "drizzle-orm";
import { randomBytes as randomBytes2 } from "crypto";
async function getUserByEmail(email) {
  return db.select().from(users).where(eq(users.email, email)).limit(1);
}
async function getAdminByUsername(username) {
  return db.select().from(admins).where(eq(admins.username, username)).limit(1);
}
function setupAuth(app2) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const [user] = await getUserByEmail(email);
          if (!user || !await comparePasswords(password, user.password)) {
            return done(null, false, { message: "Invalid email or password" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const [user] = await db.select({
        id: users.id,
        email: users.email,
        role: users.role,
        level: users.level,
        membershipType: users.membershipType,
        membershipStatus: users.membershipStatus,
        membership_key: users.membership_key
      }).from(users).where(eq(users.id, id)).limit(1);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      console.error("User deserialization error:", error);
      done(null, false);
    }
  });
  app2.use(passport.initialize());
  app2.use(passport.session());
  app2.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("Authentication error:", err);
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      req.logIn(user, (err2) => {
        if (err2) {
          console.error("Login error:", err2);
          return next(err2);
        }
        const { password, ...userData } = user;
        return res.json(userData);
      });
    })(req, res, next);
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Error during logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  app2.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user;
      const isAdmin = user.level === "admin";
      res.json({
        ...user,
        isAdmin
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
  app2.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const [user] = await getUserByEmail(email);
      if (!user) {
        return res.status(200).json({
          message: "If an account with that email exists, a password reset link has been sent"
        });
      }
      const resetToken = randomBytes2(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 36e5);
      await db.update(users).set({
        resetToken,
        resetTokenExpiry
      }).where(eq(users.id, user.id));
      const resetUrl = `${process.env.FRONTEND_URL || req.headers.origin}/reset-password?token=${resetToken}`;
      const { html, text: text2 } = generatePasswordResetEmailContent(
        user.name,
        resetToken,
        resetUrl
      );
      await sendPasswordResetEmail({
        to: user.email,
        subject: "Password Reset Request",
        html,
        text: text2
      });
      return res.status(200).json({
        message: "If an account with that email exists, a password reset link has been sent"
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(500).json({ message: "Error processing your request" });
    }
  });
  app2.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ message: "Token and password are required" });
      }
      const [user] = await db.select().from(users).where(eq(users.resetToken, token)).limit(1);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      if (!user.resetTokenExpiry || new Date(user.resetTokenExpiry) < /* @__PURE__ */ new Date()) {
        return res.status(400).json({ message: "Token has expired" });
      }
      const hashedPassword = await hashPassword(password);
      await db.update(users).set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }).where(eq(users.id, user.id));
      return res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      return res.status(500).json({ message: "Error processing your request" });
    }
  });
  app2.post("/api/admin/forgot-password", async (req, res) => {
    try {
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }
      const [admin] = await getAdminByUsername(username);
      if (!admin) {
        return res.status(200).json({
          message: "If an account with that username exists, a password reset link has been sent"
        });
      }
      const resetToken = randomBytes2(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 36e5);
      await db.update(admins).set({
        resetToken,
        resetTokenExpiry
      }).where(eq(admins.id, admin.id));
      const resetUrl = `${process.env.FRONTEND_URL || req.headers.origin}/admin/reset-password?token=${resetToken}`;
      const { html, text: text2 } = generatePasswordResetEmailContent(
        admin.fullName,
        resetToken,
        resetUrl
      );
      await sendPasswordResetEmail({
        to: admin.username,
        // Assuming username is the email for admins
        subject: "Admin Password Reset Request",
        html,
        text: text2
      });
      return res.status(200).json({
        message: "If an account with that username exists, a password reset link has been sent"
      });
    } catch (error) {
      console.error("Admin forgot password error:", error);
      return res.status(500).json({ message: "Error processing your request" });
    }
  });
  app2.post("/api/admin/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ message: "Token and password are required" });
      }
      const [admin] = await db.select().from(admins).where(eq(admins.resetToken, token)).limit(1);
      if (!admin) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      if (!admin.resetTokenExpiry || new Date(admin.resetTokenExpiry) < /* @__PURE__ */ new Date()) {
        return res.status(400).json({ message: "Token has expired" });
      }
      const hashedPassword = await hashPassword(password);
      await db.update(admins).set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }).where(eq(admins.id, admin.id));
      return res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Admin reset password error:", error);
      return res.status(500).json({ message: "Error processing your request" });
    }
  });
}

// server/routes.ts
import nodemailer2 from "nodemailer";

// server/routes/membership.ts
init_db();
init_schema();
import { Router as Router4 } from "express";
import { eq as eq2 } from "drizzle-orm";
var router5 = Router4();
router5.get("/count", async (req, res) => {
  try {
    let count = await db.select().from(membershipCount).limit(1);
    if (!count.length) {
      await db.insert(membershipCount).values({ count: 180 });
      count = [{ count: 180 }];
    }
    res.json({ availableSpots: count[0].count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get membership count" });
  }
});
router5.post("/increment", async (req, res) => {
  try {
    const count = await db.select().from(membershipCount).limit(1);
    if (count.length && count[0].count > 0) {
      await db.update(membershipCount).set({ count: count[0].count - 1, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(membershipCount.id, count[0].id));
    }
    res.json({ success: true });
  } catch (error) {
    router5.delete("/count/:id", async (req2, res2) => {
      try {
        const id = parseInt(req2.params.id);
        await db.delete(membershipCount).where(eq2(membershipCount.id, id));
        res2.json({ success: true });
      } catch (error2) {
        console.error(error2);
        res2.status(500).json({ error: "Failed to delete membership count" });
      }
    });
    console.error(error);
    res.status(500).json({ error: "Failed to update membership count" });
  }
});
var membership_default = router5;

// server/services/paynow.ts
import { Paynow } from "paynow";
var paynow = new Paynow(
  process.env.PAYNOW_INTEGRATION_ID,
  process.env.PAYNOW_INTEGRATION_KEY,
  "http://localhost:3000"
);
paynow.resultUrl = `${process.env.APP_URL}/api/payments/callback`;
paynow.returnUrl = `${process.env.APP_URL}/payment/success`;
async function initiatePayment(payment) {
  const payment_ref = `REF-${payment.id}`;
  const payment_obj = paynow.createPayment(payment_ref);
  payment_obj.add("Membership Payment", Number(payment.amount));
  if (payment.paymentMethod === "mobile") {
    const response = await paynow.sendMobile(
      payment_obj,
      payment.phoneNumber,
      payment.provider
      // e.g., 'ecocash', 'onemoney'
    );
    if (response.success) {
      return {
        success: true,
        pollUrl: response.pollUrl,
        paymentRef: payment_ref
      };
    }
  } else if (payment.paymentMethod === "card") {
    const response = await paynow.send(payment_obj);
    if (response.success) {
      return {
        success: true,
        redirectUrl: response.redirectUrl,
        paymentRef: payment_ref
      };
    }
  }
  throw new Error("Failed to initiate payment");
}

// server/routes.ts
import multer from "multer";

// server/service.ts
import { spawn } from "child_process";

// server/utils/schemas.ts
import Ajv from "ajv";
import addFormats from "ajv-formats";
var ajv = new Ajv();
addFormats(ajv);
var documentVerificationSchema = {
  type: "object",
  properties: {
    isId: {
      type: "boolean",
      description: "Whether the document is a valid ID"
    },
    nameMatch: {
      type: "boolean",
      description: "Whether the name matches in the document"
    },
    confidence: {
      type: "string",
      enum: ["high", "low", "none"],
      description: "Confidence level of the verification"
    },
    type: {
      type: "string",
      enum: ["Student Member", "Full Member", "Institutional Member", "Free Membership"],
      description: "Type of membership determined from the document"
    },
    error: {
      type: "string",
      description: "Error message if verification failed"
    },
    detectedText: {
      type: "object",
      properties: {
        words: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              confidence: { type: "number" },
              position: {
                type: "object",
                properties: {
                  top_left: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 2,
                    maxItems: 2
                  },
                  top_right: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 2,
                    maxItems: 2
                  },
                  bottom_right: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 2,
                    maxItems: 2
                  },
                  bottom_left: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 2,
                    maxItems: 2
                  }
                },
                required: ["top_left", "top_right", "bottom_right", "bottom_left"]
              }
            },
            required: ["text", "confidence", "position"]
          }
        },
        foundIdIndicators: {
          type: "array",
          items: { type: "string" }
        },
        foundNameParts: {
          type: "array",
          items: { type: "string" }
        },
        completeText: { type: "string" }
      },
      required: ["words", "foundIdIndicators", "foundNameParts", "completeText"]
    }
  },
  required: ["isId", "nameMatch", "confidence", "type"],
  additionalProperties: false
};
var validateDocumentVerification = ajv.compile(documentVerificationSchema);
function validateVerificationResult(data) {
  const isValid = validateDocumentVerification(data);
  if (!isValid) {
    return {
      valid: false,
      errors: validateDocumentVerification.errors
    };
  }
  return {
    valid: true,
    errors: null
  };
}

// server/service.ts
import path from "path";
import fs2 from "fs";
async function verify_document(imagePath, fullName) {
  return new Promise((resolve, reject) => {
    try {
      if (!fs2.existsSync(imagePath)) {
        console.error(`Image file not found at path: ${imagePath}`);
        return resolve({
          isId: false,
          nameMatch: false,
          confidence: "none",
          type: "Free Membership",
          error: "Image file not found"
        });
      }
      console.log("Starting document verification process...", {
        imagePath,
        fullName,
        pythonPath: process.env.PYTHON_PATH || "python3.11",
        cwd: process.cwd()
      });
      const scriptPath = path.resolve(process.cwd(), "server", "service.py");
      if (!fs2.existsSync(scriptPath)) {
        console.error(`Python script not found at path: ${scriptPath}`);
        return resolve({
          isId: false,
          nameMatch: false,
          confidence: "none",
          type: "Free Membership",
          error: "Verification service unavailable"
        });
      }
      const pythonProcess = spawn(
        process.env.PYTHON_PATH || "python3.11",
        [scriptPath, "verify_document", imagePath, fullName],
        {
          env: {
            ...process.env,
            PYTHONUNBUFFERED: "1",
            PYTHONPATH: process.env.PYTHONPATH || process.cwd()
          },
          stdio: ["pipe", "pipe", "pipe"]
        }
      );
      let stdout = "";
      let stderr = "";
      pythonProcess.stdout.on("data", (data) => {
        const output = data.toString();
        stdout += output;
        console.log("Python process stdout:", output);
      });
      pythonProcess.stderr.on("data", (data) => {
        const error = data.toString();
        stderr += error;
        console.error("Python process stderr:", error);
      });
      pythonProcess.on("error", (error) => {
        console.error("Failed to start Python process:", error);
        resolve({
          isId: false,
          nameMatch: false,
          confidence: "none",
          type: "Free Membership",
          error: `Failed to start verification process: ${error.message}`
        });
      });
      const timeout = setTimeout(() => {
        pythonProcess.kill();
        console.error("Python process timed out");
        resolve({
          isId: false,
          nameMatch: false,
          confidence: "none",
          type: "Free Membership",
          error: "Document verification timed out"
        });
      }, 105e3);
      pythonProcess.on("close", (code) => {
        clearTimeout(timeout);
        console.log("Python process closed with code:", code);
        console.log("Final stdout:", stdout);
        console.log("Final stderr:", stderr);
        if (code === 0 && stdout.trim()) {
          try {
            const result = JSON.parse(stdout.trim());
            const validationResult = validateVerificationResult(result);
            if (!validationResult.valid) {
              console.error("Validation errors:", validationResult.errors);
              resolve({
                isId: false,
                nameMatch: false,
                confidence: "none",
                type: "Free Membership",
                error: "Invalid document verification result format"
              });
              return;
            }
            resolve(result);
          } catch (error) {
            console.error("Error parsing Python output:", error);
            resolve({
              isId: false,
              nameMatch: false,
              confidence: "none",
              type: "Free Membership",
              error: "Failed to parse verification result"
            });
          }
        } else {
          console.error(`Python process failed with code ${code}`);
          console.error("Final stderr:", stderr);
          resolve({
            isId: false,
            nameMatch: false,
            confidence: "none",
            type: "Free Membership",
            error: stderr || "Document verification failed"
          });
        }
      });
    } catch (error) {
      console.error("Unexpected error in verify_document:", error);
      resolve({
        isId: false,
        nameMatch: false,
        confidence: "none",
        type: "Free Membership",
        error: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  });
}

// server/routes.ts
init_email();
import path2 from "path";
import fs3 from "fs";
import { eq as eq3, inArray, sql, asc, desc } from "drizzle-orm";
import OpenAI3 from "openai";
var uploadsDir = path2.join(process.cwd(), "client", "src", "lib", "uploads");
try {
  if (!fs3.existsSync(uploadsDir)) {
    fs3.mkdirSync(uploadsDir, { recursive: true, mode: 493 });
  }
  const testFile = path2.join(uploadsDir, ".test-write");
  fs3.writeFileSync(testFile, "");
  fs3.unlinkSync(testFile);
  console.log("Uploads directory verified:", uploadsDir);
} catch (error) {
  console.error("Error setting up uploads directory:", error);
  throw new Error("Failed to setup uploads directory. Please check permissions.");
}
var storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs3.existsSync(uploadsDir)) {
      fs3.mkdirSync(uploadsDir, { recursive: true, mode: 493 });
    }
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path2.extname(file.originalname);
    cb(null, `document-${uniqueSuffix}${ext}`);
  }
});
var upload = multer({
  storage,
  limits: {
    fileSize: 2 * 4032 * 4032
    // Limit file size to 2MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/tiff"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only .png, .jpg and .tiff files are allowed"), false);
      return;
    }
    cb(null, true);
  }
}).single("file");
var articleImagesDir = path2.join(process.cwd(), "client", "src", "lib", "articleimages");
var eventImagesDir = path2.join(process.cwd(), "client", "src", "lib", "event_images");
var articleImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs3.existsSync(articleImagesDir)) {
      fs3.mkdirSync(articleImagesDir, { recursive: true, mode: 493 });
    }
    cb(null, articleImagesDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path2.extname(file.originalname);
    cb(null, `article-${uniqueSuffix}${ext}`);
  }
});
var uploadArticleImage = multer({
  storage: articleImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024
    // Limit file size to 5MB for article images
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only .png, .jpg, and .webp files are allowed"), false);
      return;
    }
    cb(null, true);
  }
}).single("image");
var eventImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs3.existsSync(eventImagesDir)) {
      fs3.mkdirSync(eventImagesDir, { recursive: true, mode: 493 });
    }
    cb(null, eventImagesDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path2.extname(file.originalname);
    cb(null, `event-${uniqueSuffix}${ext}`);
  }
});
var uploadEventImage = multer({
  storage: eventImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024
    // Limit file size to 5MB for event images
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only .png, .jpg, and .webp files are allowed"), false);
      return;
    }
    cb(null, true);
  }
}).single("image");
var openaiClient = new OpenAI3({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL
});
function registerRoutes(app2) {
  const httpServer = createServer(app2);
  app2.get("/api/diag-env", (req, res) => {
    res.json({
      SENDPULSE_API_KEY: process.env.SENDPULSE_API_KEY ? "Configured (length: " + process.env.SENDPULSE_API_KEY.length + ")" : "Not set",
      SENDPULSE_CLIENT_ID: process.env.SENDPULSE_CLIENT_ID ? "Configured" : "Not set",
      SENDPULSE_CLIENT_SECRET: process.env.SENDPULSE_CLIENT_SECRET ? "Configured" : "Not set",
      SMTP_HOST: process.env.SMTP_HOST || "Not set",
      SMTP_PORT: process.env.SMTP_PORT || "Not set",
      SMTP_SECURE: process.env.SMTP_SECURE || "Not set",
      SMTP_USER: process.env.SMTP_USER || "Not set",
      SMTP_FROM: process.env.SMTP_FROM || "Not set",
      SMTP_PASS: process.env.SMTP_PASS ? "Configured" : "Not set",
      NODE_ENV: process.env.NODE_ENV || "Not set"
    });
  });
  setupAuth(app2);
  const isAdmin = (req, res, next) => {
    console.log("Checking admin auth:", req.isAuthenticated(), req.user);
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user;
    if (user.level !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    next();
  };
  app2.use((req, res, next) => {
    const skip = req.path.startsWith("/api/") || req.path.startsWith("/src/") || req.path.startsWith("/@") || req.path.startsWith("/node_modules/") || req.path.startsWith("/uploads/") || req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|map|webp|ts|tsx|json|mjs)$/i);
    if (!skip) {
      const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress || "unknown";
      const path7 = req.path || "/";
      db.insert(pageVisits).values({
        path: path7,
        ip,
        userAgent: req.headers["user-agent"] || null,
        referer: req.headers["referer"] || null
      }).catch(() => {
      });
    }
    next();
  });
  app2.use(news_default);
  app2.use("/api/contact", contact_default);
  app2.use(chat_default);
  app2.use("/api/membership", membership_default);
  app2.use("/api/vision", vision_default);
  app2.get("/api/admin/members", isAdmin, async (req, res) => {
    try {
      if (!req.user || !req.isAuthenticated()) {
        console.log("User not authenticated:", req.user);
        return res.status(401).json({ message: "Unauthorized" });
      }
      const members = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        membershipType: users.membershipType,
        membershipStatus: users.membershipStatus,
        level: users.level,
        organization: users.organization,
        country: users.country,
        createdAt: users.createdAt
      }).from(users).orderBy(users.createdAt);
      console.log("Fetched members:", members.length);
      res.json(members);
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });
  app2.post("/api/admin/members/bulk", isAdmin, async (req, res) => {
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
            await db.delete(payments).where(eq3(payments.userId, memberId));
            console.log(`Deleted payment records for user ${memberId}`);
          } catch (err) {
            console.log(`No payment records found for user ${memberId} or error:`, err);
          }
        }
        await db.delete(users).where(inArray(users.id, memberIds));
      } else if (action === "promote" || action === "demote") {
        await db.update(users).set({
          level: action === "promote" ? "admin" : "user",
          updatedAt: /* @__PURE__ */ new Date()
        }).where(inArray(users.id, memberIds));
      } else {
        await db.update(users).set({
          membershipStatus: action === "activate" ? "Active" : "Inactive",
          updatedAt: /* @__PURE__ */ new Date()
        }).where(inArray(users.id, memberIds));
      }
      res.json({ message: "Bulk operation completed successfully" });
    } catch (error) {
      console.error("Error performing bulk operation:", error);
      res.status(500).json({ message: "Failed to perform bulk operation" });
    }
  });
  app2.get("/api/admin/payments", isAdmin, async (req, res) => {
    try {
      const paymentsList = await db.select().from(payments);
      res.json(paymentsList);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });
  app2.get("/api/admin/contacts", isAdmin, async (req, res) => {
    try {
      const contactsList = await db.select().from(contacts);
      res.json(contactsList);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });
  app2.get("/api/admin/summit-registrations", isAdmin, async (req, res) => {
    try {
      const registrations = await db.select().from(summitRegistrations).orderBy(desc(summitRegistrations.createdAt));
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching summit registrations:", error);
      res.status(500).json({ message: "Failed to fetch summit registrations" });
    }
  });
  app2.get("/api/admin/dashboard/stats", isAdmin, async (req, res) => {
    try {
      const [totalMembers] = await db.select({ count: sql`count(*)::int` }).from(users);
      const [activeMembers] = await db.select({ count: sql`count(*)::int` }).from(users).where(eq3(users.membershipStatus, "Active"));
      const [pendingMembers] = await db.select({ count: sql`count(*)::int` }).from(users).where(eq3(users.membershipStatus, "Pending"));
      const thirtyDaysAgo = /* @__PURE__ */ new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const [recentApplications] = await db.select({ count: sql`count(*)::int` }).from(users).where(sql`created_at >= ${thirtyDaysAgo}`);
      const recentMembers = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        membershipType: users.membershipType,
        membershipStatus: users.membershipStatus,
        level: users.level,
        organization: users.organization,
        country: users.country,
        createdAt: users.createdAt
      }).from(users).orderBy(sql`created_at DESC`).limit(5);
      res.json({
        totalMembers: totalMembers?.count || 0,
        activeMembers: activeMembers?.count || 0,
        pendingMembers: pendingMembers?.count || 0,
        recentApplications: recentApplications?.count || 0,
        recentMembers
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });
  app2.post("/api/verify-document", (req, res) => {
    upload(req, res, async (err) => {
      try {
        if (err instanceof multer.MulterError) {
          console.error("Multer error:", err);
          return res.status(400).json({
            error: err.message,
            isId: false,
            nameMatch: false,
            confidence: "none",
            type: "Free Membership"
          });
        } else if (err) {
          console.error("Upload error:", err);
          return res.status(500).json({
            error: err.message,
            isId: false,
            nameMatch: false,
            confidence: "none",
            type: "Free Membership"
          });
        }
        if (!req.file || !req.body.fullName) {
          console.log("Missing file or full name in request");
          return res.status(400).json({
            error: "Missing file or full name",
            isId: false,
            nameMatch: false,
            confidence: "none",
            type: "Free Membership"
          });
        }
        console.log(`Processing document for ${req.body.fullName}`);
        const result = await verify_document(req.file.path, req.body.fullName);
        console.log("Document Verification Results:", {
          isId: result.isId,
          nameMatch: result.nameMatch,
          confidence: result.confidence,
          membershipType: result.type
        });
        res.json(result);
      } catch (error) {
        console.error("Document verification error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to verify document";
        res.status(500).json({
          error: errorMessage,
          isId: false,
          nameMatch: false,
          confidence: "none",
          type: "Free Membership"
        });
      } finally {
        if (req.file) {
          fs3.unlink(req.file.path, (err2) => {
            if (err2) console.error("Error deleting uploaded file:", err2);
          });
        }
      }
    });
  });
  app2.post("/api/payments", async (req, res) => {
    try {
      console.log("Starting payment/registration process", {
        email: req.body.email,
        planName: req.body.planName,
        membershipType: req.body.planName,
        memberKey: req.body.memberKey
      });
      const membershipType = req.body.planName;
      const planName = membershipType === "Free Membership" ? "free" : "paid";
      const { hashPassword: hashPassword2 } = await Promise.resolve().then(() => (init_password(), password_exports));
      const hashedPassword = await hashPassword2(req.body.password);
      const [user] = await db.insert(users).values({
        email: req.body.email,
        password: hashedPassword,
        name: req.body.fullName,
        organization: req.body.organization || null,
        role: "member",
        level: req.body.level || "user",
        // Add level field with default
        membershipType,
        membershipStatus: "Active",
        membershipStartDate: /* @__PURE__ */ new Date(),
        membershipEndDate: req.body.billingCycle === "yearly" ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1e3),
        country: req.body.country,
        interests: [],
        membership_key: req.body.memberKey
      }).returning();
      console.log("User created successfully:", {
        userId: user.id,
        membershipType: user.membershipType,
        membershipKey: user.membership_key
      });
      try {
        const emailContent = generateRegistrationEmailContent(
          user.name || "",
          user.membershipType,
          user.membership_key || ""
        );
        const emailSent = await sendRegistrationEmail({
          to: user.email,
          subject: "Welcome to AI Institute Africa - Registration Confirmed",
          html: emailContent.html,
          text: emailContent.text
        });
        if (!emailSent) {
          console.warn(`Failed to send welcome email to ${user.email}`);
        }
      } catch (emailError) {
        console.error("Failed to send registration email:", emailError);
      }
      const [payment] = await db.insert(payments).values({
        userId: user.id,
        // Using the typescript property name
        amount: req.body.amount || "0",
        currency: "USD",
        status: "Completed",
        paymentMethod: req.body.paymentMethod || "free",
        // Using camelCase to match TS schema
        billingAddress: `${req.body.address || ""}, ${req.body.city || ""}, ${req.body.country || ""}`
      }).returning();
      console.log("Payment record created:", {
        paymentId: payment.id,
        amount: payment.amount
      });
      if (req.body.amount === "0") {
        res.json({
          success: true,
          data: {
            user,
            payment,
            memberKey: user.membership_key
          }
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
            memberKey: user.membership_key
          }
        });
      }
    } catch (error) {
      console.error("Payment/Registration Error:", error);
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid form data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to process registration/payment" });
      }
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;
      const transporter = nodemailer2.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD
        }
      });
      const mailOptions = {
        from: email,
        to: "admin@aiinstituteafrica.com",
        subject: `Message from ${name}`,
        text: message
      };
      await transporter.sendMail(mailOptions);
      const contact = await db.insert(contacts).values(req.body);
      res.json({ success: true, data: contact });
    } catch (error) {
      console.error("Error sending email:", error);
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid form data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });
  app2.post("/api/conference/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const { sendRegistrationEmail: sendRegistrationEmail2 } = await Promise.resolve().then(() => (init_email(), email_exports));
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
            <p style="line-height: 1.6;">${message.replace(/\n/g, "<br>")}</p>
          </div>
          
          <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>Note:</strong> This inquiry was submitted through the AI Africa Summit 2025 contact form.
            </p>
          </div>
        </div>
      `;
      const emailSent = await sendRegistrationEmail2({
        to: "events@alphamedia.co.zw",
        subject: `AI Africa Summit 2025 - ${subject}`,
        text: `Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}`,
        html: emailContent
      });
      if (emailSent) {
        await db.insert(contacts).values({
          name,
          email,
          subject: `AI Africa Summit 2025 - ${subject}`,
          message,
          createdAt: /* @__PURE__ */ new Date()
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
  app2.post("/api/newsletter", async (req, res) => {
    try {
      const newsletter = await db.insert(newsletters).values({
        email: req.body.email
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
  app2.post("/api/student-leads", async (req, res) => {
    try {
      const leadData = insertStudentLeadSchema.parse(req.body);
      await db.insert(studentLeads).values({
        email: leadData.email,
        phone: leadData.phone,
        courseInterest: leadData.courseInterest,
        educationLevel: leadData.educationLevel || null
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
  app2.post(
    "/api/applications",
    (req, res, next) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      next();
    },
    async (req, res) => {
      res.json({ message: "Application Received" });
    }
  );
  app2.get("/api/admin/events", isAdmin, async (req, res) => {
    try {
      const eventsList = await db.select().from(events).orderBy(desc(events.createdAt));
      res.json(eventsList);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });
  app2.get("/api/admin/events/:id", isAdmin, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await db.select().from(events).where(eq3(events.id, eventId)).limit(1);
      if (event.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event[0]);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });
  app2.post("/api/admin/events", isAdmin, async (req, res) => {
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
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
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
  app2.put("/api/admin/events/:id", isAdmin, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const eventData = eventCreationSchema.parse(req.body);
      const result = await db.update(events).set({
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
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq3(events.id, eventId)).returning();
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
  app2.delete("/api/admin/events/:id", isAdmin, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const result = await db.delete(events).where(eq3(events.id, eventId)).returning();
      if (result.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });
  app2.get("/api/admin/articles", isAdmin, async (req, res) => {
    try {
      const articlesList = await db.select().from(articles).orderBy(desc(articles.createdAt));
      res.json(articlesList);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });
  app2.get("/api/admin/articles/:id", isAdmin, async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const article = await db.select().from(articles).where(eq3(articles.id, articleId)).limit(1);
      if (article.length === 0) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article[0]);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });
  app2.post("/api/admin/articles", isAdmin, async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const result = await db.insert(articles).values({
        title: articleData.title,
        author: articleData.author,
        content: articleData.content,
        imageUrl: articleData.imageUrl || null,
        requirement: articleData.requirement || "Free",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
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
  app2.put("/api/admin/articles/:id", isAdmin, async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const articleData = insertArticleSchema.parse(req.body);
      const result = await db.update(articles).set({
        title: articleData.title,
        author: articleData.author,
        content: articleData.content,
        imageUrl: articleData.imageUrl || null,
        requirement: articleData.requirement || "Free",
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq3(articles.id, articleId)).returning();
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
  app2.delete("/api/admin/articles/:id", isAdmin, async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const result = await db.delete(articles).where(eq3(articles.id, articleId)).returning();
      if (result.length === 0) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ message: "Failed to delete article" });
    }
  });
  app2.get("/api/events", async (req, res) => {
    try {
      const allEvents = await db.select().from(events).where(eq3(events.status, "Upcoming")).orderBy(asc(events.date));
      res.json(allEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });
  app2.get("/api/articles", async (req, res) => {
    try {
      const allArticles = await db.select().from(articles).orderBy(desc(articles.createdAt));
      res.json(allArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });
  app2.get("/api/local-articles", async (req, res) => {
    try {
      const allLocalArticles = await db.select().from(localArticles).orderBy(desc(localArticles.createdAt));
      res.json(allLocalArticles);
    } catch (error) {
      console.error("Error fetching local articles:", error);
      res.status(500).json({ message: "Failed to fetch local articles" });
    }
  });
  app2.get("/api/local-articles/:id", async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const article = await db.select().from(localArticles).where(eq3(localArticles.id, articleId)).limit(1);
      if (article.length === 0) {
        return res.status(404).json({ message: "Local article not found" });
      }
      res.json(article[0]);
    } catch (error) {
      console.error("Error fetching local article:", error);
      res.status(500).json({ message: "Failed to fetch local article" });
    }
  });
  app2.post("/api/admin/event-image-upload", isAdmin, (req, res) => {
    uploadEventImage(req, res, async (err) => {
      try {
        if (err instanceof multer.MulterError) {
          console.error("Multer error:", err);
          return res.status(400).json({
            error: err.message,
            success: false
          });
        } else if (err) {
          console.error("Upload error:", err);
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
        const imagePath = `/lib/event_images/${path2.basename(req.file.path)}`;
        console.log("Event image uploaded successfully:", imagePath);
        res.json({
          success: true,
          imagePath
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
  app2.get("/api/admin/local-articles", isAdmin, async (req, res) => {
    try {
      const allLocalArticles = await db.select().from(localArticles).orderBy(desc(localArticles.createdAt));
      res.json(allLocalArticles);
    } catch (error) {
      console.error("Error fetching local articles in admin:", error);
      res.status(500).json({ message: "Failed to fetch local articles" });
    }
  });
  app2.post("/api/admin/article-image-upload", isAdmin, (req, res) => {
    uploadArticleImage(req, res, async (err) => {
      try {
        if (err instanceof multer.MulterError) {
          console.error("Multer error:", err);
          return res.status(400).json({
            error: err.message,
            success: false
          });
        } else if (err) {
          console.error("Upload error:", err);
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
        const imagePath = `/lib/articleimages/${path2.basename(req.file.path)}`;
        console.log("Article image uploaded successfully:", imagePath);
        res.json({
          success: true,
          imagePath
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
  app2.get("/api/admin/local-articles/:id", isAdmin, async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const article = await db.select().from(localArticles).where(eq3(localArticles.id, articleId)).limit(1);
      if (article.length === 0) {
        return res.status(404).json({ message: "Local article not found" });
      }
      res.json(article[0]);
    } catch (error) {
      console.error("Error fetching local article in admin:", error);
      res.status(500).json({ message: "Failed to fetch local article" });
    }
  });
  app2.post("/api/admin/local-articles", isAdmin, async (req, res) => {
    try {
      const articleData = insertLocalArticleSchema.parse(req.body);
      const result = await db.insert(localArticles).values({
        title: articleData.title,
        author: articleData.author,
        content: articleData.content,
        imageUrl: articleData.imageUrl,
        requirement: articleData.requirement || "Free",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
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
  app2.put("/api/admin/local-articles/:id", isAdmin, async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const articleData = insertLocalArticleSchema.parse(req.body);
      const result = await db.update(localArticles).set({
        title: articleData.title,
        author: articleData.author,
        content: articleData.content,
        imageUrl: articleData.imageUrl,
        requirement: articleData.requirement || "Free",
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq3(localArticles.id, articleId)).returning();
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
  app2.delete("/api/admin/local-articles/:id", isAdmin, async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const result = await db.delete(localArticles).where(eq3(localArticles.id, articleId)).returning();
      if (result.length === 0) {
        return res.status(404).json({ message: "Local article not found" });
      }
      res.json({ message: "Local article deleted successfully" });
    } catch (error) {
      console.error("Error deleting local article:", error);
      res.status(500).json({ message: "Failed to delete local article" });
    }
  });
  const applicationDocsDir = path2.join(process.cwd(), "uploads", "applications");
  if (!fs3.existsSync(applicationDocsDir)) {
    fs3.mkdirSync(applicationDocsDir, { recursive: true, mode: 493 });
  }
  const applicationDocStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      if (!fs3.existsSync(applicationDocsDir)) {
        fs3.mkdirSync(applicationDocsDir, { recursive: true, mode: 493 });
      }
      cb(null, applicationDocsDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path2.extname(file.originalname);
      cb(null, `application-${uniqueSuffix}${ext}`);
    }
  });
  app2.use("/uploads/applications", express3.static(applicationDocsDir));
  const uploadApplicationDoc = multer({
    storage: applicationDocStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      if (!allowedTypes.includes(file.mimetype)) {
        cb(new Error("Only PDF, PNG, JPG, Word, Excel, and CSV files are allowed"), false);
        return;
      }
      cb(null, true);
    }
  }).any();
  function generateReferenceNumber() {
    const prefix = "AIIA";
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${year}-${random}`;
  }
  app2.post("/api/program-applications", (req, res) => {
    uploadApplicationDoc(req, res, async (err) => {
      if (err) {
        console.error("File upload error:", err);
        return res.status(400).json({ message: err.message || "File upload failed" });
      }
      try {
        const {
          trainingType,
          firstName,
          lastName,
          email,
          graduateStatus,
          organizationName,
          contactFirstName,
          contactLastName,
          numberOfAttendees,
          phone,
          position,
          bankOrganisation,
          selectedProgramIds
        } = req.body;
        const isCorporate = trainingType === "corporate";
        const applicantFirstName = isCorporate ? contactFirstName || firstName : firstName;
        const applicantLastName = isCorporate ? contactLastName || lastName : lastName;
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
        const files = req.files;
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
          emailSent: false
        }).returning();
        const programNameMap = {
          "iobz_applied": "IoBZ AI Training for Bankers",
          "gradcert": "Graduate AI Certificate Program",
          "nongrad": "Non-Graduate AI Certificate",
          "basic": "Basic AI Certification",
          "advanced": "Advanced AI Certification",
          "postgrad": "Postgrad AI Diploma Program",
          "aidip": "AI Diploma Program",
          "dir": "Master AI for Directors",
          "exec": "Master AI for Executives",
          "prof": "Master AI for Professionals"
        };
        const programObjects = programs.map((p) => ({ name: programNameMap[p] || p }));
        const programNames = programs.map((p) => programNameMap[p] || p);
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
          text: confirmationEmail.text
        });
        if (emailSent) {
          await db.update(programApplications).set({ emailSent: true }).where(eq3(programApplications.id, application.id));
        }
        const adminEmail = generateAdminNotificationEmail(
          applicantFirstName,
          applicantLastName,
          referenceNumber,
          email,
          programNames,
          position || null,
          isCorporate ? organizationName || bankOrganisation : null
        );
        const isIobzProgram = programs.some(
          (p) => p.toLowerCase().includes("iobz") || p === "iobz_applied"
        );
        const adminRecipients = isIobzProgram ? ["admin@aiinstituteafrica.com", "marvellous@iobz.co.zw", "patiencemupikeni@gmail.com", "blessingisheanesu65@gmail.com"] : ["admin@aiinstituteafrica.com"];
        const emailAttachments = uploadedFile ? [{
          filename: uploadedFile.originalname,
          path: uploadedFile.path
        }] : [];
        for (const recipient of adminRecipients) {
          await sendRegistrationEmail({
            to: recipient,
            subject: `New Program Application - ${referenceNumber}`,
            html: adminEmail.html,
            text: adminEmail.text,
            attachments: emailAttachments
          });
        }
        res.status(201).json({
          message: "Application submitted successfully",
          referenceNumber,
          emailSent
        });
      } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ message: "Failed to submit application" });
      }
    });
  });
  app2.get("/api/admin/program-applications", isAdmin, async (_req, res) => {
    try {
      const applications = await db.select().from(programApplications).orderBy(desc(programApplications.createdAt));
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  app2.get("/api/admin/program-applications/:id", isAdmin, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const [application] = await db.select().from(programApplications).where(eq3(programApplications.id, applicationId));
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });
  app2.get("/api/admin/program-applications/:id/documents", isAdmin, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const [application] = await db.select().from(programApplications).where(eq3(programApplications.id, applicationId));
      if (!application) return res.status(404).json({ message: "Application not found" });
      const refNum = application.referenceNumber;
      if (!refNum) return res.json({ documents: [], referenceNumber: null });
      const documents = await db.execute(
        sql`SELECT id, reference_number, original_name, category, mime_type, file_size, file_path, created_at
            FROM application_documents WHERE reference_number = ${refNum} ORDER BY created_at DESC`
      );
      const docsWithUrls = documents.rows.map((d) => ({
        id: d.id,
        originalName: d.original_name,
        category: d.category,
        mimeType: d.mime_type,
        fileSize: Number(d.file_size),
        createdAt: d.created_at,
        downloadUrl: `/api/track/${refNum}/documents/${d.id}/download`
      }));
      res.json({ documents: docsWithUrls, referenceNumber: refNum });
    } catch (error) {
      console.error("Error fetching tracking documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });
  app2.patch("/api/admin/program-applications/:id", isAdmin, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const { status, adminNotes } = req.body;
      if (!["pending", "under_review", "accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const [application] = await db.select().from(programApplications).where(eq3(programApplications.id, applicationId));
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const [updated] = await db.update(programApplications).set({
        status,
        adminNotes,
        reviewedAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq3(programApplications.id, applicationId)).returning();
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
          text: statusEmail.text
        });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({ message: "Failed to update application" });
    }
  });
  app2.post("/api/admin/marketing-email", isAdmin, async (req, res) => {
    try {
      const { subject, message, htmlContent } = req.body;
      if (!subject || !message) {
        return res.status(400).json({ message: "Subject and message are required" });
      }
      const registeredUsers = await db.select({ email: users.email, name: users.name }).from(users).where(eq3(users.isActive, true));
      if (registeredUsers.length === 0) {
        return res.status(404).json({ message: "No registered users found" });
      }
      const emailResults = {
        total: registeredUsers.length,
        successful: 0,
        failed: 0,
        errors: []
      };
      for (const user of registeredUsers) {
        try {
          const personalizedMessage = message.replace(/{name}/g, user.name || "Valued Member");
          const personalizedHtml = htmlContent ? htmlContent.replace(/{name}/g, user.name || "Valued Member") : `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1e40af;">Hello ${user.name || "Valued Member"},</h2>
                <div style="margin: 20px 0; line-height: 1.6;">
                  ${personalizedMessage.replace(/\n/g, "<br>")}
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
            subject,
            text: personalizedMessage,
            html: personalizedHtml
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
          emailResults.errors.push(`Error sending to ${user.email}: ${emailError instanceof Error ? emailError.message : "Unknown error"}`);
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
  app2.post("/api/summit-applications", async (req, res) => {
    try {
      const { fullName, email, phone, country, organization, notes, selectedSummits } = req.body;
      if (!fullName || !email || !phone || !country) {
        return res.status(400).json({ message: "All required fields must be filled" });
      }
      if (!selectedSummits || !Array.isArray(selectedSummits) || selectedSummits.length === 0) {
        return res.status(400).json({ message: "Select at least one summit" });
      }
      const referenceNumber = `SUMMIT-${Date.now().toString(36).toUpperCase()}`;
      await db.insert(summitRegistrations).values({
        referenceNumber,
        fullName,
        email,
        phone,
        country,
        organization: organization || null,
        notes: notes || null,
        selectedSummits
      });
      const summitNames = selectedSummits.map((s) => s?.title || "Event").join(", ");
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
                <li>\u{1F4C4} <a href="${baseUrl}/docs/AI%20TECH%20FORUM%20ZIMBABWE%202026%20-%20SUMMARY.pdf" target="_blank" style="color: #0891b2; text-decoration: none; font-weight: bold;">AI Tech Forum Zimbabwe 2026 - Summary (PDF)</a></li>
                <li>\u{1F4C4} <a href="${baseUrl}/docs/NATIONAL%20AI%20SUMMIT%202026%20-%20SUMMARY.pdf" target="_blank" style="color: #0891b2; text-decoration: none; font-weight: bold;">National AI Summit 2026 - Summary (PDF)</a></li>
                <li>\u{1F4C4} <a href="${baseUrl}/docs/Masvingo%20Summit%20Price%20%26%20schedule%20%202026%20Summits%20pdf%20(3).pdf" target="_blank" style="color: #0891b2; text-decoration: none; font-weight: bold;">Masvingo Summit Price & Schedule (PDF)</a></li>
                <li>\u{1F5BC}\uFE0F <a href="${baseUrl}/docs/AI%20TECH%20FORUM%20FLIER.jpeg" target="_blank" style="color: #0891b2; text-decoration: none; font-weight: bold;">AI Tech Forum Flier (JPEG)</a></li>
                <li>\u{1F5BC}\uFE0F <a href="${baseUrl}/docs/AI%20FOR%20NATIONAL%20TRANSFORMATION%20FLIER.jpeg" target="_blank" style="color: #0891b2; text-decoration: none; font-weight: bold;">AI for National Transformation Flier (JPEG)</a></li>
              </ul>
            </div>

            <div style="background: #eff6ff; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #1e40af;">
              <p style="margin: 0 0 10px 0;"><strong>Next Step: Complete Your Booking</strong></p>
              <p style="margin: 0 0 15px 0;">Please use your reference number to access the payment portal and generate your invoice:</p>
              <a href="${portalLink}" style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Access Payment Portal \u2192</a>
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
        text: `Event Registration Confirmed

Dear ${fullName},

Thank you for registering. Reference: ${referenceNumber}
Events: ${summitNames}

Access your payment portal: ${portalLink}`,
        attachments: []
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
        text: `New Registration: ${fullName}, ${email}, Events: ${summitNames}`
      });
      res.json({
        message: "Registration successful",
        referenceNumber
      });
    } catch (error) {
      console.error("Error submitting summit application:", error);
      res.status(500).json({ message: "Failed to submit registration" });
    }
  });
  const applicantDocsStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dir = path2.join(process.cwd(), "uploads", "applicant-docs");
      fs3.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
      const ext = path2.extname(file.originalname);
      cb(null, `doc-${unique}${ext}`);
    }
  });
  const uploadApplicantDoc = multer({
    storage: applicantDocsStorage,
    limits: { fileSize: 50 * 1024 * 1024 }
    // 50MB
  }).single("file");
  app2.get("/api/track/:referenceNumber", async (req, res) => {
    const { referenceNumber } = req.params;
    try {
      const [application] = await db.select().from(programApplications).where(eq3(programApplications.referenceNumber, referenceNumber));
      if (!application) {
        return res.status(404).json({ message: "Application not found. Please check your reference number." });
      }
      const documents = await db.select().from(applicationDocuments).where(eq3(applicationDocuments.referenceNumber, referenceNumber)).orderBy(desc(applicationDocuments.uploadedAt));
      const timeline = await db.select().from(applicationTimeline).where(eq3(applicationTimeline.referenceNumber, referenceNumber)).orderBy(asc(applicationTimeline.createdAt));
      if (timeline.length === 0) {
        await db.insert(applicationTimeline).values({
          referenceNumber,
          status: "submitted",
          note: "Application successfully submitted.",
          updatedBy: "system",
          createdAt: application.createdAt
        });
        timeline.push({
          id: 0,
          referenceNumber,
          status: "submitted",
          note: "Application successfully submitted.",
          updatedBy: "system",
          createdAt: application.createdAt
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
          updatedAt: application.updatedAt
        },
        documents,
        timeline
      });
    } catch (err) {
      console.error("Track application error:", err);
      res.status(500).json({ message: "Failed to retrieve application" });
    }
  });
  app2.post("/api/track/:referenceNumber/documents", (req, res) => {
    const { referenceNumber } = req.params;
    uploadApplicantDoc(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message || "Upload failed" });
      if (!req.file) return res.status(400).json({ message: "No file provided" });
      try {
        const [application] = await db.select({ id: programApplications.id }).from(programApplications).where(eq3(programApplications.referenceNumber, referenceNumber));
        if (!application) {
          fs3.unlinkSync(req.file.path);
          return res.status(404).json({ message: "Application not found" });
        }
        const category = req.body.category || "Other";
        const [doc] = await db.insert(applicationDocuments).values({
          referenceNumber,
          fileName: req.file.filename,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          fileSize: req.file.size,
          filePath: req.file.path,
          category
        }).returning();
        await db.insert(applicationTimeline).values({
          referenceNumber,
          status: "document_uploaded",
          note: `Document uploaded: ${req.file.originalname}`,
          updatedBy: "applicant"
        });
        res.json({ message: "File uploaded successfully", document: doc });
      } catch (error) {
        console.error("Document upload error:", error);
        if (req.file) fs3.unlinkSync(req.file.path);
        res.status(500).json({ message: "Failed to save document" });
      }
    });
  });
  app2.delete("/api/track/:referenceNumber/documents/:docId", async (req, res) => {
    const { referenceNumber, docId } = req.params;
    try {
      const [doc] = await db.select().from(applicationDocuments).where(eq3(applicationDocuments.id, parseInt(docId)));
      if (!doc || doc.referenceNumber !== referenceNumber) {
        return res.status(404).json({ message: "Document not found" });
      }
      if (fs3.existsSync(doc.filePath)) fs3.unlinkSync(doc.filePath);
      await db.delete(applicationDocuments).where(eq3(applicationDocuments.id, parseInt(docId)));
      res.json({ message: "Document removed" });
    } catch (err) {
      console.error("Delete doc error:", err);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });
  app2.get("/api/track/:referenceNumber/documents/:docId/download", async (req, res) => {
    const { referenceNumber, docId } = req.params;
    try {
      const [doc] = await db.select().from(applicationDocuments).where(eq3(applicationDocuments.id, parseInt(docId)));
      if (!doc || doc.referenceNumber !== referenceNumber) {
        return res.status(404).json({ message: "Document not found" });
      }
      if (!fs3.existsSync(doc.filePath)) {
        return res.status(404).json({ message: "File no longer available" });
      }
      res.setHeader("Content-Disposition", `attachment; filename="${doc.originalName}"`);
      res.setHeader("Content-Type", doc.mimeType);
      res.sendFile(path2.resolve(doc.filePath));
    } catch (err) {
      res.status(500).json({ message: "Download failed" });
    }
  });
  app2.get("/api/track/:referenceNumber/cohort", async (req, res) => {
    const { referenceNumber } = req.params;
    try {
      const [application] = await db.select().from(programApplications).where(eq3(programApplications.referenceNumber, referenceNumber));
      if (!application) return res.status(404).json({ message: "Application not found" });
      if (application.status !== "accepted") return res.status(403).json({ message: "Cohort is only available once your application is accepted." });
      const programs = application.selectedPrograms;
      const programIds = programs.map((p) => p.id);
      const all = await db.select({
        referenceNumber: programApplications.referenceNumber,
        firstName: programApplications.firstName,
        trainingType: programApplications.trainingType,
        selectedPrograms: programApplications.selectedPrograms,
        createdAt: programApplications.createdAt
      }).from(programApplications).where(eq3(programApplications.status, "accepted"));
      const cohort = all.filter((m) => m.referenceNumber !== referenceNumber).filter((m) => {
        const mProgIds = m.selectedPrograms.map((p) => p.id);
        return programIds.some((id) => mProgIds.includes(id));
      }).map((m) => ({
        initial: m.firstName ? m.firstName[0].toUpperCase() + "." : "?",
        trainingType: m.trainingType,
        programs: m.selectedPrograms.map((p) => p.name),
        enrolledMonth: new Date(m.createdAt).toLocaleString("en-US", { month: "long", year: "numeric" })
      }));
      res.json({ cohort, total: cohort.length });
    } catch (err) {
      console.error("Cohort error:", err);
      res.status(500).json({ message: "Failed to load cohort" });
    }
  });
  app2.post("/api/track/:referenceNumber/documents/:docId/analyze", async (req, res) => {
    const { referenceNumber, docId } = req.params;
    try {
      const [doc] = await db.select().from(applicationDocuments).where(eq3(applicationDocuments.id, parseInt(docId)));
      if (!doc || doc.referenceNumber !== referenceNumber) return res.status(404).json({ message: "Document not found" });
      let analysis = "";
      const isImage = doc.mimeType.startsWith("image/");
      if (isImage && fs3.existsSync(doc.filePath)) {
        const base64 = fs3.readFileSync(doc.filePath).toString("base64");
        const result = await openaiClient.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "user",
            content: [
              { type: "text", text: `You are reviewing a document submitted for an AI training program application. The applicant labelled this document as: "${doc.category}". Please assess: 1) What type of document this appears to be, 2) Whether it is legible and appears valid, 3) Any issues or recommendations. Be concise (2-4 sentences). Start with "\u2713" if acceptable or "\u26A0" if there are concerns.` },
              { type: "image_url", image_url: { url: `data:${doc.mimeType};base64,${base64}` } }
            ]
          }],
          max_tokens: 200
        });
        analysis = result.choices[0]?.message?.content || "Unable to analyze.";
      } else {
        const sizeMB = (doc.fileSize / (1024 * 1024)).toFixed(2);
        const result = await openaiClient.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "user",
            content: `You are reviewing a document for an AI training program application. Details \u2014 Filename: "${doc.originalName}", File type: ${doc.mimeType}, Size: ${sizeMB} MB, Category: "${doc.category}". Based on this metadata, provide a brief assessment (2-3 sentences) of whether this seems like the right document type for the stated category, and any recommendations. Start with "\u2713" if it seems appropriate or "\u26A0" if there are concerns.`
          }],
          max_tokens: 150
        });
        analysis = result.choices[0]?.message?.content || "Unable to analyze.";
      }
      res.json({ analysis, documentName: doc.originalName, category: doc.category });
    } catch (err) {
      console.error("AI analyzer error:", err);
      res.status(500).json({ message: "AI analysis failed. Please try again." });
    }
  });
  app2.get("/api/track/:referenceNumber/referee-requests", async (req, res) => {
    const { referenceNumber } = req.params;
    try {
      const requests = await db.select().from(refereeRequests).where(eq3(refereeRequests.referenceNumber, referenceNumber));
      res.json(requests);
    } catch (err) {
      res.status(500).json({ message: "Failed to load referee requests" });
    }
  });
  app2.post("/api/track/:referenceNumber/referee-request", async (req, res) => {
    const { referenceNumber } = req.params;
    const { refereeName, refereeEmail } = req.body;
    if (!refereeName || !refereeEmail) return res.status(400).json({ message: "Referee name and email are required" });
    try {
      const [application] = await db.select({ firstName: programApplications.firstName, lastName: programApplications.lastName }).from(programApplications).where(eq3(programApplications.referenceNumber, referenceNumber));
      if (!application) return res.status(404).json({ message: "Application not found" });
      const token = __require("crypto").randomBytes(24).toString("hex");
      const [request] = await db.insert(refereeRequests).values({ referenceNumber, refereeName, refereeEmail, uniqueToken: token }).returning();
      const uploadUrl = `https://${process.env.REPLIT_DEV_DOMAIN || "aiinstituteafrica.com"}/referee/${token}`;
      await sendRegistrationEmail({
        to: refereeEmail,
        subject: `Reference Letter Request from ${application.firstName} ${application.lastName} \u2014 AI Institute Africa`,
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
            <p style="color:#666;font-size:12px;">AI Institute Africa \xB7 admin@aiinstituteafrica.com</p>
          </div>`,
        text: `Reference request from ${application.firstName} ${application.lastName}. Upload at: ${uploadUrl}`
      });
      await db.insert(applicationTimeline).values({ referenceNumber, status: "referee_invited", note: `Reference letter requested from ${refereeName} (${refereeEmail})`, updatedBy: "applicant" });
      res.json({ message: "Invitation sent successfully", request });
    } catch (err) {
      console.error("Referee request error:", err);
      res.status(500).json({ message: "Failed to send referee invitation" });
    }
  });
  app2.get("/api/referee/:token", async (req, res) => {
    const [request] = await db.select().from(refereeRequests).where(eq3(refereeRequests.uniqueToken, req.params.token));
    if (!request) return res.status(404).json({ message: "Invalid or expired link" });
    const [app3] = await db.select({ firstName: programApplications.firstName, lastName: programApplications.lastName }).from(programApplications).where(eq3(programApplications.referenceNumber, request.referenceNumber));
    res.json({ refereeName: request.refereeName, applicantName: app3 ? `${app3.firstName} ${app3.lastName}` : "the applicant", status: request.status });
  });
  app2.post("/api/referee/:token/submit", (req, res) => {
    uploadApplicantDoc(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });
      if (!req.file) return res.status(400).json({ message: "No file provided" });
      try {
        const [request] = await db.select().from(refereeRequests).where(eq3(refereeRequests.uniqueToken, req.params.token));
        if (!request) {
          fs3.unlinkSync(req.file.path);
          return res.status(404).json({ message: "Invalid or expired link" });
        }
        if (request.status === "received") {
          fs3.unlinkSync(req.file.path);
          return res.status(400).json({ message: "A reference letter has already been submitted for this request" });
        }
        const [doc] = await db.insert(applicationDocuments).values({
          referenceNumber: request.referenceNumber,
          fileName: req.file.filename,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          fileSize: req.file.size,
          filePath: req.file.path,
          category: "Reference Letter"
        }).returning();
        await db.update(refereeRequests).set({ status: "received", documentId: doc.id }).where(eq3(refereeRequests.uniqueToken, req.params.token));
        await db.insert(applicationTimeline).values({ referenceNumber: request.referenceNumber, status: "referee_submitted", note: `Reference letter received from ${request.refereeName}`, updatedBy: "referee" });
        res.json({ message: "Reference letter submitted successfully. Thank you!" });
      } catch (error) {
        if (req.file) fs3.unlinkSync(req.file.path);
        res.status(500).json({ message: "Submission failed" });
      }
    });
  });
  app2.patch("/api/crm/applications/:referenceNumber", async (req, res) => {
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
      const [application] = await db.select().from(programApplications).where(eq3(programApplications.referenceNumber, referenceNumber));
      if (!application) return res.status(404).json({ error: "Application not found" });
      const updateData = { updatedAt: /* @__PURE__ */ new Date() };
      if (status) updateData.status = status;
      if (adminNotes !== void 0) updateData.adminNotes = adminNotes;
      await db.update(programApplications).set(updateData).where(eq3(programApplications.referenceNumber, referenceNumber));
      if (status && status !== application.status) {
        await db.insert(applicationTimeline).values({
          referenceNumber,
          status,
          note: adminNotes || `Status updated to ${status}`,
          updatedBy: updatedBy || "CRM System"
        });
      }
      res.json({ success: true, referenceNumber, status: status || application.status });
    } catch (err) {
      console.error("CRM update error:", err);
      res.status(500).json({ error: "Failed to update application" });
    }
  });
  app2.get("/api/analytics", async (req, res) => {
    const apiKey = req.headers["x-api-key"] || req.query.api_key;
    const validKey = process.env.ANALYTICS_API_KEY;
    if (!apiKey || apiKey !== validKey) {
      return res.status(401).json({ error: "Unauthorized: invalid or missing API key" });
    }
    try {
      const now = /* @__PURE__ */ new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
      const [totalMembers] = await db.select({ count: sql`count(*)::int` }).from(users);
      const [activeMembers] = await db.select({ count: sql`count(*)::int` }).from(users).where(eq3(users.membershipStatus, "Active"));
      const [pendingMembers] = await db.select({ count: sql`count(*)::int` }).from(users).where(eq3(users.membershipStatus, "Pending"));
      const [freeMembers] = await db.select({ count: sql`count(*)::int` }).from(users).where(eq3(users.membershipType, "Free"));
      const [studentMembers] = await db.select({ count: sql`count(*)::int` }).from(users).where(eq3(users.membershipType, "Student"));
      const [fullMembers] = await db.select({ count: sql`count(*)::int` }).from(users).where(eq3(users.membershipType, "Full"));
      const [institutionMembers] = await db.select({ count: sql`count(*)::int` }).from(users).where(eq3(users.membershipType, "Institution"));
      const [newMembersLast30] = await db.select({ count: sql`count(*)::int` }).from(users).where(sql`created_at >= ${thirtyDaysAgo}`);
      const [newMembersLast7] = await db.select({ count: sql`count(*)::int` }).from(users).where(sql`created_at >= ${sevenDaysAgo}`);
      const [totalNewsletters] = await db.select({ count: sql`count(*)::int` }).from(newsletters);
      const [newslettersLast30] = await db.select({ count: sql`count(*)::int` }).from(newsletters).where(sql`created_at >= ${thirtyDaysAgo}`);
      const [totalContacts] = await db.select({ count: sql`count(*)::int` }).from(contacts);
      const [contactsLast30] = await db.select({ count: sql`count(*)::int` }).from(contacts).where(sql`created_at >= ${thirtyDaysAgo}`);
      const [totalApplications] = await db.select({ count: sql`count(*)::int` }).from(programApplications);
      const [pendingApplications] = await db.select({ count: sql`count(*)::int` }).from(programApplications).where(eq3(programApplications.status, "pending"));
      const [acceptedApplications] = await db.select({ count: sql`count(*)::int` }).from(programApplications).where(eq3(programApplications.status, "accepted"));
      const [rejectedApplications] = await db.select({ count: sql`count(*)::int` }).from(programApplications).where(eq3(programApplications.status, "rejected"));
      const [applicationsLast30] = await db.select({ count: sql`count(*)::int` }).from(programApplications).where(sql`created_at >= ${thirtyDaysAgo}`);
      const [totalSummitRegs] = await db.select({ count: sql`count(*)::int` }).from(summitRegistrations);
      const [summitRegsLast30] = await db.select({ count: sql`count(*)::int` }).from(summitRegistrations).where(sql`created_at >= ${thirtyDaysAgo}`);
      const [totalStudentLeads] = await db.select({ count: sql`count(*)::int` }).from(studentLeads);
      const [leadsLast30] = await db.select({ count: sql`count(*)::int` }).from(studentLeads).where(sql`created_at >= ${thirtyDaysAgo}`);
      const [totalEvents] = await db.select({ count: sql`count(*)::int` }).from(events);
      const [upcomingEvents] = await db.select({ count: sql`count(*)::int` }).from(events).where(eq3(events.status, "Upcoming"));
      const [totalHits] = await db.select({ count: sql`count(*)::int` }).from(pageVisits);
      const [hitsLast24h] = await db.select({ count: sql`count(*)::int` }).from(pageVisits).where(sql`visited_at >= now() - interval '24 hours'`);
      const [hitsLast7d] = await db.select({ count: sql`count(*)::int` }).from(pageVisits).where(sql`visited_at >= now() - interval '7 days'`);
      const [hitsLast30d] = await db.select({ count: sql`count(*)::int` }).from(pageVisits).where(sql`visited_at >= now() - interval '30 days'`);
      const [uniqueIpsTotal] = await db.select({ count: sql`count(distinct ip)::int` }).from(pageVisits);
      const [uniqueIpsLast7d] = await db.select({ count: sql`count(distinct ip)::int` }).from(pageVisits).where(sql`visited_at >= now() - interval '7 days'`);
      const [uniqueIpsLast30d] = await db.select({ count: sql`count(distinct ip)::int` }).from(pageVisits).where(sql`visited_at >= now() - interval '30 days'`);
      const topPages = await db.select({
        path: pageVisits.path,
        hits: sql`count(*)::int`
      }).from(pageVisits).where(sql`visited_at >= now() - interval '30 days'`).groupBy(pageVisits.path).orderBy(sql`count(*) desc`).limit(10);
      const recentMembers = await db.select({
        name: users.name,
        email: users.email,
        membershipType: users.membershipType,
        membershipStatus: users.membershipStatus,
        country: users.country,
        createdAt: users.createdAt
      }).from(users).orderBy(desc(users.createdAt)).limit(10);
      const recentApplicationsList = await db.select({
        referenceNumber: programApplications.referenceNumber,
        firstName: programApplications.firstName,
        lastName: programApplications.lastName,
        email: programApplications.email,
        trainingType: programApplications.trainingType,
        status: programApplications.status,
        createdAt: programApplications.createdAt
      }).from(programApplications).orderBy(desc(programApplications.createdAt)).limit(10);
      res.json({
        generatedAt: now.toISOString(),
        members: {
          total: totalMembers?.count || 0,
          active: activeMembers?.count || 0,
          pending: pendingMembers?.count || 0,
          byType: {
            free: freeMembers?.count || 0,
            student: studentMembers?.count || 0,
            full: fullMembers?.count || 0,
            institution: institutionMembers?.count || 0
          },
          newLast7Days: newMembersLast7?.count || 0,
          newLast30Days: newMembersLast30?.count || 0,
          recent: recentMembers
        },
        newsletter: {
          totalSubscribers: totalNewsletters?.count || 0,
          newLast30Days: newslettersLast30?.count || 0
        },
        contacts: {
          total: totalContacts?.count || 0,
          last30Days: contactsLast30?.count || 0
        },
        programApplications: {
          total: totalApplications?.count || 0,
          pending: pendingApplications?.count || 0,
          accepted: acceptedApplications?.count || 0,
          rejected: rejectedApplications?.count || 0,
          last30Days: applicationsLast30?.count || 0,
          recent: recentApplicationsList
        },
        summitRegistrations: {
          total: totalSummitRegs?.count || 0,
          last30Days: summitRegsLast30?.count || 0
        },
        studentLeads: {
          total: totalStudentLeads?.count || 0,
          last30Days: leadsLast30?.count || 0
        },
        events: {
          total: totalEvents?.count || 0,
          upcoming: upcomingEvents?.count || 0
        },
        traffic: {
          totalHits: totalHits?.count || 0,
          hitsLast24Hours: hitsLast24h?.count || 0,
          hitsLast7Days: hitsLast7d?.count || 0,
          hitsLast30Days: hitsLast30d?.count || 0,
          uniqueVisitorsAllTime: uniqueIpsTotal?.count || 0,
          uniqueVisitorsLast7Days: uniqueIpsLast7d?.count || 0,
          uniqueVisitorsLast30Days: uniqueIpsLast30d?.count || 0,
          topPageslast30Days: topPages
        }
      });
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });
  app2.get("/api/summit-portal/:referenceNumber", async (req, res) => {
    try {
      const { referenceNumber } = req.params;
      const [registration] = await db.select().from(summitRegistrations).where(eq3(summitRegistrations.referenceNumber, referenceNumber)).limit(1);
      if (!registration) {
        return res.status(404).json({ message: "Registration not found. Please check your reference number." });
      }
      const [invoice] = await db.select().from(summitInvoices).where(eq3(summitInvoices.referenceNumber, referenceNumber)).limit(1);
      res.json({ registration, invoice: invoice || null });
    } catch (error) {
      console.error("Summit portal lookup error:", error);
      res.status(500).json({ message: "Failed to fetch registration" });
    }
  });
  app2.post("/api/summit-portal/:referenceNumber/invoice", async (req, res) => {
    try {
      const { referenceNumber } = req.params;
      const {
        paymentMethod,
        currency,
        numberOfDelegates,
        packageType,
        packageDescription,
        packagePrice,
        summitEvent,
        address,
        secondEventPrice,
        bothEvents,
        sponsorshipPrice
      } = req.body;
      const [registration] = await db.select().from(summitRegistrations).where(eq3(summitRegistrations.referenceNumber, referenceNumber)).limit(1);
      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }
      const numDelegates = parseInt(numberOfDelegates);
      const price1 = parseFloat(packagePrice);
      const price2 = parseFloat(secondEventPrice || "0");
      const pricePerDelegate = bothEvents === true || bothEvents === "true" ? price1 + price2 : price1;
      const sp = parseFloat(sponsorshipPrice || "0");
      const totalAmount = (pricePerDelegate * numDelegates + sp).toFixed(2);
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
        summitEvent
      }).returning();
      res.json({ invoice, message: "Invoice generated successfully" });
    } catch (error) {
      console.error("Invoice generation error:", error);
      res.status(500).json({ message: "Failed to generate invoice" });
    }
  });
  app2.get("/api/admin/invoices", isAdmin, async (_req, res) => {
    try {
      const invoices = await db.select().from(summitInvoices).orderBy(desc(summitInvoices.createdAt));
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });
  app2.post("/api/admin/invoices/:id/email", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { pdfBase64, emailBody, emailSubject } = req.body;
      if (!pdfBase64) {
        return res.status(400).json({ message: "PDF data is required" });
      }
      const [invoice] = await db.select().from(summitInvoices).where(eq3(summitInvoices.id, parseInt(id))).limit(1);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      const subject = emailSubject || `Your Summit Invoice - ${invoice.invoiceNumber}`;
      const bodyHtml = emailBody ? `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111; line-height: 1.6; padding: 24px; background: #ffffff;">
            ${emailBody.replace(/\r\n/g, "\n").replace(/\n/g, "<br/>")}
          </div>` : `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111; line-height: 1.6; padding: 24px; background: #ffffff;">
            <h2 style="color: #1e40af; margin: 0 0 12px 0;">Summit Payment Invoice</h2>
            <p style="margin: 0 0 12px 0;">Dear ${invoice.fullName},</p>
            <p style="margin: 0 0 16px 0;">Please find your invoice attached to this email.</p>
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
              <p style="margin: 0;"><strong>Total Amount:</strong> ${invoice.currency} ${invoice.totalAmount}</p>
            </div>
            <p style="margin: 0 0 12px 0;">Thank you for choosing AI Institute Africa.</p>
            <p style="margin: 0;">Best regards,<br/>AI Institute Africa</p>
          </div>`;
      const base64Data = pdfBase64.includes("base64,") ? pdfBase64.split("base64,").pop() : pdfBase64;
      const pdfBuffer = Buffer.from(base64Data, "base64");
      const sent = await sendRegistrationEmail({
        to: invoice.email,
        subject,
        html: bodyHtml,
        text: emailBody || `Invoice ${invoice.invoiceNumber} \u2013 ${invoice.currency} ${invoice.totalAmount}`,
        attachments: [{ filename: `Invoice-${invoice.invoiceNumber}.pdf`, content: pdfBuffer }]
      });
      if (!sent) {
        return res.status(500).json({ message: "Failed to send email. Check server logs." });
      }
      res.json({ message: "Invoice emailed successfully" });
    } catch (error) {
      console.error("Admin invoice email error:", error);
      res.status(500).json({ message: "Failed to send invoice email" });
    }
  });
  app2.patch("/api/admin/invoices/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const safeUpdates = {};
      const allowedFields = [
        "fullName",
        "organization",
        "address",
        "email",
        "phone",
        "paymentMethod",
        "currency",
        "numberOfDelegates",
        "packageType",
        "packageDescription",
        "packagePrice",
        "secondEventPrice",
        "bothEvents",
        "totalAmount",
        "summitEvent",
        "referenceNumber",
        "invoiceNumber"
      ];
      for (const field of allowedFields) {
        if (field in body) {
          safeUpdates[field] = field === "numberOfDelegates" ? parseInt(body[field]) : body[field];
        }
      }
      if (Object.keys(safeUpdates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      const [updated] = await db.update(summitInvoices).set(safeUpdates).where(eq3(summitInvoices.id, parseInt(id))).returning();
      if (!updated) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating invoice:", error);
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });
  app2.post("/api/summit-portal/:referenceNumber/email-invoice", async (req, res) => {
    try {
      const { referenceNumber } = req.params;
      const { pdfBase64, emailBody } = req.body;
      if (!pdfBase64) {
        return res.status(400).json({ message: "PDF data is required" });
      }
      const [registration] = await db.select().from(summitRegistrations).where(eq3(summitRegistrations.referenceNumber, referenceNumber)).limit(1);
      const [invoice] = await db.select().from(summitInvoices).where(eq3(summitInvoices.referenceNumber, referenceNumber)).limit(1);
      if (!registration || !invoice) {
        return res.status(404).json({ message: "Registration or invoice not found" });
      }
      let emailHtml = emailBody;
      if (!emailBody) {
        emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111; line-height: 1.6; padding: 24px; background: #ffffff;">
          <h2 style="color: #1e40af; margin: 0 0 12px 0;">Summit Payment Invoice</h2>
          <p style="margin: 0 0 12px 0;">Dear ${registration.fullName},</p>
          <p style="margin: 0 0 16px 0;">Your invoice for the upcoming summit has been generated successfully. Please find the PDF invoice attached to this email.</p>
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
            <p style="margin: 0;"><strong>Total Amount:</strong> ${invoice.currency} ${invoice.totalAmount}</p>
          </div>
          <p style="margin: 0 0 12px 0;">Please proceed to make the payment using your selected method and submit the proof of payment through the portal.</p>
          <p style="margin: 0;">Thank you,<br/>AI Institute Africa</p>
        </div>
      `;
      } else {
        const bodyWithBreaks = emailBody.replace(/\r\n/g, "\n").replace(/\n/g, "<br/>");
        emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111; line-height: 1.6; padding: 24px; background: #ffffff;">
          ${bodyWithBreaks}
        </div>
      `;
      }
      const base64Data = pdfBase64.includes("base64,") ? pdfBase64.split("base64,").pop() : pdfBase64;
      const pdfBuffer = Buffer.from(base64Data, "base64");
      const applicantEmailSent = await sendRegistrationEmail({
        to: registration.email,
        subject: `Your Summit Invoice - ${invoice.invoiceNumber}`,
        html: emailHtml,
        text: emailBody || `Your Invoice: ${invoice.invoiceNumber}. Total: ${invoice.currency} ${invoice.totalAmount}`,
        attachments: [{ filename: `Invoice-${invoice.invoiceNumber}.pdf`, content: pdfBuffer }]
      });
      const adminEmailSent = await sendRegistrationEmail({
        to: "admin@aiinstituteafrica.com",
        subject: `New Invoice Generated - ${invoice.invoiceNumber} (${registration.fullName})`,
        html: emailHtml,
        text: `New Invoice: ${invoice.invoiceNumber} for ${registration.fullName}.`,
        attachments: [{ filename: `Invoice-${invoice.invoiceNumber}.pdf`, content: pdfBuffer }]
      });
      if (!applicantEmailSent || !adminEmailSent) {
        return res.status(500).json({ message: "Failed to send one or more emails. Check server logs for details." });
      }
      res.json({ message: "Invoice emailed successfully" });
    } catch (error) {
      console.error("Invoice generation error:", error);
      res.status(500).json({ message: "Failed to generate invoice" });
    }
  });
  const paymentProofStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dir = path2.join(process.cwd(), "uploads", "payment-proofs");
      fs3.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
      const ext = path2.extname(file.originalname);
      cb(null, `proof-${unique}${ext}`);
    }
  });
  const uploadPaymentProof = multer({ storage: paymentProofStorage, limits: { fileSize: 10 * 1024 * 1024 } }).single("proof");
  app2.post("/api/summit-portal/:referenceNumber/payment-proof", (req, res) => {
    uploadPaymentProof(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });
      try {
        const { referenceNumber } = req.params;
        const { payerName, paymentReference, paymentDate, paymentLocation } = req.body;
        const [registration] = await db.select().from(summitRegistrations).where(eq3(summitRegistrations.referenceNumber, referenceNumber)).limit(1);
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
          proofFilePath
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
          attachments
        });
        res.json({ message: "Payment proof submitted successfully" });
      } catch (error) {
        console.error("Payment proof error:", error);
        res.status(500).json({ message: "Failed to submit payment proof" });
      }
    });
  });
  app2.use("/uploads/payment-proofs", express3.static(path2.join(process.cwd(), "uploads", "payment-proofs")));
  app2.use("/docs", express3.static(path2.join(process.cwd(), "docs")));
  app2.post("/api/summit-portal/:referenceNumber/delegates", async (req, res) => {
    try {
      const { referenceNumber } = req.params;
      const { delegates } = req.body;
      if (!delegates || !Array.isArray(delegates) || delegates.length === 0) {
        return res.status(400).json({ message: "Please provide at least one delegate" });
      }
      const [registration] = await db.select().from(summitRegistrations).where(eq3(summitRegistrations.referenceNumber, referenceNumber)).limit(1);
      if (!registration) return res.status(404).json({ message: "Registration not found" });
      await db.insert(summitDelegates).values({
        referenceNumber,
        delegates
      });
      const delegateRows = delegates.map(
        (name, i) => `<tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${i + 1}</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${name}</td></tr>`
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
        text: `Delegate list from ${registration.fullName} (ref: ${referenceNumber}):
${delegates.map((n, i) => `${i + 1}. ${n}`).join("\n")}`
      });
      res.json({ message: "Delegate list submitted successfully" });
    } catch (error) {
      console.error("Delegate list error:", error);
      res.status(500).json({ message: "Failed to submit delegate list" });
    }
  });
  app2.post("/api/summit-portal/register-new", async (req, res) => {
    try {
      const { fullName, email, organization, phone } = req.body;
      if (!fullName || !email || !phone) {
        return res.status(400).json({ message: "Full name, email, and phone number are required" });
      }
      const referenceNumber = `SUMMIT-${Date.now().toString(36).toUpperCase()}`;
      const [registration] = await db.insert(summitRegistrations).values({
        referenceNumber,
        fullName,
        email,
        phone,
        organization: organization || null,
        country: "Zimbabwe",
        // Default country for now
        notes: "Created via direct portal access",
        selectedSummits: []
      }).returning();
      res.json({
        message: "Registration created successfully",
        referenceNumber,
        registration
      });
    } catch (error) {
      console.error("Registration creation error:", error);
      res.status(500).json({ message: "Failed to create registration" });
    }
  });
  return httpServer;
}

// server/index.ts
import session from "express-session";
import { Pool as Pool2, neonConfig as neonConfig2 } from "@neondatabase/serverless";
import connectPgSimple from "connect-pg-simple";
import { execSync } from "child_process";
import path6 from "path";
import fs6 from "fs";
import ws2 from "ws";
neonConfig2.webSocketConstructor = ws2;
process.on("uncaughtException", (err) => {
  const errMsg = err?.message || "";
  if (errMsg.includes("Cannot set property message") || errMsg.includes("EADDRNOTAVAIL") || err?.code === "ERR_UNHANDLED_ERROR" || err?.code === "EADDRNOTAVAIL") {
    console.warn("[DB] Suppressed network/WebSocket error \u2013 server continues running:", errMsg);
    return;
  }
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  console.warn("[DB] Unhandled rejection (non-fatal):", reason?.message || reason);
});
var app = express5();
app.use(express5.json({ limit: "100mb" }));
app.use(express5.urlencoded({ extended: false, limit: "100mb" }));
var pool2 = new Pool2({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 1e4,
  idleTimeoutMillis: 6e4,
  max: 20
});
var startTime = Date.now();
console.log("Starting server initialization...");
var PostgresStore = connectPgSimple(session);
var sessionStore = new PostgresStore({
  pool: pool2,
  createTableIfMissing: true,
  pruneSessionInterval: 60
});
app.use(
  session({
    store: sessionStore,
    secret: process.env.REPL_ID || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      // In deployment, we need to allow non-secure cookies since we might not have HTTPS
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1e3,
      // 30 days
      httpOnly: true,
      sameSite: "lax"
    },
    name: "aiia.sid"
    // Custom session cookie name
  })
);
app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = function(...args) {
    console.log(`[${req.method}] ${req.path} - Content-Type:`, res.getHeader("content-type"));
    return oldSend.apply(res, args);
  };
  next();
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  const start = Date.now();
  const path7 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path7.startsWith("/api")) {
      let logLine = `${req.method} ${path7} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      console.log(logLine);
    }
  });
  next();
});
var articleImagesDir2 = path6.join(process.cwd(), "client", "src", "lib", "articleimages");
if (!fs6.existsSync(articleImagesDir2)) {
  fs6.mkdirSync(articleImagesDir2, { recursive: true });
  console.log("Article images directory created:", articleImagesDir2);
} else {
  console.log("Article images directory verified:", articleImagesDir2);
}
app.use("/lib/articleimages", express5.static(articleImagesDir2));
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
(async () => {
  try {
    console.log("Testing database connection...");
    let connected = false;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        await pool2.query("SELECT 1");
        connected = true;
        console.log(`Database connection successful (${Date.now() - startTime}ms)`);
        break;
      } catch (err) {
        console.warn(`DB connection attempt ${attempt}/5 failed: ${err.message}`);
        if (attempt < 5) {
          await new Promise((r) => setTimeout(r, 5e3));
        }
      }
    }
    if (!connected) {
      throw new Error("Could not connect to database after 5 attempts");
    }
    const { runMigrations: runMigrations2 } = await Promise.resolve().then(() => (init_migrationRunner(), migrationRunner_exports));
    await runMigrations2();
    const server = registerRoutes(app);
    app.use((err, _req, res, _next) => {
      console.error("Error in request handling:", err);
      console.error("Stack trace:", err.stack);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message, stack: err.stack });
    });
    const staticConfig = {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".js")) {
          res.setHeader("Content-Type", "application/javascript");
        } else if (filePath.endsWith(".css")) {
          res.setHeader("Content-Type", "text/css");
        }
      }
    };
    if (process.env.NODE_ENV === "production") {
      const distPath = path6.join(process.cwd(), "dist", "public");
      console.log("Serving static files from:", distPath);
      app.use(express5.static(distPath, staticConfig));
      app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api")) {
          next();
        } else {
          console.log("SPA fallback for:", req.path);
          res.sendFile(path6.join(distPath, "index.html"));
        }
      });
    } else {
      const { setupVite: setupVite2 } = await Promise.resolve().then(() => (init_vite(), vite_exports));
      await setupVite2(app, server);
    }
    const HOST = "0.0.0.0";
    const PORT = 5e3;
    const MAX_RETRIES = 3;
    let retryCount = 0;
    const killPortProcess = () => {
      try {
        console.log("Attempting to find processes on port 5000...");
        const result = execSync("lsof -i :5000 -t");
        const pids = result.toString().trim().split("\n");
        for (const pid of pids) {
          console.log(`Attempting to kill process ${pid}...`);
          execSync(`kill -9 ${pid}`);
          console.log(`Successfully killed process ${pid} on port ${PORT}`);
        }
        return true;
      } catch (error) {
        if (error instanceof Error) {
          console.log(`Error while killing port process: ${error.message}`);
          if (error.stack) {
            console.log(`Stack trace: ${error.stack}`);
          }
        }
        return false;
      }
    };
    const startServer = () => {
      if (retryCount > 0) {
        killPortProcess();
        console.log(`Waiting for port ${PORT} to be available...`);
      }
      server.listen(PORT, HOST, () => {
        console.log(`Server running at http://${HOST}:${PORT} (${Date.now() - startTime}ms total startup time)`);
        console.log(`Application is ready for connections`);
      }).on("error", (error) => {
        console.error("Server error:", error);
        if (error.stack) {
          console.error("Stack trace:", error.stack);
        }
        if (error.code === "EADDRINUSE" && retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`Port ${PORT} in use, attempting retry ${retryCount} of ${MAX_RETRIES}...`);
          setTimeout(startServer, 2e3);
        } else {
          console.error(`Failed to start server after ${retryCount} retries:`, error);
          process.exit(1);
        }
      });
    };
    startServer();
  } catch (error) {
    console.error("Failed to start server:", error);
    if (error instanceof Error && error.stack) {
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  }
})();
