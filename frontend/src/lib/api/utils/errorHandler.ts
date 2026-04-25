/**
 * Error Handling Utilities
 * Centralized error handling, logging, and user-friendly messages
 */

import { AxiosError } from "axios";
import { ApiError } from "../types/api";

/**
 * Parse axios error to standardized ApiError format
 */
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const { response, message } = error;

    // Server responded with error status
    if (response) {
      return {
        message: response.data?.message || response.statusText || message,
        status: response.status,
        code: response.data?.code,
        details: response.data?.details,
      };
    }

    // Request made but no response
    if (error.request) {
      return {
        message: "No response from server. Please check your connection.",
        status: 0,
        code: "NO_RESPONSE",
      };
    }

    // Error in request setup
    return {
      message: message || "An error occurred while setting up the request.",
      status: 0,
      code: "REQUEST_SETUP_ERROR",
    };
  }

  // Non-axios error
  if (error instanceof Error) {
    return {
      message: error.message || "An unexpected error occurred",
      status: 0,
      code: "UNKNOWN_ERROR",
    };
  }

  return {
    message: "An unexpected error occurred",
    status: 0,
    code: "UNKNOWN_ERROR",
  };
};

/**
 * Get user-friendly error message based on error code/status
 */
export const getErrorMessage = (error: ApiError): string => {
  const errorMessages: Record<string, string> = {
    // 4xx Client Errors
    "400": "Invalid request. Please check your input.",
    "401": "You are not authenticated. Please log in.",
    "403": "You do not have permission to perform this action.",
    "404": "The requested resource was not found.",
    "409": "This resource already exists.",
    "422": "Validation failed. Please check your input.",
    "429": "Too many requests. Please try again later.",

    // 5xx Server Errors
    "500": "Server error. Please try again later.",
    "502": "Bad gateway. Please try again later.",
    "503": "Service unavailable. Please try again later.",
    "504": "Gateway timeout. Please try again later.",

    // Network Errors
    NO_RESPONSE:
      "Unable to reach the server. Please check your internet connection.",
    REQUEST_SETUP_ERROR: "Error setting up request. Please try again.",
    UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",

    // Timeout
    ECONNABORTED: "Request timeout. Please try again.",
    ETIMEDOUT: "Connection timeout. Please try again.",
  };

  return (
    errorMessages[error.code || error.status.toString()] ||
    error.message ||
    "An unexpected error occurred"
  );
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error: ApiError): boolean => {
  // Retry on 5xx errors and network errors
  if (error.status >= 500) return true;
  if (error.status === 0) return true; // Network error

  // Don't retry on client errors (4xx)
  return false;
};

/**
 * Log error with context (development only)
 */
export const logError = (
  context: string,
  error: ApiError,
  additionalData?: Record<string, any>
): void => {
  if (process.env.NODE_ENV === "development") {
    console.error(`[${context}]`, {
      message: error.message,
      status: error.status,
      code: error.code,
      details: error.details,
      ...additionalData,
    });
  }
};

/**
 * Toast notification helper (integrate with your toast library)
 */
export const showErrorToast = (error: ApiError): void => {
  const message = getErrorMessage(error);
  // TODO: Integrate with your toast notification library (react-hot-toast, sonner, etc.)
  console.error("Toast Error:", message);
};

/**
 * Check if error is network related
 */
export const isNetworkError = (error: ApiError): boolean => {
  return (
    error.status === 0 ||
    error.code === "NO_RESPONSE" ||
    error.code === "ECONNABORTED" ||
    error.code === "ETIMEDOUT"
  );
};

/**
 * Check if error is authentication related
 */
export const isAuthError = (error: ApiError): boolean => {
  return error.status === 401 || error.status === 403;
};
