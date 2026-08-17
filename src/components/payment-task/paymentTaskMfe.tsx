import { useState, useEffect } from 'react'
import PaymentTask from './paymentTask'
import type { Payment, CamundaTask, PaymentTaskProps, ReviewDecision } from './types'
import { logger } from '../../utils/logger'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
const CAMUNDA_BASE = import.meta.env.VITE_CAMUNDA_BASE || 'http://localhost:8082'

function PaymentTaskMfe({ mode = 'view' }: PaymentTaskProps) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [tasks, setTasks] = useState<Record<string, CamundaTask>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const token = localStorage.getItem('merobank-token')

  useEffect(() => {
    logger.info('PaymentTaskMfe: fetching payments')

    const token = localStorage.getItem('merobank-token')

    // fetch real UNDER_REVIEW payments from payment-service
    fetch(`${API_BASE}/api/payments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(async (allPayments: Payment[]) => {
        const underReview = allPayments.filter(p => p.status === 'UNDER_REVIEW')
        logger.info('PaymentTaskMfe: payments loaded', { underReview: underReview.length })
        setPayments(underReview)

        // fetch Camunda task for each payment
        const taskMap: Record<string, CamundaTask> = {}
        await Promise.all(
          underReview.map(async payment => {
            if (!payment.processInstanceId) return
            const res = await fetch(
              `${CAMUNDA_BASE}/engine-rest/task?processInstanceId=${payment.processInstanceId}`
            )
            const taskList: CamundaTask[] = await res.json()
            if (taskList.length > 0) {
              taskMap[payment.processInstanceId] = taskList[0]
            }
          })
        )
        setTasks(taskMap)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
        logger.error('PaymentTaskMfe: fetch failed', err)
      })
  }, [])

  const handleReview = async (taskId: string, decision: ReviewDecision) => {
      logger.info('PaymentTaskMfe: submitting review decision', { taskId, decision })

    try {
      await fetch(`${CAMUNDA_BASE}/engine-rest/task/${taskId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variables: {
            reviewDecision: { value: decision, type: 'String' }
          }
        })
      })
      // refresh payments after decision
      setPayments(prev => prev.filter(p => tasks[p.processInstanceId || '']?.id !== taskId))
    } catch (err) {
         logger.error('PaymentTaskMfe: review submission failed', err)
      setError('Failed to submit review decision')
    }
  }

  return (
    <PaymentTask
      payments={payments}
      loading={loading}
      error={error}
      mode={mode}
      onReview={handleReview}
      tasks={tasks}
    />
  )
}

export default PaymentTaskMfe