# MeroBank Web — Frontend

React + Vite micro-frontend shell for MeroBank Platform.

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite 8 | Build tool and dev server |
| Module Federation | Micro-frontend architecture |
| React Router v7 | Client-side routing |
| Axios | HTTP client |

## Getting Started

```bash
# install dependencies
npm install

# start dev server (mock data, no backend needed)
npm run dev
```

Open http://localhost:3000

## Environment Variables

Create `.env` in project root:
VITE_USE_MOCK=true # use mock data
VITE_API_BASE=http://localhost:8080 # api-gateway URL
VITE_CAMUNDA_BASE=http://localhost:8082 # payment-service (Camunda)

## MFE Components

### Account Management (`/accounts`)
src/components/account-review/
types.ts → Account, AccountReviewProps interfaces
mockDataGenerator.ts → fake accounts for local dev
accountReview.tsx → pure UI component
accountReviewMfe.tsx → MFE wrapper (fetches /api/accounts)
index.ts → export barrel
README.md → component documentation

### Payment Task (`/payments`)
src/components/payment-task/
types.ts → Payment, CamundaTask, ReviewDecision types
mockDataGenerator.ts → fake UNDER_REVIEW payments
paymentTask.tsx → pure UI (payment cards, Approve/Deny)
paymentTaskMfe.tsx → MFE wrapper (Camunda engine-rest API)
index.ts → export barrel

## Utilities

### Logger (`src/utils/logger.ts`)
Fetches log configuration from backend on startup:
GET /api/logger/config

Falls back to default config if backend unavailable.

Usage:
```typescript
import { logger } from '../utils/logger'

logger.info('message', { data })
logger.error('message', error)
```

## Work/View Mode

All MFEs support two modes matching enterprise pattern:
mode="work" → user is working the task, actions enabled
mode="view" → read-only, buttons disabled

## Mock vs Real Data

VITE_USE_MOCK=true → mockDataGenerator.ts (no backend needed)
VITE_USE_MOCK=false → real API calls with JWT token from localStorage

## Module Federation Architecture
merobank-web (shell/host)
→ loads AccountReviewMfe at /accounts route
→ loads PaymentTaskMfe at /payments route
→ shared: react, react-dom, react-router-dom

x## Connecting to Backend

Start MeroBank backend services:
```bash
cd ~/Desktop/Learn/Spring/meroBank
docker compose up -d
```

Then update `.env`:

VITE_USE_MOCK=false
VITE_API_BASE=http://localhost:8080
VITE_CAMUNDA_BASE=http://localhost:8082

Login via API Gateway to get JWT token:
```bash
curl -k -X POST https://localhost:8443/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Store the token in localStorage:
```javascript
localStorage.setItem('merobank-token', 'YOUR_TOKEN_HERE')
```
