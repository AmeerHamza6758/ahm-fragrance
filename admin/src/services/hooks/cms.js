import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsApi } from "../endpoints";
import { successToaster, errorToaster } from "../../utils/alert-service";

export const CMS_KEY = "cms";

export function useGetCMSContent(key) {
  return useQuery({
    queryKey: [CMS_KEY, key],
    queryFn: () => cmsApi.get(key),
    enabled: !!key
  });
}

export function useUpdateCMSContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => cmsApi.update(payload),
    onSuccess: (data) => {
      successToaster(data?.message || "Content updated successfully");
      queryClient.invalidateQueries({ queryKey: [CMS_KEY] });
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to update content");
    },
  });
}

export function useGetCMSKeys() {
  return useQuery({
    queryKey: [CMS_KEY, 'keys'],
    queryFn: () => cmsApi.listKeys(),
  });
}
