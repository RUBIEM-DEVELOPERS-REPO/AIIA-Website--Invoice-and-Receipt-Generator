
import { Paynow } from "paynow";
import { type Payment } from "@db/schema";

// Initialize Paynow
const paynow = new Paynow(
  process.env.PAYNOW_INTEGRATION_ID!,
  process.env.PAYNOW_INTEGRATION_KEY!,
  "http://localhost:3000"
);

paynow.resultUrl = `${process.env.APP_URL}/api/payments/callback`;
paynow.returnUrl = `${process.env.APP_URL}/payment/success`;

export async function initiatePayment(payment: Payment) {
  const payment_ref = `REF-${payment.id}`;
  const payment_obj = paynow.createPayment(payment_ref);
  payment_obj.add("Membership Payment", Number(payment.amount));
  
  if (payment.paymentMethod === 'mobile') {
    const response = await paynow.sendMobile(
      payment_obj,
      payment.phoneNumber,
      payment.provider // e.g., 'ecocash', 'onemoney'
    );

    if (response.success) {
      return {
        success: true,
        pollUrl: response.pollUrl,
        paymentRef: payment_ref,
      };
    }
  } else if (payment.paymentMethod === 'card') {
    const response = await paynow.send(payment_obj);
    
    if (response.success) {
      return {
        success: true,
        redirectUrl: response.redirectUrl,
        paymentRef: payment_ref,
      };
    }
  }

  throw new Error("Failed to initiate payment");
}

export async function checkPaymentStatus(pollUrl: string) {
  const status = await paynow.pollTransaction(pollUrl);
  return {
    status: status.status,
    paid: status.paid
  };
}
