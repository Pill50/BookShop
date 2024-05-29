import { apiCaller } from '~/configs/apiCaller'
import { GetUserOrder } from '~/types/order'
import { UpdateInformation as UpdateInformationType } from '~/types/user'

const getProfile = async () => {
  const path = '/user/profile'
  const response = await apiCaller('GET', path)
  return response
}

const updateInformation = async (values: UpdateInformationType) => {
  const path = '/user/edit-profile'
  const response = await apiCaller('POST', path, values)
  return response
}

const getUserOrders = async (filter: GetUserOrder) => {
  let basePath: string = `/user/my-orders?page=${filter.pageIndex}`
  if (filter.status !== undefined) basePath += `&status=${encodeURIComponent(filter.status)}`
  const response = await apiCaller('GET', basePath)
  return response
}

export { getProfile, updateInformation, getUserOrders }
