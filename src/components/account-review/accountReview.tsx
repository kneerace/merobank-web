import type { Account, AccountReviewProps } from './types'

interface Props extends AccountReviewProps {
  accounts: Account[]
  loading: boolean
  error: string | null
}

function AccountReview({ accounts, loading, error, mode = 'view' }: Props) {
  if (loading) return <div>Loading accounts...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="account-review">
      <h2>Account Management</h2>
      {mode === 'work' && (
        <button className="btn-primary">Create New Account</button>
      )}
      <table className="data-table">
        <thead>
          <tr>
            <th>Account Number</th>
            <th>Owner</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id}>
              <td>{account.accountNumber}</td>
              <td>{account.ownerName}</td>
              <td>${account.balance.toFixed(2)}</td>
              <td>
                <span className={`status ${account.status.toLowerCase()}`}>
                  {account.status}
                </span>
              </td>
              <td>{new Date(account.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AccountReview