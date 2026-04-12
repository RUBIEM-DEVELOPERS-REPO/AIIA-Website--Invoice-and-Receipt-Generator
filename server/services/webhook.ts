import crypto from "crypto";
import { db } from "@db";
import { sql } from "drizzle-orm";

export type WebhookEventType =
  | "application.created"
  | "application.status_changed"
  | "application.document_uploaded"
  | "member.created"
  | "member.updated"
  | "contact.created"
  | "event.registration"
  | "summit.registration"
  | "newsletter.subscribed";

export interface WebhookPayload {
  event: WebhookEventType;
  timestamp: string;
  site: string;
  data: Record<string, any>;
}

function signPayload(secret: string, body: string): string {
  return "sha256=" + crypto.createHmac("sha256", secret).update(body).digest("hex");
}

async function deliverWebhook(
  deliveryId: number,
  url: string,
  payload: WebhookPayload,
  secret: string | null
): Promise<void> {
  const body = JSON.stringify(payload);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "AIInstituteAfrica-Webhook/1.0",
    "X-AIIA-Event": payload.event,
    "X-AIIA-Timestamp": payload.timestamp,
    "X-AIIA-Delivery": String(deliveryId),
  };
  if (secret) {
    headers["X-AIIA-Signature"] = signPayload(secret, body);
  }

  let httpStatus: number | null = null;
  let responseBody: string | null = null;
  let status = "failed";

  try {
    const res = await fetch(url, { method: "POST", headers, body, signal: AbortSignal.timeout(10000) });
    httpStatus = res.status;
    responseBody = (await res.text()).slice(0, 500);
    status = res.ok ? "delivered" : "failed";
  } catch (err: any) {
    responseBody = err?.message || "Network error";
    status = "failed";
  }

  await db.execute(sql`
    UPDATE webhook_deliveries
    SET status = ${status}, http_status = ${httpStatus}, response_body = ${responseBody},
        attempts = attempts + 1, last_attempted_at = NOW()
    WHERE id = ${deliveryId}
  `);
}

export async function fireWebhook(
  event: WebhookEventType,
  data: Record<string, any>
): Promise<void> {
  try {
    const configs = await db.execute(sql`
      SELECT id, url, secret FROM webhook_configs
      WHERE event_type = ${event} AND enabled = true
      UNION ALL
      SELECT id, url, secret FROM webhook_configs
      WHERE event_type = 'all' AND enabled = true
    `);

    if (configs.rows.length === 0) return;

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      site: "https://aiinstituteafrica.com",
      data,
    };

    for (const config of configs.rows as any[]) {
      const result = await db.execute(sql`
        INSERT INTO webhook_deliveries (event_type, payload, target_url, status, attempts)
        VALUES (${event}, ${JSON.stringify(payload)}, ${config.url}, 'pending', 0)
        RETURNING id
      `);
      const deliveryId = (result.rows[0] as any).id;

      deliverWebhook(deliveryId, config.url, payload, config.secret).catch(console.error);
    }
  } catch (err) {
    console.error("Webhook fire error:", err);
  }
}

export async function retryFailedWebhooks(): Promise<void> {
  const failed = await db.execute(sql`
    SELECT id, target_url, payload, attempts
    FROM webhook_deliveries
    WHERE status = 'failed' AND attempts < 5
      AND (last_attempted_at IS NULL OR last_attempted_at < NOW() - INTERVAL '5 minutes')
    LIMIT 20
  `);

  for (const row of failed.rows as any[]) {
    const configs = await db.execute(sql`
      SELECT secret FROM webhook_configs WHERE url = ${row.target_url} LIMIT 1
    `);
    const secret = configs.rows.length > 0 ? (configs.rows[0] as any).secret : null;
    deliverWebhook(row.id, row.target_url, row.payload, secret).catch(console.error);
  }
}

setInterval(retryFailedWebhooks, 5 * 60 * 1000);
