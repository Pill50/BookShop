import { apiCaller } from '~/configs/apiCaller'
import { Order, UpdateStatusOrder } from '~/types/order'

const createOrder = async (values: Order) => {
  const path = '/order/create'
  const response = await apiCaller('POST', path, values)
  return response
}

const updateOrderStatus = async (values: UpdateStatusOrder) => {
  const path = '/order/update-status'
  const response = await apiCaller('PUT', path, values)
  return response
}

export { createOrder, updateOrderStatus }
