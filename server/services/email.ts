import nodemailer from "nodemailer";
import fs from "fs/promises";
import https from "https";

const logoImage = "client/src/lib/logos/AiiA Logo.png";

function httpsPost(url: string, headers: Record<string, string>, body: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const postData = typeof body === "string" ? body : JSON.stringify(body);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: "POST",
      headers: {
        ...headers,
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(responseBody);
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP Status ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(responseBody);
          } else {
            reject(new Error(`HTTP Status ${res.statusCode}: ${responseBody}`));
          }
        }
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

interface EmailAttachment {
  filename: string;
  path?: string;
  content?: string;
  contentType?: string;
  cid?: string;
}

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
}

function createTransporter() {
  const host = process.env.SMTP_HOST || "mail.smtp2go.com";
  const port = parseInt(process.env.SMTP_PORT || "2525", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER || process.env.SMTP2GO_USERNAME;
  const pass = process.env.SMTP_PASS || process.env.SMTP2GO_PASSWORD;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

export async function sendRegistrationEmail(
  params: EmailParams,
): Promise<boolean> {
  try {
    const sendpulseApiKey = process.env.SENDPULSE_API_KEY;
    const sendpulseClientId = process.env.SENDPULSE_CLIENT_ID;
    const sendpulseClientSecret = process.env.SENDPULSE_CLIENT_SECRET;
    const apiKey = process.env.SMTP2GO_API_KEY;
    const senderEmail = process.env.SMTP_FROM || process.env.SMTP2GO_FROM_EMAIL || "admin@aiinstituteafrica.com";
    const logoUrl = process.env.LOGO_URL;

    // Replace inline logo CID with external URL if configured
    let htmlContent = params.html || params.text || "";
    if (logoUrl) {
      htmlContent = htmlContent.replace(/cid:preloader/g, logoUrl);
    }

    // Build attachments array - always include logo, add any additional attachments
    const allAttachments = [
      {
        filename: "preloader.png",
        path: logoImage,
        cid: "preloader",
      },
      ...(params.attachments || []),
    ];

    let accessToken = sendpulseApiKey;

    if (!accessToken && sendpulseClientId && sendpulseClientSecret) {
      console.log("Requesting access token from SendPulse via client credentials...");
      // Get Access Token
      const tokenData = await httpsPost("https://api.sendpulse.com/oauth/access_token", {
        "Content-Type": "application/json"
      }, {
        grant_type: "client_credentials",
        client_id: sendpulseClientId,
        client_secret: sendpulseClientSecret
      });

      if (!tokenData || !tokenData.access_token) {
        throw new Error(`SendPulse Auth Error: ${JSON.stringify(tokenData)}`);
      }

      accessToken = tokenData.access_token;
    }

    if (accessToken) {
      console.log("Sending email via SendPulse REST API...");

      // Build attachments
      const attachmentsBinary: Record<string, string> = {};
      for (const att of allAttachments) {
        // Skip attaching the preloader if we replaced it with a web URL
        if (att.cid === "preloader" && logoUrl) {
          continue;
        }
        try {
          let fileblob = "";
          if (att.content) {
            const cleaned = att.content.replace(/^data:[^;]+;base64,/, "").trim();
            if (!cleaned) continue;
            fileblob = cleaned;
          } else if (att.path) {
            const fileBuffer = await fs.readFile(att.path);
            fileblob = fileBuffer.toString("base64");
          } else {
            continue;
          }
          attachmentsBinary[att.filename] = fileblob;
        } catch (e) {
          console.warn(`Could not process attachment for SendPulse: ${att.filename}`, e);
        }
      }

      const payload: any = {
        email: {
          html: htmlContent,
          text: params.text || "",
          subject: params.subject,
          from: {
            name: "AI Institute Africa",
            email: senderEmail,
          },
          to: [
            {
              name: "",
              email: params.to,
            },
          ],
        },
      };

      if (Object.keys(attachmentsBinary).length > 0) {
        payload.email.attachments_binary = attachmentsBinary;
      }

      const sendData = await httpsPost("https://api.sendpulse.com/smtp/emails", {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }, payload);

      if (!sendData || sendData.is_error || sendData.error_code) {
        throw new Error(`SendPulse Send Error: ${JSON.stringify(sendData)}`);
      }

      console.log("Email sent successfully via SendPulse REST API:", sendData);
      return true;

    } else if (apiKey) {
      // Send using SMTP2GO REST API
      const inlines = [];
      const attachments = [];

      for (const att of allAttachments) {
        try {
          let fileblob = "";
          let mimetype = att.contentType || "application/octet-stream";
          
          if (!att.contentType) {
            if (att.filename.endsWith(".png")) mimetype = "image/png";
            else if (att.filename.endsWith(".jpg") || att.filename.endsWith(".jpeg")) mimetype = "image/jpeg";
            else if (att.filename.endsWith(".pdf")) mimetype = "application/pdf";
            else if (att.filename.endsWith(".csv")) mimetype = "text/csv";
            else if (att.filename.includes("word") || att.filename.endsWith(".docx")) mimetype = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            else if (att.filename.includes("excel") || att.filename.endsWith(".xlsx")) mimetype = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          }

          if (att.content) {
            const cleaned = att.content.replace(/^data:[^;]+;base64,/, "").trim();
            if (!cleaned) continue;
            fileblob = cleaned;
          } else if (att.path) {
            const fileBuffer = await fs.readFile(att.path);
            fileblob = fileBuffer.toString("base64");
          } else {
            continue;
          }
          
          if (att.cid) {
            inlines.push({ filename: att.filename, fileblob, mimetype, cid: att.cid });
          } else {
            attachments.push({ filename: att.filename, fileblob, mimetype });
          }
        } catch (e) {
          console.warn(`Could not process attachment for email: ${att.filename}`, e);
        }
      }

      const payload: any = {
        api_key: apiKey,
        to: [params.to],
        sender: `AI Institute Africa <${senderEmail}>`,
        subject: params.subject,
        text_body: params.text || "",
        html_body: htmlContent,
      };

      if (attachments.length > 0) payload.attachments = attachments;
      if (inlines.length > 0) payload.inlines = inlines;

      const data = await httpsPost("https://api.smtp2go.com/v3/email/send", {
        "Content-Type": "application/json"
      }, payload);

      if (data.data?.error || data.data?.failures?.length > 0) {
        throw new Error(`SMTP2GO API Error: ${JSON.stringify(data)}`);
      }

      console.log("Email sent successfully via REST API:", data.data?.email_id || "success");
      return true;

    } else {
      // Fallback to Nodemailer SMTP
      const transporter = createTransporter();
      await transporter.verify();

      const nodemailerAttachments = [];
      for (const att of allAttachments) {
        try {
          if (att.content) {
            const cleaned = att.content.replace(/^data:[^;]+;base64,/, "").trim();
            if (!cleaned) continue;
            nodemailerAttachments.push({
              filename: att.filename,
              content: cleaned,
              encoding: 'base64',
              cid: att.cid,
              contentType: att.contentType,
            });
          } else if (att.path) {
            const fileBuffer = await fs.readFile(att.path);
            nodemailerAttachments.push({
              filename: att.filename,
              content: fileBuffer,
              cid: att.cid,
              contentType: att.contentType,
            });
          }
        } catch (e) {
          console.warn(`Could not attach file to SMTP email: ${att.filename}`, e);
        }
      }

      const result = await transporter.sendMail({
        from: {
          name: "AI Institute Africa",
          address: senderEmail,
        },
        to: params.to,
        subject: params.subject,
        text: params.text || "",
        html: htmlContent,
        attachments: nodemailerAttachments,
      });

      console.log("Email sent successfully via SMTP:", result.messageId);
      return true;
    }
  } catch (error) {
    console.error("Email send error:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return false;
  }
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
  firstName: string,
  lastName: string,
  referenceNumber: string,
  email: string,
  selectedPrograms: Array<string | { name: string; category?: string }>,
  position: string | null,
  organization: string | null,
) {
  // Handle both string IDs and object formats
  const programList = selectedPrograms
    .map((p) => {
      if (typeof p === 'string') {
        return `<li>${p}</li>`;
      }
      return `<li>${p.name}${p.category ? ` (${p.category})` : ""}</li>`;
    })
    .join("");

  const programNames = selectedPrograms
    .map((p) => typeof p === 'string' ? p : p.name)
    .join(", ");

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
        ${position ? `<p style="margin: 0 0 10px 0;"><strong>Position / Designation:</strong> ${position}</p>` : ''}
        ${organization ? `<p style="margin: 0 0 10px 0;"><strong>Bank / Organisation:</strong> ${organization}</p>` : ''}
        <p style="margin: 0;"><strong>Program:</strong></p>
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
First Name: ${firstName}
Surname: ${lastName}
Email: ${email}
${position ? `Position / Designation: ${position}` : ''}
${organization ? `Bank / Organisation: ${organization}` : ''}
Program: ${programNames}

Please log in to the admin panel to review and process this application.
  `;

  return { html, text };
}