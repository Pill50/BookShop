import { apiCaller } from '~/configs/apiCaller'
import { CreatePayment, UpdatePayment } from '~/types/payment'

const getPaymentUrl = async (values: CreatePayment) => {
  const path = '/payment/create'
  const response = await apiCaller('POST', path, values)
  return response
}

const updatePaymentStatus = async (values: UpdatePayment) => {
  const path = '/payment/update-status'
  const response = await apiCaller('PUT', path, values)
  return response
}

export { getPaymentUrl, updatePaymentStatus }
