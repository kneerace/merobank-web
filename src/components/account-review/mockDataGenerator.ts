import type { Account } from './types'

export const generateMockAccounts = (): Account[] => [
  {
    id: 1,
    accountNumber: 'ACC-12345678',
    ownerName: 'Ram Thapa',
    balance: 5000.00,
    status: 'ACTIVE',
    createdAt: '2026-01-15T10:00:00'
  },
  {
    id: 2,
    accountNumber: 'ACC-87654321',
    ownerName: 'Sita Rai',
    balance: 3000.00,
    status: 'ACTIVE',
    createdAt: '2026-02-20T14:30:00'
  },
  {
    id: 3,
    accountNumber: 'ACC-11223344',
    ownerName: 'Hari Gurung',
    balance: 0.00,
    status: 'INACTIVE',
    createdAt: '2026-03-10T09:15:00'
  }
] // end of generateMockAccounts