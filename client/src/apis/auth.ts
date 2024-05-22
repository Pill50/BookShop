import { apiCaller } from '~/configs/apiCaller'
import { Login as LoginType } from '../types/auth'

const login = async (values: LoginType) => {
  const path = '/auth/login'
  const data: LoginType = {
    email: values.email,
    password: values.password
  }
  const response = await apiCaller('POST', path, data)
  return response
}

export { login }
