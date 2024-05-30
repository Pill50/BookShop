export type CreatePayment = {
  orderInfo: string
  orderId: string
  paymentId: string
  redirectUrl: string
  ipnUrl: string
  requestType: string
  amount: number
  extraData: string
  autoCapture: boolean
}

export type UpdatePayment = {
  paymentId: string
  transactionId: string
}
