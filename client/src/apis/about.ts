import { apiCaller } from '~/configs/apiCaller'

const getAboutPageContent = async () => {
  const path = '/about'
  const response = await apiCaller('GET', path)
  return response
}

export { getAboutPageContent }
