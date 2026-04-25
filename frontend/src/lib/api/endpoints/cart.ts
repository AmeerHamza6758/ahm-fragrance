import apiClient from "../client";

export async function addToCart({ productId, quantity }: { productId: string; quantity: number }) {
  const response = await apiClient.post("/api/cart/add", {
    productId,
    quantity: String(quantity),
  });
  return response.data;
}

export async function getCart() {
  const response = await apiClient.get("/api/cart");
  return response.data;
}

export async function removeFromCartApi(productId: string) {
  const response = await apiClient.delete(`/api/cart/remove/${productId}`);
  return response.data;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  customerInfo: CustomerInfo;
  agreedToTerms: boolean;
}

export async function createOrder(payload: CreateOrderPayload) {
  const response = await apiClient.post("/api/order/create", payload);
  return response.data;
}

export interface RatingReviewPayload {
  productId: string;
  rating: number;
  review: string;
}

export async function addRatingReview(payload: RatingReviewPayload) {
  const response = await apiClient.post("/api/rating-review/add", payload);
  return response.data;
}

export async function getAllReviews() {
  const response = await apiClient.get("/api/rating-review/all-reviews");
  return response.data;
}
