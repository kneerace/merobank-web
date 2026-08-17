import type { RefDataConfig } from './types'

export const paymentReviewRefData: RefDataConfig = {
  data: [
    {
      id: 'payment-review-id',
      layout: [
        {
          type: 'leftAligned',
          header: 'Payment ID',
          jsonPath: 'id'
        },
        {
          type: 'leftAligned',
          header: 'From Account',
          jsonPath: 'fromOwnerName',
          primaryValueFormatter: 'startCase'
        },
        {
          type: 'leftAligned',
          header: 'To Account',
          jsonPath: 'toOwnerName',
          primaryValueFormatter: 'startCase'
        },
        {
          type: 'leftAligned',
          header: 'Amount',
          jsonPath: 'amount',
          primaryValueFormatter: 'currency'
        },
        {
          type: 'leftAligned',
          header: 'Status',
          jsonPath: 'status',
          primaryValueFormatter: 'startCase'
        },
        {
          type: 'leftAligned',
          header: 'Created',
          jsonPath: 'createdAt',
          primaryValueFormatter: 'dateTime'
        }
      ]
    }
  ],
  metadata: {
    borderless: false,
    showShadow: true
  }
}