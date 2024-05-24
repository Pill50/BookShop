import axios from 'axios'
import Cookies from 'js-cookie'
import { AuthApis } from '~/apis'

const axiosPublic = axios.create({
  baseURL: 'http://localhost:8080'
})

const axiosInstance = axios.create()

axiosPublic.interceptors.request.use(
  async (config: any) => {
    const accessToken = Cookies.get('accessToken')
    if (accessToken) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${accessToken}`
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

axiosPublic.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const config = error?.config
    if (error?.response?.status === 401 && error.response.data.message === 'Access token expired' && !config._retry) {
      config._retry = true
      const refreshToken = Cookies.get('refreshToken') as string
      const response = await AuthApis.refreshToken(refreshToken)
      const accessToken = response.data.data.accessToken
      if (accessToken) {
        Cookies.set('accessToken', accessToken)
        Cookies.set('refreshToken', response.data.data.refreshToken)
        config.headers = {
          ...config.headers,
          authorization: `Bearer ${accessToken}`
        }
        return axiosInstance(config)
      }
    }
    if (error) {
      if (error.response.data.message === 'Please login again') {
        Cookies.remove('refreshToken')
        Cookies.remove('accessToken')
        window.location.href = '/'
      }

      return Promise.reject(error.response)
    }
  }
)

export const apiCaller = (method: string, path: string, data?: any) => {
  return axiosPublic({
    method,
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*'
    },
    url: `${path}`,
    data
  })
}

export default apiCaller
