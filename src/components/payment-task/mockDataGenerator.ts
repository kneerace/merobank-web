import type { Payment, CamundaTask } from './types'

export const generateMockPayments = (): Payment[] => [
  {
    id: 1,
    fromAccountId: 1,
    fromAccountNumber: 'ACC-12345678',
    fromOwnerName: 'Ram Thapa',
    toAccountId: 2,
    toAccountNumber: 'ACC-87654321',
    toOwnerName: 'Sita KC',
    amount: 5500.00,
    status: 'UNDER_REVIEW',
    description: null,
    createdAt: '2026-08-09T10:00:00',
    processInstanceId: 'mock-process-instance-001'
  },
  {
    id: 2,
    fromAccountId: 3,
    fromOwnerName: 'John Doe',
    fromAccountNumber: 'ACC-98765432',
    toAccountId: 1,
    toOwnerName: 'Jane Smith',
    toAccountNumber: 'ACC-11223344',
    amount: 7200.00,
    status: 'UNDER_REVIEW',
    description: 'Large transfer',
    createdAt: '2026-08-09T11:30:00',
    processInstanceId: 'mock-process-instance-002'
  }
]

export const generateMockTask = (processInstanceId: string): CamundaTask => ({
  id: `mock-task-${processInstanceId}`,
  name: 'Manual Payment Review',
  assignee: 'admin',
  created: new Date().toISOString(),
  processInstanceId
})