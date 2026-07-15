import { sendRegistrationEmail } from "./server/services/email.js";
sendRegistrationEmail({ to: "test@example.com", subject: "Test", text: "Test body" }).then(console.log).catch(console.error);
