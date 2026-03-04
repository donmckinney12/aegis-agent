# Aegis-Agent ID: Zero-Trust Identity for AI Agents

Aegis-Agent ID is an enterprise-grade "Zero-Trust Identity Control Plane for AI Agents." It provides cryptographic X.509 SVID identities via SPIFFE and enforces access control using an embedded Open Policy Agent (OPA) engine. 

The system consists of a Next.js 15 React frontend and a sub-millisecond Go (Golang) backend control plane.

## Key Features

1. **The Core Dashboard**
   - **React Flow Trust Graph**: Visualizes the agent network topology, depicting authenticated agents and intercepted policy violations.
   - **Agent Registry & Details**: A comprehensive directory of all issued SVIDs with detailed cryptographic metadata.
   - **Policy Engine**: An interface to view and simulate Rego configurations before deploying them to the Go engine.
   - **Audit Logging**: A chronological ledger of all access attempts, colored by severity.

2. **The Go Control Plane**
   - **SPIFFE Provider**: An isolated module issuing compliant X.509 certificates.
   - **OPA Engine**: Compiles Rego policies locally and evaluates requests at sub-millisecond speeds.
   - **REST API (`grpc-gateway` mapped)**: Provides 18+ endpoints for the Next.js frontend to securely poll live cluster data.

3. **Enterprise Expansion Modules**
   - **Analytics & Cost Control**: View real-time token cost attribution and sub-ms latency percentiles using Recharts.
   - **Access & Identity**: Complete B2B RBAC configuration for users, roles, and SSO integration mockups.
   - **API Keys & Credentials**: Scoped credential issuance engine for legacy non-SPIFFE integrations.
   - **Threat Intelligence**: Real-time CVE scans and behavioral anomaly detection logs that quarantine malicious agents.
   - **Compliance Status**: Automated auditor dashboard continuously validating SOC 2, ISO 27001, HIPAA, and GDPR posture.
   - **Infrastructure Health**: Global map of control plane latency and regional database replicas status.

4. **SaaS Capabilities**
   - **Clerk Authentication**: Full multi-tenancy support via `@clerk/nextjs`. The dashboard is fully protected middleware.
   - **Marketing Website**: Complete Next.js route group encompassing the Landing Page, Features, Pricing, and Engineering Blog.

## Prerequisites

- Node.js 18+
- Go 1.21+

## Getting Started

First, run the Next.js development server:

```bash
cd frontend
npm install
npm run dev
```

Then, run the Go API backend:

```bash
cd backend
go mod tidy
go run ./cmd/server/main.go
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, shadcn/ui, Recharts, React Flow (xyflow), Clerk Auth, Lucide Icons.
- **Backend**: Go (Golang), SQLite (WAL mode), Open Policy Agent (OPA), SPIFFE standard protocols.
