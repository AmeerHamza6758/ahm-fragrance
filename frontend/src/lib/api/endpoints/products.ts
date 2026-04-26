/**
 * Products API Endpoints
 * Handles all product-related API calls
 */

import apiClient from "../client";

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
  rating?: "asc" | "desc";
  tag?: string;
  filter?: "him" | "her" | "unisex";
  category?: string;
  search?: string;
}

export interface ProductsPaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ProductsPaginatedResponse {
  status: number;
  data: Product[];
  pagination: ProductsPaginationMeta;
}

export interface GetProductsPaginatedParams {
  page?: number;
  limit?: number;
}

const buildProductsQuery = (
  filters?: ProductFilters,
  pagination?: GetProductsPaginatedParams,
) => {
  const params = new URLSearchParams();

  if (filters?.price) params.append("price", filters.price);
  if (filters?.rating) params.append("rating", filters.rating);
  if (filters?.tag) params.append("tag", filters.tag);
  if (filters?.filter) params.append("filter", filters.filter);
  if (filters?.category) {
    const normalizedCategory = filters.category.toLowerCase();
    if (normalizedCategory === "men") params.append("filter", "him");
    if (normalizedCategory === "women") params.append("filter", "her");
    if (normalizedCategory === "unisex") params.append("filter", "unisex");
  }
  if (pagination?.page) params.append("page", String(pagination.page));
  if (pagination?.limit) params.append("limit", String(pagination.limit));

  return params.toString();
};

// ─── Endpoints ────────────────────────────────────────────────────────────────

/**
 * GET /api/product/getProducts
 * Supports filters: ?price=asc|desc, ?tag=inspired, ?category=women
 */
export const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  try {
    const query = buildProductsQuery(filters);
    const url = `/api/product/getProducts${query ? `?${query}` : ""}`;

    console.log("[API] Fetching products from:", url);
    
    const { data } = await apiClient.get<Product[]>(url);
    
    console.log("[API] Products response:", data);
    
    // Handle different response formats
    if (Array.isArray(data)) return data;
    if (Array.isArray((data as any)?.data)) {
      return (data as any).data as Product[];
    }
    return [];
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

export const getProductsPaginated = async (
  filters?: ProductFilters,
  pagination: GetProductsPaginatedParams = { page: 1, limit: 50 },
): Promise<ProductsPaginatedResponse> => {
  const page = pagination.page ?? 1;
  const limit = Math.min(pagination.limit ?? 50, 50);
  const query = buildProductsQuery(filters, { page, limit });
  const url = `/api/product/getProducts${query ? `?${query}` : ""}`;
  const { data } = await apiClient.get<ProductsPaginatedResponse | Product[]>(url);

  if (Array.isArray(data)) {
    const totalItems = data.length;
    return {
      status: 1,
      data,
      pagination: {
        page: 1,
        limit: totalItems || limit,
        totalItems,
        totalPages: 1,
        hasMore: false,
      },
    };
  }

  return data;
};

/**
 * GET /api/product/getProducts/:id
 */
export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await apiClient.get<Product>(`/api/product/getProductById?id=${id}`);
  return data;
};
