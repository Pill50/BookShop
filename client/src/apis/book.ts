import { apiCaller } from '~/configs/apiCaller'

const getTopTrending = async () => {
  const path = '/book/best-sellers'
  const response = await apiCaller('GET', path)
  return response
}

const getTopNewest = async () => {
  const path = '/book/newest'
  const response = await apiCaller('GET', path)
  return response
}

const getBookBySlug = async (slug: string) => {
  const path = `/book/${slug}`
  const response = await apiCaller('GET', path)
  return response
}

const getBookById = async (id: string) => {
  const path = `/book/id/${id}`
  const response = await apiCaller('GET', path)
  return response
}

const getRelatedBooks = async (categories: string) => {
  const path = `/book/related?categories=${categories}`
  const response = await apiCaller('GET', path)
  return response
}

export { getTopTrending, getTopNewest, getBookBySlug, getBookById, getRelatedBooks }
