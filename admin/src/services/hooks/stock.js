import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stockApi } from "../endpoints";
import { successToaster, errorToaster } from "../../utils/alert-service";

export const STOCK_KEY = "stock";

export function useGetStock(page = 1, limit = 10, status = "") {
  return useQuery({
    queryKey: [STOCK_KEY, page, limit, status],
    queryFn: () => stockApi.get({ page, limit, status, getAll: true }),
  });
}

export function useManageStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => stockApi.manage(payload),
    onSuccess: (data) => {
      successToaster(data?.message || "Stock updated successfully");
      queryClient.invalidateQueries({ queryKey: [STOCK_KEY] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }); // Invalidate dashboard stats too
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to update stock");
    },
  });
}
