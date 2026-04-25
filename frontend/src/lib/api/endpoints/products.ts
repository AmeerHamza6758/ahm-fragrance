/**
 * Products API Endpoints
 * Handles all product-related API calls
 */

import apiClient from "../client";
import { ApiResponse } from "../types/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductImage {
  _id: string;
  path: string;
  filename: string;
}

export interface ProductBrand {
  _id: string;
  brandName: string;
}

export interface ProductCategory {
  _id: string;
  name: string;
}

export interface ProductTag {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  discountPercentage: number;
  description: string;
  brand_id: ProductBrand;
  category_id: ProductCategory;
  image_id: ProductImage;
  tag_id: ProductTag;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  price?: "asc" | "desc";
  tag?: string;
  category?: string;
  search?: string;
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

/**
 * GET /api/product/getProducts
 * Supports filters: ?price=asc|desc, ?tag=inspired, ?category=women
 */
export const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  try {
    const params = new URLSearchParams();

    if (filters?.price) params.append("price", filters.price);
    if (filters?.tag) params.append("tag", filters.tag);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);

    const query = params.toString();
    const url = `/api/product/getProducts${query ? `?${query}` : ""}`;

    console.log("[API] Fetching products from:", url);
    
    const { data } = await apiClient.get<Product[]>(url);
    
    console.log("[API] Products response:", data);
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    }
    
    return data;
  } catch (error: any) {
    console.error("[API] Error fetching products:", {
      message: error?.message,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      url: error?.config?.url,
    });
    throw error;
  }
};

/**
 * GET /api/product/getProducts/:id
 */
export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await apiClient.get<Product>(`/api/product/getProductById?id=${id}`);
  return data;
};
