/**
 * useFavorite hook
 * Wraps the toggleFavorite endpoint with React Query mutation.
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import { getFavorites, toggleFavorite } from "../endpoints/favorites";

export const useFavorites = () => {
  const isAuthenticated =
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false;

  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
};

export const useToggleFavorite = () => {
  return useMutation({
    mutationFn: (productId: string) => toggleFavorite(productId),
  });
};
