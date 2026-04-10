export async function sendSmsNotification(phone: string, message: string): Promise<boolean> {
  const apiKey = process.env.AFRICASTALKING_API_KEY;
  const username = process.env.AFRICASTALKING_USERNAME || "sandbox";

  if (!apiKey || !phone) return false;

  // Normalize Zimbabwe numbers: strip leading 0, add +263
  let formatted = phone.trim().replace(/\s+/g, "");
  if (formatted.startsWith("00263")) formatted = "+" + formatted.slice(2);
  else if (formatted.startsWith("0")) formatted = "+263" + formatted.slice(1);
  else if (!formatted.startsWith("+")) formatted = "+263" + formatted;

  try {
    const body = new URLSearchParams({ username, to: formatted, message });
    if (process.env.AFRICASTALKING_SENDER_ID) body.append("from", process.env.AFRICASTALKING_SENDER_ID);

    const resp = await fetch("https://api.africastalking.com/version1/messaging", {
      method: "POST",
      headers: { apiKey, "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: body.toString(),
    });
    const data = await resp.json() as any;
    const sent = data?.SMSMessageData?.Recipients?.find((r: any) => r.status === "Success");
    if (sent) console.log("SMS sent to", formatted);
    return !!sent;
  } catch (err) {
    console.error("SMS send error:", err);
    return false;
  }
}

export function buildStatusSmsMessage(firstName: string, refNum: string, status: string, note?: string): string {
  const statusLabels: Record<string, string> = {
    pending: "Pending Review",
    under_review: "Under Review",
    accepted: "Accepted",
    rejected: "Not Accepted",
  };
  const label = statusLabels[status] || status;
  let msg = `Hi ${firstName}, your AIIA application (${refNum}) status has been updated to: ${label}.`;
  if (status === "accepted") msg += " Congratulations! Check your email for next steps.";
  if (note) msg += ` Note: ${note}`;
  msg += ` Track: aiinstituteafrica.com/track-application`;
  return msg;
}
