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
  async (response: any) => {
    if (
      response?.status === 200 &&
      response.data.errors &&
      response.data.errors[0].message === 'Access token expired'
    ) {
      const config = response.config
      if (!config._retry) {
        config._retry = true
        const refreshToken = Cookies.get('refreshToken') as string

        try {
          const refreshResponse = await AuthApis.refreshToken(refreshToken)
          const accessToken = refreshResponse.data.data.refreshTokens.accessToken
          const newRefreshToken = refreshResponse.data.data.refreshTokens.refreshToken

          if (accessToken) {
            Cookies.set('accessToken', accessToken)
            Cookies.set('refreshToken', newRefreshToken)

            config.headers['Authorization'] = `Bearer ${accessToken}`

            return axiosPublic(config)
          }
        } catch (refreshError) {
          console.log('refreshError', refreshError)
        }
      }
    }

    return response
  },
  async (error) => {
    if (error?.response?.status === 401 && error.response.data.message === 'Access token expired') {
      const config = error.config
      if (!config._retry) {
        config._retry = true
        const refreshToken = Cookies.get('refreshToken') as string

        return AuthApis.refreshToken(refreshToken)
          .then((response) => {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data

            if (accessToken) {
              Cookies.set('accessToken', accessToken)
              Cookies.set('refreshToken', newRefreshToken)

              config.headers['Authorization'] = `Bearer ${accessToken}`

              // Retry the original request with the new token
              return axiosPublic(config)
            }
          })
          .catch((refreshError) => {
            if (refreshError.response.data.message === 'Please login again') {
              Cookies.remove('refreshToken')
              Cookies.remove('accessToken')
              window.location.href = '/'
            }

            return Promise.reject(refreshError)
          })
      }
    }

    if (error?.response?.data.message === 'Please login again') {
      Cookies.remove('refreshToken')
      Cookies.remove('accessToken')
      window.location.href = '/'
    }

    return Promise.reject(error)
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
