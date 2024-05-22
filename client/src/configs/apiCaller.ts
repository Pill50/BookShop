import axios from 'axios'

const axiosPublic = axios.create({
  baseURL: 'http://localhost:8080/api'
})

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
