# Account Review MFE — Component Documentation

## File Extensions

| Extension | Meaning |
|---|---|
| `.ts` | TypeScript — pure logic, no UI (interfaces, functions, utilities) |
| `.tsx` | TypeScript + JSX — React components with UI markup |
| `.css` | Styles |

---

## Component Structure

```
src/components/account-review/
  ├── types.ts                ← 1. Data shapes (interfaces)
  ├── mockDataGenerator.ts    ← 2. Fake data for local dev
  ├── accountReview.tsx       ← 3. Pure UI component
  ├── accountReviewMfe.tsx    ← 4. MFE wrapper (data fetching)
  └── index.ts                ← 5. Export barrel
```

---

## Flow When User Clicks "Accounts" in Navigation

```
User clicks Accounts link in App.tsx
         ↓
React Router renders <AccountReviewMfe mode="work" />
         ↓
accountReviewMfe.tsx mounts
  → checks VITE_USE_MOCK environment variable
  → if true: loads mock data from mockDataGenerator.ts (no backend needed)
  → if false: fetches real data from /api/accounts with JWT token
         ↓
Data loaded → passes to <AccountReview accounts={...} />
         ↓
accountReview.tsx renders the table UI
```

---

## File Descriptions

### 1. types.ts
Defines the **data shapes** (TypeScript interfaces).
Nothing runs here — just type definitions used by other files.

```typescript
interface Account {
  id: number
  accountNumber: string   // e.g. ACC-12345678
  ownerName: string
  balance: number
  status: 'ACTIVE' | 'INACTIVE'  // only these two values allowed
  createdAt: string
}

interface AccountReviewProps {
  mode?: 'work' | 'view'  // work = can edit, view = read-only
}
```

**Why it exists:** TypeScript catches bugs at compile time.
If backend changes `balance` to `currentBalance`, TypeScript
immediately flags every place that uses the old name.

---

### 2. mockDataGenerator.ts
Returns **fake Account data** for local development.

```typescript
export const generateMockAccounts = (): Account[] => [
  { id: 1, ownerName: 'Ram Thapa', balance: 5000, ... },
  { id: 2, ownerName: 'Sita Rai', balance: 3000, ... },
]
```

**Why it exists:** You can work on the UI without running the backend.
Set `VITE_USE_MOCK=true` in `.env` and the component uses this data.
This mirrors the pattern at work — developers can build UI independently
of backend availability.

---

### 3. accountReview.tsx (Pure Component)
The **actual UI** — renders the table of accounts.

**Key concept — pure component:**
- Receives data as props (accounts, loading, error)
- Does NOT fetch data itself
- Does NOT know about APIs, tokens, or environment variables
- Can be tested in isolation with any data

```tsx
function AccountReview({ accounts, loading, error, mode }: Props) {
  if (loading) return <div>Loading...</div>
  if (error)   return <div>Error: {error}</div>
  return (
    <table>
      {accounts.map(account => <tr>...</tr>)}
    </table>
  )
}
```

**mode prop:**
- `mode="work"` → shows Create button (active user working a task)
- `mode="view"` → read-only (just viewing, no actions)

This maps directly to the Work/View button pattern you see
in your work project's case management UI.

---

### 4. accountReviewMfe.tsx (MFE Wrapper)
The **smart wrapper** — handles data fetching and environment.

This is the file that gets "exposed" via Module Federation.
It bridges the gap between the pure component and the real world.

```typescript
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
```

**Two modes:**

```
VITE_USE_MOCK=true  → uses mockDataGenerator, no backend needed
VITE_USE_MOCK=false → fetches from real API with JWT token
```

**JWT token:**
```typescript
const token = localStorage.getItem('merobank-token')
fetch(`${API_BASE}/api/accounts`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

Token is stored in localStorage after login and attached to every request.
This is how the MFE knows who the user is.

**Separation of concerns:**
```
accountReview.tsx    → HOW it looks (UI)
accountReviewMfe.tsx → WHERE data comes from (logic)
```

This separation means you can test the UI with mock data,
and separately test the data fetching logic.

---

### 5. index.ts (Export Barrel)
**Single entry point** for the component — controls what's public.

```typescript
export { default as AccountReviewMfe } from './accountReviewMfe'
export { default as AccountReview }    from './accountReview'
export type { Account, AccountReviewProps } from './types'
```

**Why it exists:**
```
Without index.ts:
  import AccountReviewMfe from '../../components/account-review/accountReviewMfe'
  import AccountReview    from '../../components/account-review/accountReview'

With index.ts:
  import { AccountReviewMfe, AccountReview } from '../../components/account-review'
```

Clean, single import path. If you rename files internally,
consumers don't need to update their imports.

---

## Environment Variables (.env)

```
VITE_USE_MOCK=true          → use mock data (local dev, no backend)
VITE_USE_MOCK=false         → use real API (backend must be running)
VITE_API_BASE=http://localhost:8080  → gateway URL
```

**Note:** Vite only exposes variables prefixed with `VITE_` to the browser.
Never put secrets in `.env` — they're visible in the browser bundle.

---

## Module Federation Connection

In `vite.config.ts`, this component will be exposed as a remote:

```typescript
federation({
  name: 'account-review-mfe',
  exposes: {
    './AccountReview': './src/components/account-review/index.ts'
  },
  shared: ['react', 'react-dom']
})
```

The shell app (App.tsx) then loads it dynamically:

```typescript
// shell loads the MFE at runtime, not build time
const AccountReviewMfe = React.lazy(() => import('accountReview/AccountReview'))
```

This is what Module Federation means:
- MFE is built and deployed independently
- Shell loads it at runtime from a URL
- Neither knows about the other at build time

---

## Comparison with Work Project Pattern

| Work Project | MeroBank |
|---|---|
| `manualBillingReview.tsx` | `accountReview.tsx` |
| `manualBillingReviewMfe.tsx` | `accountReviewMfe.tsx` |
| `mockDataGenerator.ts` | `mockDataGenerator.ts` |
| `types.ts` | `types.ts` |
| `index.ts` | `index.ts` |
| Work/View mode | work/view mode prop |
| Calls Camunda task API | Calls Camunda task API (payment-task MFE) |
| Case details displayed | Account details displayed |
