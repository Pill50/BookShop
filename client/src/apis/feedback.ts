import { apiCaller } from '~/configs/apiCaller'
import { CreateFeedback } from '~/types/feedback'

const createFeedback = async (values: CreateFeedback) => {
  const path = '/feedback/create'
  const response = await apiCaller('POST', path, values)
  return response
}

export { createFeedback }
