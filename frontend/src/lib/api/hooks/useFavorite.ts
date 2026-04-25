/**
 * useFavorite hook
 * Wraps the toggleFavorite endpoint with React Query mutation.
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import { getFavorites, toggleFavorite } from "../endpoints/favorites";

export const useFavorites = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });
};

export const useToggleFavorite = () => {
  return useMutation({
    mutationFn: (productId: string) => toggleFavorite(productId),
  });
};
