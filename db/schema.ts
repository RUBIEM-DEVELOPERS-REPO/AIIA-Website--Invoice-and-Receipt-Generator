import { pgTable, text, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Base tables
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const membershipCount = pgTable("membership_count", {
  id: serial("id").primaryKey(),
  count: integer("count").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  requirement: text("requirement", {
    enum: ["Free", "Membership"]
  }).notNull().default("Free"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const localArticles = pgTable("local_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  requirement: text("requirement", {
    enum: ["Free", "Membership"]
  }).notNull().default("Free"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: text("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status", {
    enum: ["Pending", "Completed", "Failed", "Refunded"]
  }).notNull().default("Pending"),
  paymentMethod: text("payment_method"),
  billingAddress: text("billing_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const admins = pgTable("admins", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const studentLeads = pgTable("student_leads", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  courseInterest: text("course_interest", {
    enum: ["3_day", "6_month", "12_month"]
  }).notNull(),
  educationLevel: text("education_level"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const programApplications = pgTable("program_applications", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const summitRegistrations = pgTable("summit_registrations", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const applicationDocuments = pgTable("application_documents", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  filePath: text("file_path").notNull(),
  category: text("category").notNull().default("Other"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const applicationTimeline = pgTable("application_timeline", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull(),
  status: text("status").notNull(),
  note: text("note"),
  updatedBy: text("updated_by").notNull().default("system"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const refereeRequests = pgTable("referee_requests", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull(),
  refereeName: text("referee_name").notNull(),
  refereeEmail: text("referee_email").notNull(),
  uniqueToken: text("unique_token").unique().notNull(),
  status: text("status").notNull().default("pending"),
  documentId: integer("document_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pageVisits = pgTable("page_visits", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  ip: text("ip").notNull(),
  userAgent: text("user_agent"),
  referer: text("referer"),
  visitedAt: timestamp("visited_at").defaultNow().notNull(),
});

export const summitInvoices = pgTable("summit_invoices", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const summitPaymentProofs = pgTable("summit_payment_proofs", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull(),
  payerName: text("payer_name").notNull(),
  paymentReference: text("payment_reference").notNull(),
  paymentDate: text("payment_date").notNull(),
  paymentLocation: text("payment_location").notNull(),
  proofFilePath: text("proof_file_path"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const summitDelegates = pgTable("summit_delegates", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull(),
  delegates: jsonb("delegates").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const summitReceipts = pgTable("summit_receipts", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull().references(() => summitInvoices.id),
  referenceNumber: text("reference_number").notNull(),
  receiptNumber: text("receipt_number").notNull(),
  fullName: text("full_name").notNull(),
  organization: text("organization"),
  paymentDate: text("payment_date").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentReference: text("payment_reference"),
  amountPaid: text("amount_paid").notNull(),
  currency: text("currency").notNull().default("USD"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schema validations
export const insertSummitRegistrationSchema = createInsertSchema(summitRegistrations);
export const selectSummitRegistrationSchema = createSelectSchema(summitRegistrations);
export const insertContactSchema = createInsertSchema(contacts);
export const selectContactSchema = createSelectSchema(contacts);
export const insertNewsletterSchema = createInsertSchema(newsletters);
export const selectNewsletterSchema = createSelectSchema(newsletters);
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertPaymentSchema = createInsertSchema(payments);
export const selectPaymentSchema = createSelectSchema(payments);
export const insertEventSchema = createInsertSchema(events);
export const selectEventSchema = createSelectSchema(events);
export const insertArticleSchema = createInsertSchema(articles);
export const selectArticleSchema = createSelectSchema(articles);
export const insertLocalArticleSchema = createInsertSchema(localArticles);
export const selectLocalArticleSchema = createSelectSchema(localArticles);

export const insertAdminSchema = createInsertSchema(admins, {
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  role: z.enum(["super_admin", "content_admin", "member_admin"]),
});

export const selectAdminSchema = createSelectSchema(admins);

export const insertStudentLeadSchema = createInsertSchema(studentLeads, {
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  courseInterest: z.enum(["3_day", "6_month", "12_month"]),
  educationLevel: z.string().optional(),
});
export const selectStudentLeadSchema = createSelectSchema(studentLeads);

export const insertProgramApplicationSchema = createInsertSchema(programApplications, {
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
    category: z.string().optional(),
  })).min(1, "Select at least one program"),
});
export const selectProgramApplicationSchema = createSelectSchema(programApplications);

export const insertSummitReceiptSchema = createInsertSchema(summitReceipts);
export const selectSummitReceiptSchema = createSelectSchema(summitReceipts);

// Type definitions
export type InsertContact = typeof contacts.$inferInsert;
export type SelectContact = typeof contacts.$inferSelect;
export type InsertNewsletter = typeof newsletters.$inferInsert;
export type SelectNewsletter = typeof newsletters.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
export type SelectPayment = typeof payments.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;
export type SelectEvent = typeof events.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;
export type SelectArticle = typeof articles.$inferSelect;
export type InsertLocalArticle = typeof localArticles.$inferInsert;
export type SelectLocalArticle = typeof localArticles.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;
export type SelectAdmin = typeof admins.$inferSelect;
export type InsertStudentLead = typeof studentLeads.$inferInsert;
export type SelectStudentLead = typeof studentLeads.$inferSelect;
export type InsertProgramApplication = typeof programApplications.$inferInsert;
export type SelectProgramApplication = typeof programApplications.$inferSelect;
export type InsertSummitRegistration = typeof summitRegistrations.$inferInsert;
export type SelectSummitRegistration = typeof summitRegistrations.$inferSelect;
export type InsertSummitReceipt = typeof summitReceipts.$inferInsert;
export type SelectSummitReceipt = typeof summitReceipts.$inferSelect;

// Additional validation schemas
export const userRegistrationSchema = z.object({
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
  country: z.string().optional(),
});

export const paymentProcessSchema = z.object({
  userId: z.number(),
  amount: z.string(),
  currency: z.string().default("USD"),
  paymentMethod: z.string(),
  billingAddress: z.string(),
});

export const eventCreationSchema = z.object({
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
  status: z.enum(["Upcoming", "Ongoing", "Completed", "Cancelled"]).default("Upcoming"),
});