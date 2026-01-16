import nodemailer from "nodemailer";
const logoImage = "client/src/lib/logos/preloader.png";

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const port_alternatives: number[] = [2525, 8025, 587]; // Only use the first three ports for attempts

export async function sendRegistrationEmail(
  params: EmailParams,
): Promise<boolean> {
  for (const port of port_alternatives) {
    try {
      const transporter = nodemailer.createTransport({
        host: "mail.smtp2go.com", // Using the primary SMTP server
        port: port,
        secure: false, // TLS required for port
        auth: {
          user: process.env.SMTP2GO_USERNAME,
          pass: process.env.SMTP2GO_PASSWORD,
        },
        // Adding recommended production settings
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,
        socketTimeout: 10000,
        debug: process.env.NODE_ENV !== "production", // Enable debug logs in development
        logger: process.env.NODE_ENV !== "production",
      });

      // Verify connection configuration before sending
      await transporter.verify();

      const result = await transporter.sendMail({
        from: {
          name: "AI Institute Africa",
          address:
            process.env.SMTP2GO_FROM_EMAIL || "no-reply@aiinstituteafrica.com",
        },
        to: params.to,
        subject: params.subject,
        text: params.text || "",
        html: params.html || params.text || "",
        attachments: [
          {
            filename: "preloader.png", // Name for the attachment
            path: logoImage, // Using the imported image path
            cid: "preloader", // Content-ID reference for embedding
          },
        ],
      });

      console.log("Email sent successfully:", result.messageId);
      return true; // Return true if email is sent successfully
    } catch (error) {
      console.error(`SMTP2GO email error on port ${port}:`, error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Stack trace:", error.stack);
      }
    }
  }

  return false; // Return false if all attempts fail
}

export function generateRegistrationEmailContent(
  name: string,
  membershipType: string,
  memberKey: string,
) {
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

  const text = `
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

  return { html, text };
}

export function generatePasswordResetEmailContent(
  name: string,
  resetToken: string,
  resetUrl: string,
) {
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

  const text = `
Password Reset Request

Dear ${name},

We received a request to reset your password for your AI Institute Africa account.

To reset your password, please visit the following link (expires in 1 hour):
${resetUrl}

If you did not request a password reset, please ignore this email or contact our support team if you have concerns.

Best regards,
AI Institute Africa Team
  `;

  return { html, text };
}

export async function sendPasswordResetEmail(
  params: EmailParams,
): Promise<boolean> {
  return sendRegistrationEmail(params); // Use the same email sending mechanism
}

export function generateApplicationConfirmationEmail(
  firstName: string,
  lastName: string,
  referenceNumber: string,
  selectedPrograms: Array<{ name: string; category?: string }>,
) {
  const programList = selectedPrograms
    .map((p) => `<li>${p.name}${p.category ? ` (${p.category})` : ""}</li>`)
    .join("");

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

  const text = `
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

  return { html, text };
}

export function generateApplicationStatusEmail(
  firstName: string,
  lastName: string,
  referenceNumber: string,
  status: "accepted" | "rejected",
  adminNotes?: string,
) {
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
      ${
        isAccepted
          ? `
        <p><strong>Congratulations!</strong> You have been accepted into our program. Here are your next steps:</p>
        <ol style="line-height: 1.8;">
          <li>Review the enrollment package that will be sent separately</li>
          <li>Complete the payment for your selected program(s)</li>
          <li>Submit any additional required documents</li>
        </ol>
        <p>Our team will contact you shortly with further details about the enrollment process.</p>
      `
          : `
        <p>We appreciate your interest in AI Institute Africa. While we were unable to accept your application at this time, we encourage you to:</p>
        <ul style="line-height: 1.8;">
          <li>Review the admission requirements for future intakes</li>
          <li>Consider our shorter programs that may have different requirements</li>
          <li>Contact us for feedback on how to strengthen your application</li>
        </ul>
      `
      }
      <p>If you have any questions, please contact us at <a href="mailto:admin@aiinstituteafrica.com">admin@aiinstituteafrica.com</a></p>
      <p style="margin-top: 30px;">Best regards,<br><strong>AI Institute Africa Admissions Team</strong></p>
    </div>
  `;

  const text = `
Application ${statusText}

Dear ${firstName} ${lastName},

We have reviewed your application (Reference: ${referenceNumber}) for AI Institute Africa.

Status: ${statusText}
${adminNotes ? `Notes: ${adminNotes}` : ""}

${
    isAccepted
      ? `Congratulations! You have been accepted into our program. Our team will contact you shortly with further details about the enrollment process.`
      : `We appreciate your interest in AI Institute Africa. While we were unable to accept your application at this time, we encourage you to review the admission requirements for future intakes.`
  }

If you have any questions, please contact us at admin@aiinstituteafrica.com

Best regards,
AI Institute Africa Admissions Team
  `;

  return { html, text };
}

export function generateAdminNotificationEmail(
  applicantName: string,
  referenceNumber: string,
  email: string,
  selectedPrograms: Array<{ name: string; category?: string }>,
) {
  const programList = selectedPrograms
    .map((p) => `<li>${p.name}${p.category ? ` (${p.category})` : ""}</li>`)
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0891b2;">New Program Application</h2>
      <p>A new program application has been submitted and requires review.</p>
      <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <p style="margin: 0 0 10px 0;"><strong>Reference:</strong> ${referenceNumber}</p>
        <p style="margin: 0 0 10px 0;"><strong>Applicant:</strong> ${applicantName}</p>
        <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 0;"><strong>Programs:</strong></p>
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
          ${programList}
        </ul>
      </div>
      <p>Please log in to the admin panel to review and process this application.</p>
    </div>
  `;

  const text = `
New Program Application

Reference: ${referenceNumber}
Applicant: ${applicantName}
Email: ${email}
Programs: ${selectedPrograms.map((p) => p.name).join(", ")}

Please log in to the admin panel to review and process this application.
  `;

  return { html, text };
}