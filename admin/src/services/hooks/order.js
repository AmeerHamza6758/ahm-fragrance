import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../endpoints";
import { successToaster, errorToaster } from "../../utils/alert-service";

export const ORDERS_KEY = "orders";

export function useGetOrders(page = 1, limit = 10, status = "") {
  return useQuery({
    queryKey: [ORDERS_KEY, page, limit, status],
    queryFn: () => orderApi.list({ page, limit, status }),
  });
}

export function useGetOrderById(id) {
  return useQuery({
    queryKey: [ORDERS_KEY, id],
    queryFn: () => orderApi.getById(id),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, paymentStatus }) => orderApi.updateStatus(id, { status, paymentStatus }),
    onSuccess: (data) => {
      successToaster(data?.message || "Order status updated successfully");
      queryClient.invalidateQueries({ queryKey: [ORDERS_KEY] });
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to update order status");
    },
  });
}
