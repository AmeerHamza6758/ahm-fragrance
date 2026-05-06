import http from "./http";

export const dashboardApi = {
  getStats: () => http.get("/api/dashboard/stats"),
  getGraphs: () => http.get("/api/dashboard/graphs"),
  getLedger: () => http.get("/api/dashboard/ledger"),
  getProducts: () => http.get("/api/product/getProducts"),
  getTotalProducts: () => http.get("/api/product/totalProducts"),
  getPendingOrders: () => http.get("/api/order/pendingOrders"),
  getLowStockCount: () => http.get("/api/stock/lowStockCount"),
  getOrdersSummary: () => http.get("/api/order/checkout"),
  getFaqCount: () => http.get("/api/faq/getAllFaq"),
};

export const productsApi = {
  list: (params) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return http.get(`/api/product/getProducts${query}`);
  },
  getById: (id) => http.get(`/api/product/getProductById?id=${id}`),
  create: (payload) => http.post("/api/product/addProduct", payload),
  update: (id, payload) => http.put(`/api/product/updateProduct?id=${id}`, payload),
  remove: (id) => http.delete(`/api/product/deleteProduct/${id}`),
  getStats: () => http.get("/api/product/stats"),
};


export const categoryApi = {
  list: () => http.get("/api/category/getCategory"),
  create: (payload) => http.post("/api/category/creatCategory", payload),
  update: (id, payload) => http.put(`/api/category/updateCategory?id=${id}`, payload),
  remove: (id) => http.delete(`/api/category/deleteCategory?id=${id}`),
};

export const brandApi = {
  list: () => http.get("/api/brand/getBrand"),
  create: (payload) => http.post("/api/brand/creatBrand", payload),
  update: (id, payload) => http.put(`/api/brand/updateBrand?id=${id}`, payload),
  remove: (id) => http.delete(`/api/brand/deleteBrand?id=${id}`),
};

export const orderApi = {
  list: (params) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return http.get(`/api/order/all${query}`);
  },
  getById: (id) => http.get(`/api/order/${id}`),
  create: (payload) => http.post("/api/order/create", payload),
  cancel: (orderId) => http.put(`/api/order/${orderId}/cancel`),
  updateStatus: (id, payload) => http.put(`/api/order/${id}/status`, payload),
};

export const stockApi = {
  get: (params) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return http.get(`/api/stock/get${query}`);
  },
  manage: (payload) => http.post("/api/stock/manage", payload),
};

export const faqApi = {
  list: () => http.get("/api/faq/getAllFaq"),
  create: (payload) => http.post("/api/faq/addFaq", payload),
  update: (id, payload) => http.put(`/api/faq/updateFaq/${id}`, payload),
  remove: (id) => http.delete(`/api/faq/deleteFaq/${id}`),
};

export const cmsApi = {
  get: (key) => http.get(`/api/cms/${key}`),
  update: (payload) => http.post('/api/cms/update', payload),
  listKeys: () => http.get('/api/cms/all/keys'),
};

export const tagApi = {
  list: () => http.get("/api/tag/getTags"),
  create: (payload) => http.post("/api/tag/createTag", payload),
  update: (id, payload) => http.put(`/api/tag/updateTag?id=${id}`, payload),
  remove: (id) => http.delete(`/api/tag/deleteTag?id=${id}`),
};

export const imageApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return http.post("/single", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const authApi = {
  login: (payload) => http.post("/api/auth/signIn", payload),
  updateProfile: (payload) => http.put("/api/auth/update-profile", payload),
  updatePassword: (payload) => http.put("/api/auth/update-password", payload),
};

export const userApi = {
  list: (params) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return http.get(`/api/auth/getAllUsers${query}`);
  },
  getById: (id) => http.get(`/api/auth/getUserById?id=${id}`),
  remove: (id) => http.delete(`/api/auth/deleteUser/${id}`),
};
export const contactApi = {
  list: (params) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return http.get(`/api/contact/all${query}`);
  },
  remove: (id) => http.delete(`/api/contact/delete?id=${id}`),
};
export const circleApi = {
  list: (params) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return http.get(`/api/circle/all${query}`);
  },
  remove: (id) => http.delete(`/api/circle/remove?id=${id}`),
};
