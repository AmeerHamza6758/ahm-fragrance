import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagApi } from "../endpoints";
import { successToaster, errorToaster } from "../../utils/alert-service";

export const TAGS_KEY = "tags";

export function useGetTags() {
  return useQuery({
    queryKey: [TAGS_KEY],
    queryFn: () => tagApi.list(),
  });
}

export function useAddTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => tagApi.create(payload),
    onSuccess: (data) => {
      successToaster(data?.message || "Tag added successfully");
      queryClient.invalidateQueries({ queryKey: [TAGS_KEY] });
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to add tag");
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => tagApi.update(id, data),
    onSuccess: (data) => {
      successToaster(data?.message || "Tag updated successfully");
      queryClient.invalidateQueries({ queryKey: [TAGS_KEY] });
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to update tag");
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => tagApi.remove(id),
    onSuccess: (data) => {
      successToaster(data?.message || "Tag deleted successfully");
      queryClient.invalidateQueries({ queryKey: [TAGS_KEY] });
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to delete tag");
    },
  });
}
