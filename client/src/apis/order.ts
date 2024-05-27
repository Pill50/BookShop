import { apiCaller } from '~/configs/apiCaller'
import { Order } from '~/types/order'

const createOrder = async (values: Order) => {
  const path = '/order/create'
  const response = await apiCaller('POST', path, values)
  return response
}

export { createOrder }
