import { apiCaller } from '~/configs/apiCaller'
import { FilterBook } from '~/types/book'

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

const filterBooks = async (values: FilterBook) => {
  let basePath: string = `/book?page=${values.pageIndex}`
  if (values.keyword !== undefined) basePath += `&keyword=${encodeURIComponent(values.keyword)}`
  if (values.categories !== undefined) basePath += `&categories=${values.categories}`
  if (values.publisherId !== undefined) basePath += `&publisherId=${values.publisherId}`
  if (values.sortByPrice !== undefined) basePath += `&sortByPrice=${encodeURIComponent(values.sortByPrice)}`
  if (values.sortByDate !== undefined) basePath += `&sortByDate=${encodeURIComponent(values.sortByDate)}`
  if (values.sortBySoldAmount !== undefined)
    basePath += `&sortBySoldAmount=${encodeURIComponent(values.sortBySoldAmount)}`

  window.history.pushState({}, '', basePath)

  const response = await apiCaller('GET', basePath)
  return response
}

export { getTopTrending, getTopNewest, getBookBySlug, getBookById, getRelatedBooks, filterBooks }
