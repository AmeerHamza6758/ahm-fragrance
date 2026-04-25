/**
 * Main API Export
 * Central export point for all API functionality
 */

// Client and Query Client
export { default as apiClient } from "./client";
export { queryClient } from "./queryClient";

// Types
export type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
  Product,
  Cart,
  CartItem,
  Order,
  User,
  Address,
  Review,
  Wishlist,
  WishlistItem,
  ProductFilter,
  AuthCredentials,
  AuthResponse,
  CreateReviewInput,
} from "./types/api";

// Query Keys
export { queryKeys } from "./utils/queryKeys";

// Error Handling
export {
  handleApiError,
  getErrorMessage,
  isRetryableError,
  isNetworkError,
  isAuthError,
  logError,
} from "./utils/errorHandler";

// Endpoints
export * from "./endpoints";

// Hooks
export * from "./hooks";
