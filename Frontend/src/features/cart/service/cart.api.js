import axios from "axios";

const cartApi = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});

export async function getCartItems() {
  const response = await cartApi.get("/");
  return response.data;
}

export async function addToCart({ productId, variantId, quantity = 1, size }) {
  const response = await cartApi.post(`/add`, {
    productId,
    variantId,
    size: size || null,
    quantity,
  });
  return response.data;
}

export async function updateCartItemQuantity({ itemId, quantity }) {
  const response = await cartApi.patch("/item", {
    itemId,
    quantity,
  });

  return response.data;
}

export async function removeCartItem({ itemId }) {
  const response = await cartApi.delete("/item", {
    data: { itemId },
  });

  return response.data;
}

export async function createPaymentOrder() {
  const response = await cartApi.post("/payment/create/order");

  return response.data;
}

export async function verifyPaymentOrder({
  orderId,
  paymentId,
  signature,
  dbPaymentId,
}) {
  const response = await cartApi.post("/payment/verify/order", {
    orderId,
    paymentId,
    signature,
    dbPaymentId,
  });

  return response.data;
}

export async function getPaymentByOrderId(orderId) {
  const response = await cartApi.get(`/payment/${orderId}`);
  return response.data;
}

export async function getUserOrders() {
  const response = await cartApi.get("/payment/user");
  return response.data;
}
