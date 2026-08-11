import type { Payment, CamundaTask, PaymentTaskProps, ReviewDecision } from './types'

interface Props extends PaymentTaskProps {
  payments: Payment[]
  loading: boolean
  error: string | null
  onReview: (taskId: string, decision: ReviewDecision) => void
  tasks: Record<string, CamundaTask>
}

function PaymentTask({ payments, loading, error, mode = 'view', onReview, tasks }: Props) {
  if (loading) return <div>Loading payments...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="payment-task">
      <h2>Payment Review Queue</h2>
      {payments.length === 0 && <p>No payments pending review.</p>}
      {payments.map(payment => {
        const task = tasks[payment.processInstanceId || '']
        return (
          <div key={payment.id} className="payment-card">
            <div className="payment-header">
              <span className="payment-id">Payment #{payment.id}</span>
              <span className={`status ${payment.status.toLowerCase()}`}>
                {payment.status}
              </span>
            </div>
            <div className="payment-details">
              <div><label>From:</label> {payment.fromOwnerName || payment.fromAccountId}
                {payment.fromAccountNumber && ` (${payment.fromAccountNumber})`}
              </div>
              <div><label>To:</label> {payment.toOwnerName || payment.toAccountId}
                {payment.toAccountNumber && ` (${payment.toAccountNumber})`}
              </div>
              <div><label>Amount:</label> <strong>${payment.amount.toFixed(2)}</strong></div>
              <div><label>Created:</label> {new Date(payment.createdAt).toLocaleString()}</div>
              {payment.description && (
                <div><label>Description:</label> {payment.description}</div>
              )}
            </div>
            {task && mode === 'work' && (
              <div className="payment-actions">
                <button
                  className="btn-approve"
                  onClick={() => onReview(task.id, 'APPROVED')}
                >
                  ✓ Approve
                </button>
                <button
                  className="btn-deny"
                  onClick={() => onReview(task.id, 'DENIED')}
                >
                  ✗ Deny
                </button>
              </div>
            )}
            {mode === 'view' && (
              <div className="payment-actions">
                <button className="btn-approve" disabled>✓ Approve</button>
                <button className="btn-deny" disabled>✗ Deny</button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default PaymentTask