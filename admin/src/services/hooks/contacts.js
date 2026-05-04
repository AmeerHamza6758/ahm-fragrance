import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactApi } from "../endpoints";
import { successToaster, errorToaster } from "../../utils/alert-service";

export const CONTACTS_KEY = "contacts";

export function useGetContacts() {
  return useQuery({
    queryKey: [CONTACTS_KEY],
    queryFn: () => contactApi.list(),
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => contactApi.remove(id),
    onSuccess: (data) => {
      successToaster(data?.message || "Message deleted successfully");
      queryClient.invalidateQueries({ queryKey: [CONTACTS_KEY] });
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to delete message");
    },
  });
}
