# Account Review Component — Step-by-Step Explanation

## Overview
This guide explains the code in `src/components/account-review/` using a real example from the component, breaking down TypeScript types, React state, and data flow.

---

## 1. Import Statement: `import type { Account, AccountReviewProps } from './types'`

**What it does:**
- Uses TypeScript **type-only import** to bring in interface definitions from `./types.ts`
- Type-only imports are erased at compile time — they don't add runtime code, only provide type checking

**The `Account` Interface** (defined in `src/components/account-review/types.ts`):
```typescript
export interface Account {
  id: number
  accountNumber: string
  ownerName: string
  balance: number
  status: 'ACTIVE' | 'INACTIVE'  // only these two literals allowed
  createdAt: string
}
```

**Key Point:**
- This interface defines the shape of every account object your component will work with
- TypeScript ensures that anywhere you use an `Account`, it must have all these properties with these exact types

---

## 2. State Declaration: `const [accounts, setAccounts] = useState<Account[]>([])`

**What it does:**
- `useState` is a React hook that creates a piece of state
- `<Account[]>` is the TypeScript generic type annotation — tells TypeScript the state holds an **array of Account objects**
- `[]` is the initial value — an empty array (no accounts yet)

**Breaking it down:**
| Part | Meaning |
|------|---------|
| `accounts` | Current state value (initially `[]`) |
| `setAccounts` | Function to update state; accepts new `Account[]` or updater function |
| `<Account[]>` | Type annotation for TypeScript — this state is an array of Account objects |
| `[]` | Initial value when component first mounts |

**Example usage:**
```typescript
// Set state to new array
setAccounts([newAccount1, newAccount2])

// Update using function
setAccounts(prev => [...prev, newAccount])
```

---

## 3. Populating with Mock Data: `setAccounts(generateMockAccounts())`

**What it does:**
- Calls `generateMockAccounts()` which returns a pre-built array of fake `Account` objects (see `src/components/account-review/mockDataGenerator.ts`)
- Passes that array to `setAccounts()` to update the state

**Mock Data Example** (from `mockDataGenerator.ts`):
```typescript
{
  id: 1,
  accountNumber: 'ACC-12345678',
  ownerName: 'Ram Thapa',
  balance: 5000.00,
  status: 'ACTIVE',  // must be 'ACTIVE' or 'INACTIVE'
  createdAt: '2026-01-15T10:00:00'
}
```

### ⚠️ Type Safety: What if the mock doesn't match the `Account` interface?

**Compile-time (Development):**
- TypeScript compiler checks that `generateMockAccounts()` returns `Account[]`
- If any field is wrong type, wrong name, or missing → **compile error** → you can't build
- Example errors TypeScript would catch:
  ```typescript
  // ❌ ERROR: balance should be number, not string
  balance: "5000" 
  
  // ❌ ERROR: status must be 'ACTIVE' or 'INACTIVE', not 'PENDING'
  status: 'PENDING'
  
  // ❌ ERROR: missing required field 'accountNumber'
  ```

**Runtime (After Deployment):**
- TypeScript types are erased — only JavaScript runs
- If types somehow mismatch (e.g., data from an untyped API, or code with `as any`), you get runtime crashes:
  - `account.balance.toFixed(2)` crashes if `balance` is a string
  - `new Date(account.createdAt)` gives `Invalid Date` if `createdAt` is malformed
  - UI might render wrong data or fail

**Best Practices to Prevent Issues:**
1. ✅ Keep mock generator, API responses, and state all typed with the same interface
2. ✅ For external data (real API), validate at runtime:
   ```typescript
   // Example: validate API response before setting state
   fetch('/api/accounts')
     .then(res => res.json())
     .then(data => {
       // Runtime validation (using zod, for example)
       const validated = AccountsSchema.parse(data)
       setAccounts(validated)
     })
   ```
3. ✅ Use optional chaining and fallbacks for defensive coding in render:
   ```typescript
   ${account.balance?.toFixed(2) ?? 'N/A'}
   ```

---

## 4. Setting Loading State: `setLoading(false)`

**What it does:**
- Updates the `loading` state from `true` to `false`
- Triggers a re-render of the component

**In Context:**
```typescript
const [loading, setLoading] = useState(true)  // starts as true

useEffect(() => {
  // ... fetch or load data ...
  setLoading(false)  // once done, set to false
}, [])
```

**How it's used in the component** (from `accountReview.tsx`):
```typescript
function AccountReview({ accounts, loading, error, mode = 'view' }: Props) {
  if (loading) return <div>Loading accounts...</div>  // show loading message
  if (error) return <div>Error: {error}</div>        // show error if one exists
  
  return (
    <div>
      {/* render the table with accounts */}
    </div>
  )
}
```

**Flow:**
1. Component mounts → `loading = true` → shows "Loading accounts..."
2. Data loads (mock or real API)
3. `setLoading(false)` called → re-render triggers
4. `loading = false` → skips the if-check → renders the account table

---

## 5. Rendering Child Component: `return <AccountReview accounts={accounts} loading={loading} error={error} mode={mode} />`

**What it does:**
- Returns (renders) a JSX component called `AccountReview`
- Passes four **props** (properties) to that component

**Props Passed:**
| Prop | Type | Purpose |
|------|------|---------|
| `accounts` | `Account[]` | Array of account objects to display in the table |
| `loading` | `boolean` | Is data still loading? |
| `error` | `string \| null` | Error message, if any |
| `mode` | `'view' \| 'work'` | Determines UI features; 'work' shows "Create New Account" button |

**In TypeScript Terms:**
- The receiving component (`AccountReview`) declares a `Props` interface:
  ```typescript
  interface Props extends AccountReviewProps {
    accounts: Account[]
    loading: boolean
    error: string | null
  }
  ```
- TypeScript checks that your JSX passes all required props with correct types
- If you forget a prop or pass the wrong type → compile error

**At Runtime:**
- JSX compiles to `React.createElement()` calls
- Props are passed as a JavaScript object

**Example of how `AccountReview` uses props:**
```typescript
function AccountReview({ accounts, loading, error, mode = 'view' }: Props) {
  // ... conditional rendering based on loading/error ...
  
  {accounts.map(account => (
    <tr key={account.id}>
      <td>{account.accountNumber}</td>
      <td>{account.ownerName}</td>
      <td>${account.balance.toFixed(2)}</td>
      <td><span className={`status ${account.status.toLowerCase()}`}>
        {account.status}
      </span></td>
      <td>{new Date(account.createdAt).toLocaleDateString()}</td>
    </tr>
  ))}
}
```

---

## Complete Data Flow

```
┌─────────────────────────────────────────────────────────┐
│ AccountReviewMfe (Container Component)                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  useState<Account[]>([])  ← accounts, setAccounts        │
│           ↓                                               │
│  useEffect → generateMockAccounts() or fetch API         │
│           ↓                                               │
│  setAccounts(data)  ← updates state                      │
│  setLoading(false)  ← shows data is ready                │
│           ↓                                               │
│  return <AccountReview props />  ← passes data down      │
│                                                           │
└─────────────────────────────────────────────────────────┘
                        ↓
         ┌──────────────────────────────┐
         │ AccountReview (Presentational) │
         ├──────────────────────────────┤
         │ Receives props:              │
         │  - accounts: Account[]       │
         │  - loading: boolean          │
         │  - error: string | null      │
         │  - mode: 'view'|'work'       │
         │                              │
         │ Renders table with accounts  │
         └──────────────────────────────┘
```

---

## Files in This Project

| File | Purpose |
|------|---------|
| `src/components/account-review/accountReviewMfe.tsx` | **Container component** — manages state, fetches data, handles logic |
| `src/components/account-review/accountReview.tsx` | **Presentational component** — renders UI based on props received |
| `src/components/account-review/types.ts` | **Type definitions** — `Account` interface and `AccountReviewProps` interface |
| `src/components/account-review/mockDataGenerator.ts` | **Mock data** — generates fake account objects for testing without a backend |

---

## Key Takeaways

✅ **Type Annotations** help catch errors at compile time (before runtime)  
✅ **Interfaces** define contracts — all accounts must match the `Account` shape  
✅ **State** (`useState`) holds data and a function to update it  
✅ **Props** pass data from parent to child components  
✅ **Conditional rendering** shows different UI based on `loading` and `error` states  
✅ **Mock data is typed** — compile-time check that mock matches interface  

---

## For GitHub / Learning

This component is a good example of:
- **Separation of Concerns**: Container (logic) vs Presentational (UI) components
- **TypeScript Type Safety**: Using interfaces to validate data shape
- **React Hooks**: `useState` and `useEffect` for state and side effects
- **Responsive Design**: Loading states and error handling
- **Mock Data Pattern**: Testing UI without a real backend

Feel free to reference this when learning React + TypeScript!

