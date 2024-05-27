import { apiCaller } from '~/configs/apiCaller'
import { FilterPromotion } from '~/types/promotion'

const filterPromotions = async (values: FilterPromotion) => {
  let basePath: string = `/promotion?page=${values.pageIndex}`
  if (values.type !== undefined) basePath += `&type=${encodeURIComponent(values.type)}`

  window.history.pushState({}, '', basePath)

  const response = await apiCaller('GET', basePath)
  return response
}

export { filterPromotions }
