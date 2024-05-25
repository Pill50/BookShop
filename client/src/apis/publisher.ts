import { apiCaller } from '~/configs/apiCaller'

const getAllPublishers = async () => {
  const path = '/publisher'
  const response = await apiCaller('GET', path)
  return response
}

export { getAllPublishers }
