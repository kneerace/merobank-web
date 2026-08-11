import { useState, useEffect } from 'react'
import AccountReview from './accountReview'
import { generateMockAccounts } from './mockDataGenerator'
// import { Account, AccountReviewProps } from './types'
import type { Account, AccountReviewProps } from './types'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

function AccountReviewMfe({ mode = 'view' }: AccountReviewProps) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    if (USE_MOCK) {
      // use mock data for local development without backend
      setTimeout(() => {
        setAccounts(generateMockAccounts())
        setLoading(false)
      }, 500)
      return
    }

    // fetch real data from account-service via gateway
    const token = localStorage.getItem('merobank-token')
    fetch(`${API_BASE}/api/accounts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch accounts')
        return res.json()
      })
      .then(data => {
        setAccounts(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return <AccountReview accounts={accounts} loading={loading} error={error} mode={mode} />
}

export default AccountReviewMfe