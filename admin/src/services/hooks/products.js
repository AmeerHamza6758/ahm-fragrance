
import {productsApi} from '../endpoints'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const PRODUCTS_KEY = "products";

// get getting all products
export function useGetProducts() {
  return useQuery({
    queryKey: [PRODUCTS_KEY],
    queryFn: productsApi.list,
  });
}

// 2. for adding product
export function useAddProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => productsApi.create(payload),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
    },
  });
}

//  for delete product
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productsApi.remove(id),
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
    },
  });
}


// for update product
export function useUpdateProduct(){
 return useMutation({
    // Yahan hum id aur data receive kar rahy hain
    mutationFn: ({ id, data }) => productsApi.update(id, data), 
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      alert("Product update done !");
    },
    onError: (error) => {
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
