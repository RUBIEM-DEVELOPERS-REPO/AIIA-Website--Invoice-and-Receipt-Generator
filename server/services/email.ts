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