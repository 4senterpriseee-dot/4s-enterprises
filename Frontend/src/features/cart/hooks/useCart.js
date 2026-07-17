import {
  addToCart,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
  createPaymentOrder,
  verifyPaymentOrder,
} from "../service/cart.api";
import { useDispatch } from "react-redux";
import { setItems, setSubtotal } from "../state/cart.slice";

export const useCart = () => {
  const dispatch = useDispatch();

  const syncCartState = (data) => {
    dispatch(setItems(data?.cart?.items || []));
    dispatch(setSubtotal(Number(data?.subtotal) || 0));
  };

  const validateAddToCartInput = ({
    productId,
    quantity,
    size,
    requiresSize,
  }) => {
    if (!productId) {
      throw new Error("Product is required");
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      throw new Error("Quantity must be at least 1");
    }

    if (requiresSize && !size) {
      throw new Error("Select size");
    }

    return parsedQuantity;
  };

  const handleAddToCart = async ({
    productId,
    variantId,
    quantity = 1,
    size,
    requiresSize = false,
  }) => {
    try {
      const parsedQuantity = validateAddToCartInput({
        productId,
        quantity,
        size,
        requiresSize,
      });

      const data = await addToCart({
        productId,
        variantId,
        quantity: parsedQuantity,
        size,
      });

      syncCartState(data);

      return data;
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      throw error;
    }
  };

  const handleGetCart = async () => {
    try {
      const data = await getCartItems();
      syncCartState(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      throw error;
    }
  };

  const handleUpdateCartQuantity = async ({ itemId, quantity }) => {
    try {
      const data = await updateCartItemQuantity({ itemId, quantity });
      syncCartState(data);

      return data;
    } catch (error) {
      console.error("Failed to update cart item quantity:", error);
      throw error;
    }
  };

  const handleRemoveFromCart = async ({ itemId }) => {
    try {
      const data = await removeCartItem({ itemId });
      syncCartState(data);

      return data;
    } catch (error) {
      console.error("Failed to remove cart item:", error);
      throw error;
    }
  };

  const handleCreatePaymentOrder = async () => {
    try {
      const data = await createPaymentOrder();
      return data;
    } catch (error) {
      console.error("Failed to create payment order:", error);
      throw error;
    }
  };

  const handleVerifyPaymentOrder = async ({
    orderId,
    paymentId,
    signature,
    dbPaymentId,
  }) => {
    try {
      const data = await verifyPaymentOrder({
        orderId,
        paymentId,
        signature,
        dbPaymentId,
      });
      return data;
    } catch (error) {
      console.error("Failed to verify payment order:", error);
      throw error;
    }
  };

  return {
    handleAddToCart,
    handleGetCart,
    handleUpdateCartQuantity,
    handleRemoveFromCart,
    handleCreatePaymentOrder,
    handleVerifyPaymentOrder,
  };
};
