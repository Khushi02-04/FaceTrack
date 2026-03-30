import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from './constants';
import { ApiResponse } from '@/types/common';

function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as
      | { detail?: string; message?: string }
      | string
      | undefined;

    if (typeof responseData === 'string' && responseData.trim()) {
      return responseData;
    }

    if (responseData && typeof responseData === 'object') {
      if (typeof responseData.detail === 'string' && responseData.detail.trim()) {
        return responseData.detail;
      }

      if (typeof responseData.message === 'string' && responseData.message.trim()) {
        return responseData.message;
      }
    }

    return error.message;
  }

  return 'An error occurred';
}

export class ApiClient {
  private axiosInstance: AxiosInstance;

constructor(baseUrl: string = API_BASE_URL || 'http://localhost:8000/api/v1') {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API Error:', error.message);
        throw error;
      }
    );
  }

  public async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(endpoint);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const message = getApiErrorMessage(error);
      console.error(`API Error [${endpoint}]:`, message);
      return {
        success: false,
        error: message,
      };
    }
  }

  public async post<T>(
    endpoint: string,
    body: unknown
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(endpoint, body);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const message = getApiErrorMessage(error);
      console.error(`API Error [${endpoint}]:`, message);
      return {
        success: false,
        error: message,
      };
    }
  }

  public async put<T>(
    endpoint: string,
    body: unknown
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(endpoint, body);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const message = getApiErrorMessage(error);
      console.error(`API Error [${endpoint}]:`, message);
      return {
        success: false,
        error: message,
      };
    }
  }

  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(endpoint);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const message = getApiErrorMessage(error);
      console.error(`API Error [${endpoint}]:`, message);
      return {
        success: false,
        error: message,
      };
    }
  }
}

export const apiClient = new ApiClient();
