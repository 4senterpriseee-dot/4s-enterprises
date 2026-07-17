import axios from "axios";

const productApi = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});

export async function createProduct(formData) {
  const response = await productApi.post("/", formData);
  return response.data;
}

export async function getSellerProducts() {
  const response = await productApi.get("/seller");
  return response.data;
}

export async function getAllProducts({ q } = {}) {
  const params = new URLSearchParams();
  if (q) params.append("q", q);

  const query = params.toString();
  const response = await productApi.get(query ? `/?${query}` : "/");
  return response.data;
}

export async function getProductDetails(productId) {
  const response = await productApi.get(`/detail/${productId}`);
  return response.data;
}

export async function addProductVariant(productId, newProductVariant) {
  const formData = new FormData();

  newProductVariant.images.forEach((img) => {
  if (img instanceof File) {
    formData.append("images", img);
  } else if (img?.file) {
    formData.append("images", img.file);
  }
});

  formData.append("priceCurrency", newProductVariant.price.currency);
  formData.append("stock", String(newProductVariant.stock));
  formData.append("priceAmount", String(newProductVariant.price.amount));
  formData.append("attributes", JSON.stringify(newProductVariant.attributes));

  const response = await productApi.post(`/${productId}/variants`, formData);

  return response.data;
}

export async function searchProducts(query, category) {
  const params = new URLSearchParams({ q: query });

  if (category) {
    params.set("category", category);
  }

  const response = await productApi.get(`/search?${params.toString()}`);
  return response.data;
}

export async function updateProduct(productId, formData) {
  const response = await productApi.patch(`/${productId}`, formData);
  return response.data;
}

export async function removeProductImage(productId, fileId) {
  const response = await productApi.delete(`/${productId}/image`, {
    data: { fileId }
  });
  return response.data;
}

export async function updateVariant(productId, variantId, payload) {
  const response = await productApi.patch(`/${productId}/variant/${variantId}`, payload);
  return response.data;
}

export async function deleteVariant(productId, variantId) {
  const response = await productApi.delete(`/${productId}/variant/${variantId}`);
  return response.data;
}
