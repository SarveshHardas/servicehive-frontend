import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { API_CONFIG } from '../constants/api'
import { ApiError } from '../utils/api-error'

export const handleRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = localStorage.getItem(API_CONFIG.TOKEN_KEY)
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config     
}

export const handleResponse = (response: AxiosResponse): AxiosResponse => {
  return response
}

export const handleResponseError = (error: AxiosError): Promise<never> => {
  if (error.response?.status === 401) {
    localStorage.removeItem(API_CONFIG.TOKEN_KEY)
    window.location.href = '/login'
  }

  const message = (error.response?.data as { message?: string })?.message || error.message
  const status = error.response?.status
  const code = (error.response?.data as { code?: string })?.code
  const errors = (error.response?.data as { errors?: Record<string, string[]> })?.errors

  return Promise.reject(new ApiError(message, status, code, errors))
}
