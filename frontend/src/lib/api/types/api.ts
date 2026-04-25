/**
 * API Types and Interfaces
 * Centralized type definitions for all API responses and requests
 */

// ============================================
// Generic API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, any>;
}

// ============================================
// Product Types
// ============================================

export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "price" | "rating" | "newest";
  order?: "asc" | "desc";
}

// ============================================
// Cart Types
// ============================================

export interface CartItem {
  productId: string | number;
  quantity: number;
  size?: string;
  price: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
}

// ============================================
// Order Types
// ============================================

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  deliveryAddress: Address;
  paymentMethod: "cod" | "card";
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postal: string;
  province: string;
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  addresses?: Address[];
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// ============================================
// Wishlist Types
// ============================================

export interface WishlistItem {
  productId: string | number;
  addedAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
}

// ============================================
// Review/Rating Types
// ============================================

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export interface CreateReviewInput {
  productId: string;
  rating: number;
  title: string;
  comment: string;
}

// ============================================
// Query Parameters
// ============================================

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  [key: string]: any;
}
