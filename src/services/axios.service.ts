import axios, { AxiosError, AxiosResponse } from "axios";
import { ACCESS_TOKEN_LOCAL_STORAGE } from "../constants/common";

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
}

/**
 * API Error structure
 */
export interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

const http = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor - adds auth token to all requests
 */
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor - handles auth errors and standardizes error format
 */
http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;

    // Handle authentication errors
    if (status === 401 || status === 403) {
      localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE);
      // Use window.location for redirect outside React context
      // This is the correct approach for axios interceptors
      window.location.href = "/";
      return Promise.reject(error);
    }

    // Standardize error format
    const apiError: ApiError = {
      message:
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "An unexpected error occurred",
      status: status || 500,
      data: error.response?.data,
    };

    return Promise.reject(apiError);
  },
);

/**
 * GET request with type safety
 */
export const getApi = <T = unknown>(url: string): Promise<ApiResponse<T>> => {
  return http.get<ApiResponse<T>>(url).then((res) => res.data);
};

/**
 * POST request with type safety
 */
export const postApi = <T = unknown, D = unknown>(
  url: string,
  data: D,
): Promise<ApiResponse<T>> => {
  return http.post<ApiResponse<T>>(url, data).then((res) => res.data);
};

/**
 * PUT request with type safety
 */
export const putApi = <T = unknown, D = unknown>(
  url: string,
  data: D,
): Promise<ApiResponse<T>> => {
  return http.put<ApiResponse<T>>(url, data).then((res) => res.data);
};

/**
 * DELETE request with type safety
 */
export const deleteApi = <T = unknown>(
  url: string,
): Promise<ApiResponse<T>> => {
  return http.delete<ApiResponse<T>>(url).then((res) => res.data);
};

export default http;
