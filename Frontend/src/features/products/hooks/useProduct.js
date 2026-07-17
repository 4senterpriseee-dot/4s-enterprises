import {
  createProduct,
  getSellerProducts,
  getAllProducts,
  getProductDetails,
  addProductVariant,
  updateProduct,
  updateVariant,
  deleteVariant,
  removeProductImage,
} from "../services/product.api";
import { useDispatch } from "react-redux";
import {
  setProduct,
  setAllProducts,
  setProductDetails,
} from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  async function handleCreateProduct(formData) {
    try {
      const data = await createProduct(formData);
      return data.product || data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async function handleGetSellerProducts() {
    try {
      const data = await getSellerProducts();
      dispatch(setProduct(data.products));

      return data.products;
    } catch (error) {
      console.error("Error fetching seller products:", error);
      throw error;
    }
  }

  async function handleGetAllProducts() {
    try {
      const data = await getAllProducts();
      dispatch(setAllProducts(data.products));

      return data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async function handleGetProductDetails(productId) {
    try {
      const data = await getProductDetails(productId);
      dispatch(setProductDetails(data.product));

      return data.product;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  }

  async function handleAddProductVariant(productId, newProductVariant) {
    try {
      const data = await addProductVariant(productId, newProductVariant);
      return data.variant;
    } catch (error) {
      console.error("Error adding product variant:", error);
      throw error;
    }
  }

  async function handleUpdateProduct(productId, formData) {
    try {
      const data = await updateProduct(productId, formData);
      return data.product;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async function handleUpdateVariant(productId, variantId, payload) {
    try {
      const data = await updateVariant(productId, variantId, payload);
      return data.variant;
    } catch (error) {
      console.error("Error updating product variant:", error);
      throw error;
    }
  }

  async function handleDeleteVariant(productId, variantId) {
    try {
      const data = await deleteVariant(productId, variantId);
      return data;
    } catch (error) {
      console.error("Error deleting product variant:", error);
      throw error;
    }
  }

  async function handleRemoveImage(productId, fileId) {
    try {
      const data = await removeProductImage(productId, fileId);
      return data.product;
    } catch (error) {
      console.error("Error removing product image:", error);
      throw error;
    }
  }

  return {
    handleCreateProduct,
    handleGetSellerProducts,
    handleGetAllProducts,
    handleGetProductDetails,
    handleAddProductVariant,
    handleUpdateProduct,
    handleUpdateVariant,
    handleDeleteVariant,
    handleRemoveImage,
  };
};
