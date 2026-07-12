import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { env } from '@/config/env'
import { STORAGE_KEYS } from '@/config/constants'
import type { AppError } from '@/types'

/**
 * Singleton Axios instance. Request interceptor attaches the bearer token;
 * response interceptor normalizes every failure into an `AppError` so the
 * UI layer deals with a single, predictable error shape.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.authToken)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (
    error: AxiosError<{
      message?: string
      fieldErrors?: Record<string, string[]>
    }>,
  ) => {
    const appError: AppError = {
      status: error.response?.status ?? 0,
      message:
        error.response?.data?.message ??
        error.message ??
        'Something went wrong. Please try again.',
      details: error.response?.data?.fieldErrors,
    }

    // Session expired — drop the token so guards can redirect to login.
    if (appError.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.authToken)
    }

    return Promise.reject(appError)
  },
)
