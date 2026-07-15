const http = require('http');

const data = JSON.stringify({
  numberOfDelegates: 2,
  packagePrice: "570",
  secondEventPrice: "456",
  bothEvents: true,
  sponsorshipPrice: "7500",
  packageType: "pkg2|sponsor_gold",
  summitEvent: "AI Tech Forum",
  currency: "USD",
  paymentMethod: "Bank Transfer",
  address: "123 Main St"
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/summit-portal/SOME_REF/invoice', // This will fail 404, but let's test a valid one. Wait, I don't know a valid one.
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
});
req.write(data);
req.end();
