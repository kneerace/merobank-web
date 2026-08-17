import { useState, useEffect } from 'react'
import AccountReview from './accountReview'
import type { Account, AccountReviewProps } from './types'
import { logger } from '../../utils/logger'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

function AccountReviewMfe({ mode = 'view' }: AccountReviewProps) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    logger.info('AccountReviewMfe: fetching accounts')

    const token = localStorage.getItem('merobank-token')

    fetch(`${API_BASE}/api/accounts`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch accounts')
        return res.json()
      })
      .then(data => {
        logger.info('AccountReviewMfe: accounts loaded', { count: data.length })
        setAccounts(data)
        setLoading(false)
      })
      .catch(err => {
        logger.error('AccountReviewMfe: fetch failed', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return <AccountReview accounts={accounts} loading={loading} error={error} mode={mode} />
}

export default AccountReviewMfe