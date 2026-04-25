/**
 * Favorites / Wishlist API Endpoints
 */

import apiClient from "../client";
import { Product } from "./products";

export interface GetFavoritesResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export interface ToggleFavoriteResponse {
  success: boolean;
  message: string;
  isFavorited: boolean;
  data?: unknown;
}

// Normalize server responses to always return a product array.
const normalizeFavoriteProducts = (payload: unknown): Product[] => {
  if (!payload) return [];

  if (Array.isArray(payload)) {
    return payload
      .map((item: any) => item?.product_id || item?.product || item)
      .filter(Boolean);
  }

  const responseData = (payload as any)?.data;
  if (Array.isArray(responseData)) {
    return responseData
      .map((item: any) => item?.product_id || item?.product || item)
      .filter(Boolean);
  }

  if (Array.isArray((payload as any)?.items)) {
    return (payload as any).items
      .map((item: any) => item?.product_id || item?.product || item)
      .filter(Boolean);
  }

  return [];
};

/**
 * GET /api/favorite/get
 * Returns wishlist/favorite products for logged-in user.
 */
export const getFavorites = async (): Promise<Product[]> => {
  const { data } = await apiClient.get<GetFavoritesResponse | Product[]>(
    "/api/favorite/get",
  );
  return normalizeFavoriteProducts(data);
};

/**
 * POST /api/favorite/toggle
 * Toggles a product in the user's favorites/wishlist.
 * Requires an authenticated user (token sent via Authorization header automatically).
 */
export const toggleFavorite = async (
  productId: string,
): Promise<ToggleFavoriteResponse> => {
  const { data } = await apiClient.post<ToggleFavoriteResponse>(
    "/api/favorite/toggle",
    { productId },
  );
  return data;
};
