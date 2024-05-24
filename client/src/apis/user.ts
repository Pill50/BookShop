import { apiCaller } from '~/configs/apiCaller'

const getProfile = async () => {
  const path = '/user/profile'
  const response = await apiCaller('GET', path)
  return response
}

export { getProfile }
