/**
 * React Query Client Configuration
 * Centralized setup for all query client settings and defaults
 */

import {
  QueryClient,
  DefaultOptions,
//   QueryClientConfig,
} from "@tanstack/react-query";

/**
 * Default query options
 */
const queryConfig: DefaultOptions = {
  queries: {
    // Stale time: 5 minutes (data is considered fresh for 5 min)
    staleTime: 5 * 60 * 1000,

    // Cache time: 10 minutes (data in cache for 10 min before garbage collection)
    gcTime: 10 * 60 * 1000,

    // Retry configuration
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors except 408 and 429
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        if (error?.response?.status === 408 || error?.response?.status === 429) {
          return failureCount < 3;
        }
        return false;
      }
      // Retry up to 3 times on 5xx or network errors
      return failureCount < 3;
    },

    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Throw error instead of returning error state
    throwOnError: false,

    // Refetch on window focus
    refetchOnWindowFocus: true,

    // Refetch on mount
    refetchOnMount: true,

    // Refetch on reconnect
    refetchOnReconnect: true,
  },

  mutations: {
    // Retry configuration for mutations
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    throwOnError: false,
  },
};

/**
 * Create and configure the query client
 */
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

export default queryClient;
