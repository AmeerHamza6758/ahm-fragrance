import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../endpoints";

export const USERS_KEY = "users";

export function useGetUsers(page = 1, limit = 10) {
  return useQuery({
    queryKey: [USERS_KEY, page, limit],
    queryFn: () => userApi.list({ page, limit }),
  });
}

export function useGetUserById(id) {
  return useQuery({
    queryKey: [USERS_KEY, id],
    queryFn: () => userApi.getById(id),
    enabled: !!id,
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => userApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}
