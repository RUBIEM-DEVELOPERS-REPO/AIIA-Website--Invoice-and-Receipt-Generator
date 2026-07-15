const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.SMTP2GO_USERNAME,
    pass: process.env.SMTP2GO_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

console.log('Testing SMTP Connection...');
console.log('Host: mail.smtp2go.com');
console.log('Port: 2525');
console.log('User:', process.env.SMTP2GO_USERNAME);
console.log('---');

transporter.verify(function(error, success) {
  if (error) {
    console. SMTP Connection Failed:', error.message);error('
    console.error('Code:', error.code);
    process.exit(1);
  } else {
    console.log SMTP Connection Successful!');(
    console.log('Server is ready to send emails');
    process.exit(0);
  }
});
