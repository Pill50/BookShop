import { apiCaller } from '~/configs/apiCaller'

const getAllCategories = async () => {
  const path = '/category'
  const response = await apiCaller('GET', path)
  return response
}

export { getAllCategories }
