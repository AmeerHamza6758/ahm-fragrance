/**
 * React Query Key Factory
 * Centralized query key management for cache invalidation and organization
 * https://tanstack.com/query/latest/docs/react/important-defaults
 */

export const queryKeys = {
  // ============================================
  // Products
  // ============================================
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.products.lists(), { ...filters }] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.products.details(), id] as const,
    search: (query: string) =>
      [...queryKeys.products.all, "search", query] as const,
  },

  // ============================================
  // Cart
  // ============================================
  cart: {
    all: ["cart"] as const,
    details: () => [...queryKeys.cart.all, "detail"] as const,
  },

  // ============================================
  // Orders
  // ============================================
  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.orders.lists(), { ...filters }] as const,
    details: () => [...queryKeys.orders.all, "detail"] as const,
    detail: (id: string) =>
      [...queryKeys.orders.details(), id] as const,
  },

  // ============================================
  // User/Auth
  // ============================================
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
    profile: () => [...queryKeys.auth.all, "profile"] as const,
  },

  // ============================================
  // Wishlist
  // ============================================
  wishlist: {
    all: ["wishlist"] as const,
    details: () => [...queryKeys.wishlist.all, "detail"] as const,
  },

  // ============================================
  // Reviews
  // ============================================
  reviews: {
    all: ["reviews"] as const,
    lists: () => [...queryKeys.reviews.all, "list"] as const,
    list: (productId: string) =>
      [...queryKeys.reviews.lists(), productId] as const,
    details: () => [...queryKeys.reviews.all, "detail"] as const,
    detail: (id: string) =>
      [...queryKeys.reviews.details(), id] as const,
    product: (productId: string | number) =>
      [...queryKeys.reviews.all, "product", productId] as const,
  },

  // ============================================
  // Categories
  // ============================================
  categories: {
    all: ["categories"] as const,
  },

  // ============================================
  // Search & Filters
  // ============================================
  search: {
    all: ["search"] as const,
    queries: (query: string) =>
      [...queryKeys.search.all, "queries", query] as const,
  },
} as const;
