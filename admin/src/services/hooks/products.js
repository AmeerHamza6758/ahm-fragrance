
import {productsApi} from '../endpoints'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { successToaster, errorToaster } from '../../utils/alert-service';
const PRODUCTS_KEY = "products";

// get getting all products
export function useGetProducts(page = 1, limit = 10) {
  return useQuery({
    queryKey: [PRODUCTS_KEY, page, limit],
    queryFn: () => productsApi.list({ page, limit }),
  });
}

// 2. for adding product
export function useAddProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => productsApi.create(payload),
    onSuccess: (data) => {
      successToaster(data?.message || "Product added successfully");
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to add product");
    },
  });
}

//  for delete product
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productsApi.remove(id),
    onSuccess: (data) => {
       successToaster(data?.message || "Product deleted successfully");
       queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to delete product");
    },
  });
}


// for update product
export function useUpdateProduct(){
  const queryClient = useQueryClient();
 return useMutation({
    // Yahan hum id aur data receive kar rahy hain
    mutationFn: ({ id, data }) => productsApi.update(id, data), 
    onSuccess: (data) => { 
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      successToaster(data?.message || "Product updated successfully");
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to update product");
      console.error("Update Error:", error.response?.data || error.message);
    },
  });
}

// get by id

export function useGetProductById(productid){
  return useQuery({
    queryKey: [PRODUCTS_KEY, productid],
  queryFn: () => productsApi.getById(productid),
 enabled: !!productid,
  });
}

export function useGetStockByProductId(productId) {
  return useQuery({
    queryKey: ["stock", productId],
    queryFn: () => stockApi.get({ productId }),
    enabled: !!productId,
  });
}

export function useGetProductStats() {
  return useQuery({
    queryKey: [PRODUCTS_KEY, "stats"],
    queryFn: () => productsApi.getStats(),
  });
}
