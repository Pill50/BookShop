import { apiCaller } from '~/configs/apiCaller'

const getTopTrending = async () => {
  const path = '/book/best-sellers'
  const response = await apiCaller('GET', path)
  return response
}

export { getTopTrending }
