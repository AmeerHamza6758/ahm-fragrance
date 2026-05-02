import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { faqApi } from "../endpoints";
import { successToaster, errorToaster } from "../../utils/alert-service";

export const FAQ_KEY = "faqs";

export function useGetFaqs() {
  return useQuery({
    queryKey: [FAQ_KEY],
    queryFn: () => faqApi.list(),
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => faqApi.create(payload),
    onSuccess: () => {
      successToaster("FAQ created successfully");
      queryClient.invalidateQueries({ queryKey: [FAQ_KEY] });
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to create FAQ");
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => faqApi.update(id, data),
    onSuccess: () => {
      successToaster("FAQ updated successfully");
      queryClient.invalidateQueries({ queryKey: [FAQ_KEY] });
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to update FAQ");
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => faqApi.remove(id),
    onSuccess: () => {
      successToaster("FAQ deleted successfully");
      queryClient.invalidateQueries({ queryKey: [FAQ_KEY] });
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to delete FAQ");
    },
  });
}
