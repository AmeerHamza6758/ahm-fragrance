import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { circleApi } from "../endpoints";
import { successToaster, errorToaster } from "../../utils/alert-service";

export const CIRCLE_KEY = "circle";

export function useGetCircleMembers() {
  return useQuery({
    queryKey: [CIRCLE_KEY],
    queryFn: () => circleApi.list(),
  });
}

export function useRemoveCircleMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => circleApi.remove(id),
    onSuccess: (data) => {
      successToaster(data?.message || "Member removed successfully");
      queryClient.invalidateQueries({ queryKey: [CIRCLE_KEY] });
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to remove member");
    },
  });
}
