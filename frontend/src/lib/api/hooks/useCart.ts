import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCart, getCart, removeFromCartApi, createOrder, CreateOrderPayload, addRatingReview, RatingReviewPayload, getAllReviews } from "../endpoints";

export function useGetCart() {
  const isAuthenticated =
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false;
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuthenticated,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromCartApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useAddRatingReview() {
  return useMutation({
    mutationFn: (payload: RatingReviewPayload) => addRatingReview(payload),
  });
}

export function useGetAllReviews() {
  return useQuery({
    queryKey: ["all-reviews"],
    queryFn: getAllReviews,
    staleTime: 5 * 60 * 1000,
  });
}

