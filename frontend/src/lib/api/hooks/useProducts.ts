/**
 * useProducts Hook
 * React Query hooks for all product-related API calls
 */

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  getProductsPaginated,
  ProductFilters,
} from "../endpoints/products";

const PRODUCTS_KEY = "products";

/**
 * Fetch all products with optional filters
 * Supports: price sort (asc/desc), tag filter, category filter
 */
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: [PRODUCTS_KEY, filters ?? {}],
    queryFn: () => getProducts(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch a single product by ID
 */
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: [PRODUCTS_KEY, id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfiniteProducts = (
  filters?: ProductFilters,
  pageSize: number = 50,
) => {
  return useInfiniteQuery({
    queryKey: [PRODUCTS_KEY, "infinite", filters ?? {}, pageSize],
    queryFn: ({ pageParam }) =>
      getProductsPaginated(filters, {
        page: Number(pageParam),
        limit: pageSize,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    staleTime: 5 * 60 * 1000,
  });
};
