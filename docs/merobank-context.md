# MeroBank Platform — Context for New Conversation

## Role
Act as my mentor/senior engineer. Guide me through building an enterprise 
banking microservices platform for learning SDET/QA Automation Engineering skills.
Ask questions to test my understanding. Explain concepts as we build. 
Point out real-world practices. Don't just give code — help me understand why.

---

## Project Overview

**MeroBank Platform** — enterprise banking microservice learning project.

- GitHub (backend): https://github.com/kneerace/MeroBank-Platform
- GitHub (frontend): https://github.com/kneerace/merobank-web
- Local backend path: ~/Desktop/Learn/Spring/meroBank
- Local frontend path: ~/Desktop/Learn/Spring/merobank-web
- Tech stack: Java 21, Spring Boot 3.5.x, Maven multi-module, 
  PostgreSQL (Neon cloud), Kafka, Camunda 7, Docker, Jenkins, 
  Kubernetes (minikube), React + Vite, TypeScript, Module Federation

---

## Completed Phases

| Phase | Tag | Status |
|---|---|---|
| Phase 1 - Foundation | v1.0.0 | ✅ |
| Phase 2 - Inter-service Communication (REST/Feign) | v2.0.0 | ✅ |
| Phase 2.5 - Kafka + Camunda workflow engine | v3.0.0 | ✅ |
| Phase 4 - Docker | v4.0.0 | ✅ |
| Phase 5 - Jenkins CI/CD | v5.0.0 | ✅ |
| Phase 6 - Kubernetes | v6.0.0 | ✅ |
| Phase 7 - AI Assisted Testing | v7.0.0 | ✅ |
| Phase 8 - Observability | v8.0.0 | ✅ |
| Phase 9 - Security (JWT, TLS) | v9.0.0 | ✅ |
| Phase 10 - Frontend (in progress) | — | 🔲 |

---

## Current Work — Phase 10 Frontend (merobank-web)

### Branch strategy (merobank-web repo)
- feature/* → develop → main
- Currently on: feature/issue-124-logger-utility

### What's built so far in merobank-web
- React + Vite + TypeScript shell app
- Module Federation configured (host)
- React Router navigation (Home, Accounts, Payments)
- Account Management MFE (#122 ✅ merged to develop)
  - src/components/account-review/ (types, mock, pure component, MFE wrapper, index)
  - Shows mock accounts table with ACTIVE/INACTIVE status
- Payment Task MFE (#123 ✅ merged to develop)
  - src/components/payment-task/ (types, mock, pure component, MFE wrapper, index)
  - Shows UNDER_REVIEW payments with Approve/Deny buttons
  - Mirrors work project's manual-billing-review pattern
  - Work mode: buttons active / View mode: buttons disabled
- Logger utility (#124 in progress)
  - src/utils/logger.ts — fetches /api/logger/config on startup
  - Falls back to default config if backend unavailable
  - Structured log format: [timestamp] [level] [service] message
  - Added to accountReviewMfe.tsx ✅
  - Still to add: paymentTaskMfe.tsx ← NEXT STEP

### Key patterns learned
- Three-layer MFE pattern:
    types.ts → mockDataGenerator.ts → component.tsx → componentMfe.tsx → index.ts
- import type required for OXC/Vite strict mode
- VITE_USE_MOCK=true uses mock data (no backend needed)
- mode="work" → actions enabled / mode="view" → read-only

---

## Open Issues (MeroBank-Platform repo)

| Issue | Description | Status |
|---|---|---|
| #32 | LocalDateTime → Instant | open |
| #33 | Dead Letter Topic (Kafka) | open |
| #37 | PaymentService tests for Camunda | open |
| #40 | Vendor sub-process (parallel gateway + timer) | open |
| #121 | React shell with Module Federation | ✅ done |
| #122 | Account Management MFE | ✅ done |
| #123 | Payment Task MFE (Camunda) | ✅ done |
| #124 | Logger utility | 🔲 in progress |
| #125 | README Phase 10 | 🔲 |

---

## Architecture

### Backend services (port mapping)
- account-service: 8081
- payment-service: 8082 (Camunda embedded, Cockpit at /camunda)
- notification-service: 8083
- api-gateway: 8080 (JWT auth, HTTPS on 8443)

### Camunda flow (payment-service)
```
POST /api/payments
  → PENDING → Camunda process starts
  → Validate Source Account
  → Validate Destination Account
  → isSufficientFunds gateway
    → no → REJECTED → Publish Notification
    → yes → Amount >= 5000?
      → yes → Manual Payment Review (User Task) ← UNDER_REVIEW
                → APPROVED → Send Authorization Request
                              → Wait for Authorization (Message Catch)
                              → Withdraw → Deposit → COMPLETED
                → DENIED → REJECTED
      → no → Withdraw → Deposit → COMPLETED
  → Signal: AccountSuspended → CANCELLED
```

### Frontend (merobank-web, port 3000)
- Shell: React + Vite + Module Federation (host)
- Account MFE: /accounts route
- Payment Task MFE: /payments route (mirrors work project's manual-billing-review)

### Docker compose services
- postgres, zookeeper, kafka, account-service, payment-service,
  notification-service, api-gateway, pgadmin, prometheus, grafana,
  zipkin, opensearch, opensearch-dashboards, jenkins

### Kubernetes (minikube)
- All services deployed, use: sh k8s.sh start/stop/status/tunnel/deploy/load

---

## Helper Scripts
```bash
sh docker.sh start/stop/status    # Kafka + Zookeeper only
docker compose up                  # full platform
sh k8s.sh start/stop/status/tunnel/deploy/load
sh scripts/create-k8s-secrets.sh  # requires minikube running
sh scripts/create-issues.sh       # bulk create GitHub issues
sh scripts/assign-milestones.sh   # bulk assign milestones
sh scripts/assign-me.sh           # bulk assign to self
```

---

## Immediate Next Steps
1. Add logger to paymentTaskMfe.tsx
2. Commit #124 logger utility
3. Create README for payment-task component (like account-review has)
4. #125 README update for Phase 10
5. Merge develop → main, tag v10.0.0 (after all Phase 10 issues done)
6. Phase 11: Batch/ETL with Spring Batch

---

## Work Project Context
- Enterprise case management system
- Uses Camunda for workflow orchestration
- Module Federation micro-frontend architecture
- Pattern: manualBillingReview.tsx / manualBillingReviewMfe.tsx
  → equivalent to MeroBank's paymentTask.tsx / paymentTaskMfe.tsx
- Jules pipeline (CI) + Spinnaker (CD/deployment)
- OpenSearch for case/account search
- /api/logger/config pattern for remote log config
