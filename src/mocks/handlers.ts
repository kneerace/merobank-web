import { http, HttpResponse } from 'msw'
import { paymentReviewRefData } from '../components/dynamic-section/mockRefData'
import { generateMockAccounts } from '../components/account-review/mockDataGenerator'
import { generateMockPayments, generateMockTask } from '../components/payment-task/mockDataGenerator'

export const handlers = [
  // refdata endpoint
  http.get('/refdata/payment/review', () => {
    return HttpResponse.json(paymentReviewRefData)
  }),

  // account-service via gateway
  http.get('http://localhost:8080/api/accounts', () => {
    return HttpResponse.json(generateMockAccounts())
  }),

  // payment-service via gateway
  http.get('http://localhost:8080/api/payments', () => {
    return HttpResponse.json(generateMockPayments())
  }),

  // Camunda task endpoint - intercept per processInstanceId
  http.get('http://localhost:8082/engine-rest/task', ({ request }) => {
    const url = new URL(request.url)
    const processInstanceId = url.searchParams.get('processInstanceId')

    if (!processInstanceId) return HttpResponse.json([])

    return HttpResponse.json([generateMockTask(processInstanceId)])
  }),

  http.post('http://localhost:8080/auth/login', async ({ request }) => {
    const body = await request.json() as { username: string, password: string }

    if (body.username === 'admin' && body.password === 'admin123') {
      return HttpResponse.json({
        token: 'mock-jwt-token-for-development',
        username: 'admin',
        message: 'Login successful'
      })
    }

    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  })
]