# Aegis-Agent ID: Zero-Trust Identity for AI Agents

[![Deploy Backend](https://github.com/YOUR_USERNAME/aegis-agent-id/actions/workflows/deploy-backend.yml/badge.svg)](https://github.com/YOUR_USERNAME/aegis-agent-id/actions)
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_BADGE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE)

> Enterprise-grade Zero-Trust Identity Control Plane for AI Agents. Cryptographic X.509 SVID identities via SPIFFE, enforced with an embedded Open Policy Agent (OPA) engine.

**Live:** [aegis-agent.com](https://aegis-agent.com) · **API:** [api.aegis-agent.com](https://api.aegis-agent.com)

---

## Architecture

| Layer | Technology | Deployment |
|-------|-----------|------------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS v4, shadcn/ui | Netlify |
| **Backend** | Go 1.24, REST API, OPA, SPIFFE | Fly.io |
| **Database** | PostgreSQL 16 (pgxpool) | Fly.io Postgres |
| **Auth** | Clerk (multi-tenant, RBAC) | Clerk Cloud |
| **Payments** | Stripe (Checkout, Webhooks, Customer Portal) | Stripe |
| **CI/CD** | GitHub Actions → Fly.io auto-deploy | GitHub |

---

## Features

### Core Dashboard (Live Backend Data)
- **React Flow Trust Graph** — Interactive agent network topology with authenticated nodes and policy violation edges
- **Agent Registry** — Full CRUD for SPIFFE SVIDs with cryptographic metadata and real-time status
- **Policy Engine** — View, simulate, and manage OPA/Rego policies before deploying to the Go engine
- **Audit Trail** — Chronological security ledger with severity filtering and trace correlation

### Enterprise Modules (Interactive Demo)
- **Analytics & Cost Control** — Real-time latency percentiles (P50/P90/P99) and per-agent LLM cost attribution
- **Access Management** 🔒 — User RBAC, MFA enforcement, invite/suspend workflows (admin-only)
- **API Keys & Credentials** — Generate, rotate, copy, and revoke scoped API tokens
- **Threat Intelligence** — CVE vulnerability scanner, behavioral anomaly detection, lockdown mode
- **Compliance Posture** — SOC 2 / ISO 27001 / HIPAA scoring with live control remediation
- **Webhooks & Integrations** — Slack, Splunk, PagerDuty with live toggle switches
- **Infrastructure Health** — Global cluster topology with latency polling and refresh
- **Settings** 🔒 — Platform configuration (admin-only)

### SaaS Platform
- **Clerk Authentication** — Production multi-tenancy with Clerk middleware protection
- **Stripe Billing** — Checkout sessions, webhook processing, customer portal integration
- **Marketing Site** — Landing page, Features, Pricing, Blog, Docs, Careers, Contact
- **Admin RBAC** — Role-based guards via Clerk `publicMetadata` (🔒 = admin-only pages)
- **Toast Notifications** — Sonner-powered feedback on every interactive element

### Go Control Plane
- **SPIFFE Provider** — X.509 certificate issuance compliant with the SPIFFE standard
- **OPA Engine** — Compiles Rego policies and evaluates requests at sub-millisecond speeds
- **REST API** — 18+ endpoints serving live data to the Next.js frontend
- **PostgreSQL** — Production-grade persistence with pgxpool connection pooling

---

## Getting Started

### Prerequisites

- Node.js 18+
- Go 1.24+
- Docker & Docker Compose
- Fly CLI (`flyctl`)

### Local Development

```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Start the Go backend
cd backend
export DATABASE_URL="postgres://aegis_admin:secretpassword@localhost:5432/aegis_db?sslmode=disable"
go mod tidy
go run ./cmd/server/main.go

# 3. Start the Next.js frontend
cd frontend
cp .env.example .env.local  # Configure your Clerk & Stripe keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

**Frontend (Netlify / `.env.local`)**

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g. `https://api.aegis-agent.com/api/v1`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

**Backend (Fly.io Secrets)**

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |

---

## Deployment

### Frontend → Netlify
Autodeploys on push to `main`. Configure environment variables in Netlify dashboard.

### Backend → Fly.io
Autodeploys via GitHub Actions on push to `main` (changes under `backend/`).

```bash
# Manual deploy
cd backend
flyctl deploy --remote-only
```

### CI/CD
The `.github/workflows/deploy-backend.yml` workflow requires a `FLY_API_TOKEN` secret in your GitHub repository settings.

---

## Project Structure

```
├── .github/workflows/       # CI/CD pipeline
├── backend/
│   ├── cmd/server/           # Go entrypoint
│   ├── internal/
│   │   ├── identity/         # SPIFFE X.509 provider
│   │   ├── middleware/       # CORS, logging
│   │   ├── policy/           # OPA/Rego engine
│   │   └── store/            # PostgreSQL data layer
│   ├── Dockerfile            # Multi-stage Go build
│   └── fly.toml              # Fly.io config
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # UI components (shadcn/ui)
│   │   └── lib/              # API client, types, utils
│   └── netlify.toml          # Netlify config
└── docker-compose.yml        # Local PostgreSQL
```

---

## Tech Stack

**Frontend:** Next.js 15 · React 19 · Tailwind CSS v4 · shadcn/ui · Recharts · React Flow (xyflow) · Clerk Auth · Stripe.js · Sonner · Framer Motion · Lucide Icons

**Backend:** Go 1.24 · PostgreSQL 16 · pgxpool · Open Policy Agent (OPA) · SPIFFE · Chi Router

**Infrastructure:** Netlify · Fly.io · GitHub Actions · Docker

---

## License

Proprietary. All rights reserved.
