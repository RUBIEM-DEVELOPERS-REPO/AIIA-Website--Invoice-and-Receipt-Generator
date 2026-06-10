import { db } from "./db/index.js";
import { summitRegistrations, summitInvoices } from "./db/schema.js";

async function run() {
  const regs = await db.select().from(summitRegistrations).limit(1);
  console.log("Found reg:", regs[0].referenceNumber);
  const ref = regs[0].referenceNumber;
  
  const res = await fetch(`http://localhost:5000/api/summit-portal/${ref}/invoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      numberOfDelegates: 2,
      packagePrice: "570",
      secondEventPrice: "456",
      bothEvents: true,
      sponsorshipPrice: "7500",
      packageType: "pkg2|sponsor_gold",
      summitEvent: "AI Tech Forum",
      currency: "USD",
      paymentMethod: "Bank Transfer",
      address: "123 Main St",
      packageDescription: "Some package"
    })
  });
  const data = await res.json();
  console.log("Generated Invoice totalAmount:", data.invoice?.totalAmount);
  process.exit(0);
}
run();
