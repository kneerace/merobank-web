export interface Account  {
  id: number
  accountNumber: string
  ownerName: string
  balance: number
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
}

export interface AccountReviewProps  {
  mode?: 'work' | 'view'
}