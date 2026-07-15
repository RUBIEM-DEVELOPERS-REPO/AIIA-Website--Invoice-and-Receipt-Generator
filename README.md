# AIIA - AI Institute Africa

AIIA is a full-stack web platform for AI Institute Africa. It combines a React + TypeScript frontend with an Express backend for membership management, event registration, invoices, receipts, payments, applications, and admin workflows.

## What it includes

- Public marketing pages for AI Institute Africa
- Membership registration and payment flows
- Summit and application portals
- Invoice and receipt generation
- Admin dashboards for reviewing and updating records
- Email, SMS, and AI-powered integrations

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Wouter
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL with Drizzle ORM
- UI and motion: Radix UI, Framer Motion, Lottie
- Integrations: PayNow, SendGrid, SMTP2GO, OpenAI, Azure Cognitive Services

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A PostgreSQL database

### Install

```bash
npm install
```

### Environment

Create a `.env` file and set at least:

- `DATABASE_URL`
- `SESSION_SECRET`

Depending on the features you use, you may also need:

- `PAYNOW_INTEGRATION_ID`
- `PAYNOW_INTEGRATION_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `SENDPULSE_API_KEY`
- `SENDPULSE_CLIENT_ID`
- `SENDPULSE_CLIENT_SECRET`
- `OPENAI_API_KEY` or `AI_INTEGRATIONS_OPENAI_API_KEY`
- `AI_INTEGRATIONS_OPENAI_BASE_URL`
- Azure computer vision credentials for image/document features

### Development

```bash
npm run dev
```

The app starts the Express server and serves the Vite frontend in development.

### Build

```bash
npm run build
```

### Start production build

```bash
npm run start
```

### Type check

```bash
npm run check
```

### Push database schema

```bash
npm run db:push
```

## Project Structure

- `client/` - frontend app, pages, and UI components
- `server/` - Express routes, services, and backend startup
- `db/` - Drizzle schema and database helpers
- `scripts/` - maintenance and test scripts
- `uploads/` - stored application and payment proof files

## Notes

- Development runs on port `5000` by default.
- Production serves the built frontend from `dist/public`.
- The app depends on a working PostgreSQL connection before the server starts.
