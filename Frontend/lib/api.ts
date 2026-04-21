import axios, { AxiosError, AxiosInstance } from 'axios'
import { ApiResponse } from '@/types/common'
import { API_BASE_URL } from './constants'

function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return 'Network Error: unable to reach the backend API. Make sure the FastAPI server is running on http://localhost:8000.'
    }

    const responseData = error.response.data as
      | { detail?: string; message?: string }
      | string
      | undefined

    if (typeof responseData === 'string' && responseData.trim()) {
      return responseData
    }

    if (responseData && typeof responseData === 'object') {
      if (typeof responseData.detail === 'string' && responseData.detail.trim()) {
        return responseData.detail
      }

      if (typeof responseData.message === 'string' && responseData.message.trim()) {
        return responseData.message
      }
    }

    return error.message
  }

  return 'An error occurred'
}

function logHandledApiMessage(endpoint: string, message: string, error: unknown) {
  if (typeof window === 'undefined') return

  if (error instanceof AxiosError && error.response) {
    console.warn(`API Warning [${endpoint}]:`, message)
    return
  }

  console.error(`API Error [${endpoint}]:`, message)
}

export class ApiClient {
  private axiosInstance: AxiosInstance

  constructor(baseUrl: string = API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => Promise.reject(error)
    )
  }

  public async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(endpoint)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      const message = getApiErrorMessage(error)
      logHandledApiMessage(endpoint, message, error)
      return {
        success: false,
        error: message,
      }
    }
  }

  public async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(endpoint, body, {
        headers: body instanceof FormData ? { 'Content-Type': undefined } : undefined,
      })
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      const message = getApiErrorMessage(error)
      logHandledApiMessage(endpoint, message, error)
      return {
        success: false,
        error: message,
      }
    }
  }

  public async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(endpoint, body)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      const message = getApiErrorMessage(error)
      logHandledApiMessage(endpoint, message, error)
      return {
        success: false,
        error: message,
      }
    }
  }

  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(endpoint)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      const message = getApiErrorMessage(error)
      logHandledApiMessage(endpoint, message, error)
      return {
        success: false,
        error: message,
      }
    }
  }
}

export const apiClient = new ApiClient()
