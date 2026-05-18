import axios from 'axios'
import { API_CONFIG } from '../constants/api'
import { handleRequest, handleResponse, handleResponseError } from './interceptors'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(handleRequest, (error) => Promise.reject(error))
apiClient.interceptors.response.use(handleResponse, handleResponseError)

export default apiClient
