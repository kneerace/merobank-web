export interface Payment {
  id: number
  fromAccountId: number
  fromAccountNumber?: string
  fromOwnerName?: string
  toAccountId: number
  toAccountNumber?: string
  toOwnerName?: string
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'REJECTED' | 'UNDER_REVIEW' | 'CANCELLED'
  description: string | null
  createdAt: string
  processInstanceId: string | null
}
export interface CamundaTask {
  id: string
  name: string
  assignee: string
  created: string
  processInstanceId: string
}

export interface PaymentTaskProps {
  mode?: 'work' | 'view'
}

export type ReviewDecision = 'APPROVED' | 'DENIED'