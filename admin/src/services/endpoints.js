import http from "./http";

export const dashboardApi = {
  getProducts: () => http.get("/api/product/getProducts"),
  getTotalProducts: () => http.get("/api/product/totalProducts"),
  getPendingOrders: () => http.get("/api/order/pendingOrders"),
  getLowStockCount: () => http.get("/api/stock/lowStockCount"),
  getOrdersSummary: () => http.get("/api/order/checkout"),
  getFaqCount: () => http.get("/api/faq/getAllFaq"),
};

export const productsApi = {
  list: () => http.get("/api/product/getProducts"),
  getById: (id) => http.get(`/api/product/getProductById?id=${id}`),
  create: (payload) => http.post("/api/product/addProduct", payload),
  update: (payload) => http.put("/api/product/updateProduct", payload),
  remove: (id) => http.delete(`/api/product/deleteProduct/${id}`),
};

export const categoryApi = {
  list: () => http.get("/api/category/getCategory"),
  create: (payload) => http.post("/api/category/creatCategory", payload),
  update: (payload) => http.put("/api/category/updateCategory", payload),
  remove: (payload) => http.delete("/api/category/deleteCategory", { data: payload }),
};

export const brandApi = {
  list: () => http.get("/api/brand/getBrand"),
  create: (payload) => http.post("/api/brand/creatBrand", payload),
  update: (payload) => http.put("/api/brand/updateBrand", payload),
  remove: (payload) => http.delete("/api/brand/deleteBrand", { data: payload }),
};

export const orderApi = {
  create: (payload) => http.post("/api/order/create", payload),
  cancel: (orderId) => http.put(`/api/order/${orderId}/cancel`),
};

export const stockApi = {
  get: () => http.get("/api/stock/get"),
  manage: (payload) => http.post("/api/stock/manage", payload),
};

export const faqApi = {
  list: () => http.get("/api/faq/getAllFaq"),
  create: (payload) => http.post("/api/faq/addFaq", payload),
  update: (id, payload) => http.put(`/api/faq/updateFaq?id=${id}`, payload),
  remove: (id) => http.delete(`/api/faq/deleteFaq/${id}`),
};
