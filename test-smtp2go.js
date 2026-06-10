const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 2525,
  auth: {
    user: "api",
    pass: "api-454336E586954D26AE54C9B50C14569C"
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log("Failed with api as user");
  } else {
    console.log("Server is ready to take our messages");
  }
});
