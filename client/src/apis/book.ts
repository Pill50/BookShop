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

const getStatistic = async () => {
  const path = `/book/statistic`
  const response = await apiCaller('GET', path)
  return response
}

const filterBooks = async (values: FilterBook) => {
  let apiPath: string = `/book?page=${values.pageIndex}`
  if (values.keyword !== undefined) apiPath += `&keyword=${encodeURIComponent(values.keyword)}`
  if (values.rating !== undefined) apiPath += `&rating=${encodeURIComponent(values.rating)}`
  if (values.categories !== undefined) apiPath += `&categories=${values.categories}`
  if (values.publisherId !== undefined) apiPath += `&publisherId=${values.publisherId}`
  if (values.sortByPrice !== undefined) apiPath += `&sortByPrice=${encodeURIComponent(values.sortByPrice)}`
  if (values.sortByDate !== undefined) apiPath += `&sortByDate=${encodeURIComponent(values.sortByDate)}`
  if (values.sortBySoldAmount !== undefined)
    apiPath += `&sortBySoldAmount=${encodeURIComponent(values.sortBySoldAmount)}`

  // const basePath = '/search' + apiPath.slice(5)
  // window.history.pushState({}, '', basePath)

  const response = await apiCaller('GET', apiPath)
  return response
}

export { getTopTrending, getTopNewest, getBookBySlug, getBookById, getRelatedBooks, getStatistic, filterBooks }
