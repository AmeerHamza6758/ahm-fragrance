import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../endpoints";
import { successToaster, errorToaster } from "../../utils/alert-service";

export const CATEGORIES_KEY = "categories";

export function useGetCategories() {
  return useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: () => categoryApi.list(),
  });
}

export function useAddCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => categoryApi.create(payload),
    onSuccess: () => {
      successToaster("Category created successfully");
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to create category");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => categoryApi.update(id, data),
    onSuccess: () => {
      successToaster("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => categoryApi.remove(id),
    onSuccess: () => {
      successToaster("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to delete category");
    },
  });
}
