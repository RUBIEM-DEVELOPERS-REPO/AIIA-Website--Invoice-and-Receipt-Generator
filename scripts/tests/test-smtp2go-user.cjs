const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 2525,
  auth: {
    user: "AI Instiitute Africa",
    pass: "Rubiem@2024"
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log("Failed: " + error.message);
  } else {
    console.log("Success");
  }
});
