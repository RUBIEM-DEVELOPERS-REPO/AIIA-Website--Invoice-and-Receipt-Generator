const https = require('https');
const fs = require('fs').promises;
const path = require('path');

console.log("=== SENDPULSE ATTACHMENTS TEST ===");

const sendpulseApiKey = process.env.SENDPULSE_API_KEY;

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
  if (!sendpulseApiKey) {
    console.error("❌ Error: SENDPULSE_API_KEY is not set!");
    return;
  }

  const docsDir = path.join(process.cwd(), "docs");
  const docAttachments = [
    { filename: "AI Tech Forum Flier.jpeg", path: path.join(docsDir, "AI TECH FORUM FLIER.jpeg") },
    { filename: "AI National Transformation Flier.jpeg", path: path.join(docsDir, "AI FOR NATIONAL TRANSFORMATION FLIER.jpeg") },
    { filename: "AI Tech Forum Summary.pdf", path: path.join(docsDir, "AI TECH FORUM ZIMBABWE 2026 - SUMMARY.pdf") },
    { filename: "National AI Summit Summary.pdf", path: path.join(docsDir, "NATIONAL AI SUMMIT 2026 - SUMMARY.pdf") },
    { filename: "Summit Pricing and Schedule.pdf", path: path.join(docsDir, "Masvingo Summit Price & schedule  2026 Summits pdf (3).pdf") },
  ];

  // Build attachments
  console.log("Loading attachments...");
  const attachmentsBinary = {};
  for (const att of docAttachments) {
    try {
      // Check if file exists
      const exists = await fs.access(att.path).then(() => true).catch(() => false);
      if (!exists) {
        console.log(`- File not found: ${att.filename}`);
        continue;
      }
      const fileBuffer = await fs.readFile(att.path);
      const fileblob = fileBuffer.toString("base64");
      attachmentsBinary[att.filename] = fileblob;
      console.log(`- Attached: ${att.filename} (${fileBuffer.length} bytes)`);
    } catch (e) {
      console.error(`- Error processing ${att.filename}:`, e.message);
    }
  }

  const sender = process.env.SMTP_FROM || "admin@aiinstituteafrica.com";
  const payload = {
    email: {
      html: "<h3>Test with Attachments</h3><p>Testing SendPulse attachments delivery.</p>",
      text: "Testing SendPulse attachments delivery.",
      subject: "Test Attachments Email",
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

  if (Object.keys(attachmentsBinary).length > 0) {
    payload.email.attachments_binary = attachmentsBinary;
  } else {
    console.log("⚠️ No attachments were loaded!");
  }

  try {
    console.log("Sending email...");
    const result = await httpsPost("https://api.sendpulse.com/smtp/emails", {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${sendpulseApiKey}`
    }, payload);

    console.log("✅ Email sent successfully!");
    console.log("Response:", JSON.stringify(result));
  } catch (err) {
    console.error("❌ SendPulse API Error:", err.message);
  }
}

run();
