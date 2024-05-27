import { apiCaller } from '~/configs/apiCaller'
import { UpdateInformation as UpdateInformationType } from '~/types/user'

const getProfile = async () => {
  const path = '/user/profile'
  const response = await apiCaller('GET', path)
  return response
}

const updateInformation = async (values: UpdateInformationType) => {
  const path = '/user/edit-profile'
  const response = await apiCaller('POST', path, values)
  return response
}

export { getProfile, updateInformation }
