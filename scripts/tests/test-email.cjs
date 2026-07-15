const https = require('https');

console.log("=== EMAIL DIAGNOSTIC START ===");
console.log("SENDPULSE_API_KEY:", process.env.SENDPULSE_API_KEY ? "Configured (length: " + process.env.SENDPULSE_API_KEY.length + ")" : "Not set");
console.log("SENDPULSE_CLIENT_ID:", process.env.SENDPULSE_CLIENT_ID ? "Configured (length: " + process.env.SENDPULSE_CLIENT_ID.length + ")" : "Not set");
console.log("SENDPULSE_CLIENT_SECRET:", process.env.SENDPULSE_CLIENT_SECRET ? "Configured (length: " + process.env.SENDPULSE_CLIENT_SECRET.length + ")" : "Not set");
console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_SECURE:", process.env.SMTP_SECURE);
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_FROM:", process.env.SMTP_FROM);
console.log("SMTP_PASS length:", process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0);

function httpsPost(url, headers, body) {
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
      res.on("data", (chunk) => { responseBody += chunk; });
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

    req.on("error", (e) => { reject(e); });
    req.write(postData);
    req.end();
  });
}

async function run() {
  const sendpulseApiKey = process.env.SENDPULSE_API_KEY;
  const sendpulseClientId = process.env.SENDPULSE_CLIENT_ID;
  const sendpulseClientSecret = process.env.SENDPULSE_CLIENT_SECRET;

  if (sendpulseApiKey || (sendpulseClientId && sendpulseClientSecret)) {
    console.log("\n--- Testing via SendPulse REST API ---");
    try {
      let accessToken = sendpulseApiKey;
      
      if (!accessToken) {
        console.log("1. Requesting Access Token...");
        const tokenData = await httpsPost("https://api.sendpulse.com/oauth/access_token", {
          "Content-Type": "application/json"
        }, {
          grant_type: "client_credentials",
          client_id: sendpulseClientId,
          client_secret: sendpulseClientSecret
        });
        
        console.log("   Access token obtained successfully!");
        accessToken = tokenData.access_token;
      } else {
        console.log("1. Using configured permanent SENDPULSE_API_KEY...");
      }
      
      console.log("2. Sending test email...");
      const sender = process.env.SMTP_FROM || "admin@aiinstituteafrica.com";
      const payload = {
        email: {
          html: "<h3>Hello!</h3><p>This is a test email sent using the SendPulse REST API from AI Institute Africa.</p>",
          text: "This is a test email sent using the SendPulse REST API from AI Institute Africa.",
          subject: "Test SendPulse API Email",
          from: {
            name: "AI Institute Africa",
            email: sender,
          },
          to: [
            {
              name: "Test Recipient",
              email: "patiencemupikeni@gmail.com",
            },
          ],
        }
      };

      const sendResult = await httpsPost("https://api.sendpulse.com/smtp/emails", {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }, payload);

      console.log("   Email Sent Successfully via API!");
      console.log("   Response:", JSON.stringify(sendResult));
    } catch (err) {
      console.error("❌ SendPulse API Error:", err.message);
    }
  } else {
    console.log("\n--- Testing via Nodemailer SMTP ---");
    const nodemailer = require('nodemailer');
    const host = process.env.SMTP_HOST || "mail.smtp2go.com";
    const port = parseInt(process.env.SMTP_PORT || "2525", 10);
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || "admin@aiinstituteafrica.com";

    if (!user || !pass) {
      console.error("❌ Error: SMTP_USER and SMTP_PASS must be set for SMTP mode!");
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 10000,
    });

    try {
      console.log("1. Verifying SMTP connection...");
      await transporter.verify();
      console.log("   SMTP Connection verified successfully!");
      
      console.log("2. Sending test email...");
      const info = await transporter.sendMail({
        from: `"AI Institute Africa" <${from}>`,
        to: "patiencemupikeni@gmail.com",
        subject: "Test Email from AI Institute Africa (SMTP)",
        text: "Hello! If you are reading this, your SendPulse SMTP email configuration is working perfectly!",
        html: "<h3>Hello!</h3><p>If you are reading this, your SendPulse SMTP email configuration is working perfectly!</p>"
      });

      console.log("   Email Sent Successfully via SMTP!");
      console.log("   Message ID:", info.messageId);
    } catch (err) {
      console.error("❌ SMTP Connection/Send Error:", err);
    }
  }
}

run();
