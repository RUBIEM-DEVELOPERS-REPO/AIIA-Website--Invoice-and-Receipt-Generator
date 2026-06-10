---
title: API Creation Blueprint
reference: true
description: Step-by-step playbook agents follow to add a new API/integration to the NeuroWorks platform. Reference doc — NOT a prompt guardrail.
applies_to: any agent or developer extending the NeuroWorks server with a new external API, connector, or capability
version: 1
---

# API Creation Blueprint

A step-by-step manual for adding a new API to the NeuroWorks platform — whether it's an **inbound route** (something the UI or another service calls), an **outbound integration** (a third-party service agents act on), or a **company-system connector** (an existing in-house API agents read/write).

> This is a **reference manual**, not a governance guardrail. Read it before you build; follow the patterns exactly so every API looks like the ones already here.

---

## 0. Decide what you're building

| You want… | Build this | Live example |
|---|---|---|
| A new endpoint the web UI calls | An **Express route** under `server/src/routes/` | `routes/integrations.ts` |
| Agents to act on a SaaS tool (Slack, Notion, Stripe…) | An **integration** (provider + primitive) | `lib/integrations.ts`, `lib/payments.ts` |
| Agents to call an arbitrary company HTTP API | Register a **Connector** (no code — use the Connectors page) | `lib/connectors.ts` |
| A new agent capability (a tool the planner can pick) | A **primitive** in `lib/primitives.ts` | `connector.call`, `payment.link` |

If the target is a one-off company system, prefer a **Connector** (zero code, operator-configured). Write code only for first-class, reusable capabilities.

---

## 1. Non-negotiable conventions

These are enforced across the codebase. Violating them is a review failure.

1. **No new dependencies for HTTP APIs.** Call REST APIs with the built-in `fetch`. See `lib/openrouter.ts`, `lib/minimax.ts`, `lib/payments.ts` — none import an SDK. Form-encode when the API needs it (`payments.ts` `toForm`).
2. **Secrets are encrypted at rest.** Never write a token/key/password to disk in plaintext. Use `encryptSecret` / `decryptSecret` from `lib/secret-box.ts` (AES-256-GCM). Persist credential-bearing config under `.neuroworks/` (gitignored), never in the vault. Pattern: `lib/data-sources.ts`, `lib/connectors.ts`.
3. **Secrets never leave the server.** API responses return a boolean "set" flag, never the secret. See `toPublic()` in `connectors.ts` / `integrations.ts`.
4. **Config is centralized + gated.** Add env vars in `config.ts` via `pick(NAME, fallback)`, export a `xEnabled: key.length > 0` flag, and have the feature no-op (with a clear message) when unset. Document every var in `.env.example`.
5. **Default to read-only.** Anything that can mutate an external system must be opt-in. Connectors gate non-GET behind `writeEnabled`; data-sources gate writes behind a SQL keyword check. Mirror this.
6. **The origin guard protects every route.** Routes are loopback + Host/Origin allow-listed by default (`lib/origin-guard.ts`). Only exempt a path when an external service must reach it (e.g. a signed webhook), and then prove authenticity another way (signature).
7. **Errors return a stable JSON shape.** `{ error: string }` with the right HTTP status. Validation → `400`, missing resource → `404`, unexpected → `500`. The global handler in `index.ts` is the last resort, not your first.
8. **Guard against SSRF on agent-reachable fetches.** If an agent controls a URL/path, restrict it to a trusted origin (see `resolveUrl` in `connectors.ts`) and respect `CLAWBOT_WEB_ALLOW_PRIVATE`.

---

## 2. Recipe A — add an Express route

1. Create `server/src/routes/<name>.ts`. Export `export const <name>Router = Router();`.
2. Define handlers. Validate input first; wrap async bodies in `try/catch` returning `{ error }`.
3. Mount in `server/src/index.ts`:
   - `import { <name>Router } from "./routes/<name>.js";` (note the **`.js`** extension — this is ESM).
   - `app.use("/api/<name>", <name>Router);`
4. If a sub-path needs the raw body (webhooks) or different parsing, mount that parser **before** `express.json` in `index.ts` (see `/api/payments/webhook`).
5. Define a literal route (e.g. `/test-all`) **before** a `/:id` route or it gets captured as an id.

```ts
import { Router } from "express";
export const exampleRouter = Router();

exampleRouter.get("/", (_req, res) => res.json({ items: [] }));

exampleRouter.post("/", (req, res) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    if (!name) return res.status(400).json({ error: "name is required" });
    res.json({ ok: true, name });
  } catch (e: any) {
    res.status(500).json({ error: String(e?.message ?? e) });
  }
});
```

---

## 3. Recipe B — add an outbound integration the agent uses

A library that talks to the service + a **primitive** the planner can pick.

1. **Config** (`config.ts`): add the key(s) + `xEnabled` flag + `.env.example` docs.
2. **Library** (`lib/<service>.ts`): one function per operation, `fetch`-based, retry transient `429/5xx` where it matters, return typed results or throw a clear `Error`.
3. **Primitive** (`lib/primitives.ts`): append to the primitives array. Set `readonly: true` for pure reads, `readonly: false` for actions. Write the `description` for the *planner* — say when to use it and what it returns. Lazy-import the lib inside the handler (`const { fn } = await import("./<service>.js")`) so boot stays cheap. Return `{ error: "..." }` (don't throw) when the feature isn't configured.

```ts
{
  name: "service.action",
  description: "Do X on the user's connected Service. Use when the user asks to … Returns { ok, … }. Requires SERVICE configured (Settings).",
  readonly: false,
  args: [{ name: "text", type: "string", required: true, description: "What to send" }],
  handler: async (args) => {
    const { config } = await import("../config.js");
    if (!config.serviceEnabled) return { error: "service not configured — set SERVICE_API_KEY" };
    const { doAction } = await import("./service.js");
    try { return { ok: true, ...(await doAction(String(args.text))) }; }
    catch (e: any) { return { error: String(e?.message ?? e) }; }
  },
},
```

> `ArgSpec.type` is only `"string" | "number" | "boolean"`. For structured input, declare `"string"` and accept either a JSON string or an object in the handler (see `connector.call`).

If the service is a user-connectable account, also add a **provider** entry to `PROVIDERS` in `lib/integrations.ts` (fields, `secret: true` on credentials, a `testConnection` case) so it shows on the Integrations page with a health signal.

---

## 4. Recipe C — register a company system (no code)

For an existing in-house/third-party HTTP API, don't write code — use **Connectors** (Settings → Connectors):

1. **Add connector**: label, base URL, auth scheme (bearer / API key / basic / custom header / none), optional static headers.
2. **Endpoint manifest**: list `{ name, method, path, description, query? }` for each operation. This is the contract agents read via `connector.describe` before calling.
3. **Writes**: leave off for read-only access; enable only for trusted write paths.
4. **Test** the connector; then agents reach it via `connector.list` → `connector.describe` → `connector.call`. Credentials are applied automatically and never exposed.

Calls are origin-locked to the connector's base host (SSRF guard) and blocked for non-GET methods unless writes are enabled.

---

## 5. Webhooks (inbound from an external service)

1. Mount a raw-body parser for the exact path **before** `express.json` in `index.ts`.
2. Add the path to `EXEMPT_PATHS` in `lib/origin-guard.ts` (the sender is cross-host).
3. **Verify a signature** in the handler — this replaces the origin check. See `verifyStripeSignature` (HMAC-SHA256 over `${timestamp}.${rawBody}`, `timingSafeEqual`, reject stale timestamps to stop replay).
4. Always return `200` for a verified event so the sender stops retrying; `400` for a bad signature.

---

## 6. Web UI (optional but expected for operator-facing features)

1. **API client** (`web/src/lib/api.ts`): add typed functions to the `api` object + exported `type`s. Use the shared `req<T>()` helper and **relative** `/api/...` paths (Vite proxies them).
2. **Page** (`web/src/pages/<Name>.tsx`): reuse `Card`, `Button`, `showToast` from `components/Card`.
3. **Route** (`web/src/App.tsx`): import the page + add a `<Route>`.
4. **Nav** (`web/src/components/Layout.tsx`): add a `NavItem` (with a lucide icon) to the right group — usually `systemNav`.

---

## 7. Before you call it done

- [ ] `cd server && npx tsc --noEmit -p tsconfig.json` is clean.
- [ ] `cd web && npx tsc --noEmit` is clean.
- [ ] Every new env var is in `.env.example` with a comment.
- [ ] Feature no-ops gracefully when its key is unset (no crash, clear message).
- [ ] No secret is ever returned by an endpoint or logged.
- [ ] Writes/mutations are opt-in and default-off.
- [ ] Live-verify the happy path **and** the guard (auth rejected, write blocked, bad input → 400).

---

## 8. File map (where things live)

```
server/src/config.ts            env vars + xEnabled flags
server/src/index.ts             route mounting, body parsers, boot
server/src/lib/secret-box.ts    encrypt/decrypt at rest (AES-256-GCM)
server/src/lib/origin-guard.ts  Host/Origin allow-list, EXEMPT_PATHS
server/src/lib/primitives.ts    agent tools (the planner's vocabulary)
server/src/lib/integrations.ts  connectable providers + health tests
server/src/lib/connectors.ts    company-system registry + safe HTTP calls
server/src/lib/<service>.ts     one library per external API (fetch-based)
server/src/routes/<name>.ts     Express routes
web/src/lib/api.ts              typed client
web/src/pages/<Name>.tsx        operator UI
web/src/App.tsx                 routes
web/src/components/Layout.tsx   nav
.env.example                    document every var
```
