import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCart } from "../hooks/useCart";
import Layout from "@/components/layout/Layout";
import CartList from "@/features/cart/components/CartList";
import CartSummary from "@/features/cart/components/CartSummary";
import toast from "react-hot-toast";
import { useRazorpay } from "react-razorpay";
import { useNavigate } from "react-router";
import { setItems, setSubtotal } from "../state/cart.slice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const { error, isLoading, Razorpay } = useRazorpay();
  const {
    handleGetCart,
    handleRemoveFromCart,
    handleUpdateCartQuantity,
    handleCreatePaymentOrder,
    handleVerifyPaymentOrder,
  } = useCart();

  async function handleCheckout() {
    try {
      if (!Razorpay) {
        toast.error("Payment SDK not loaded");
        return;
      }

      const data = await handleCreatePaymentOrder();

      const order = data.order;
      const dbPaymentId = data.paymentId;

      if (!order?.amount) {
        console.error("Invalid order:", data);
        toast.error("Payment init failed");
        return;
      }

      const options = {
        key: "rzp_test_SjOOD4SfcQ88sp",
        amount: order.amount,
        currency: order.currency,
        name: "4senterprises",
        description: "Test Transaction",
        order_id: order.id,
        handler: async (response) => {
          try {
            await handleVerifyPaymentOrder({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              dbPaymentId,
            });


            dispatch(setItems([]));
            dispatch(setSubtotal(0));

            toast.success("Payment successful");
            navigate(`/order-success/${order.id}`);
          } catch {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user?.fullName,
          email: user?.email,
          contact: user?.contact,
        },
        theme: {
          color: `var(--secondary)`,
        },
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create payment order");
    }
  }

  useEffect(() => {
    handleGetCart().catch(() => {
      toast.error("Failed to load cart");
    });
  }, []);

  const handleIncrease = async (item) => {
    try {
      await handleUpdateCartQuantity({
        itemId: item._id,
        quantity: item.quantity + 1,
      });
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity === 1) {
      try {
        await handleRemoveFromCart({ itemId: item._id });
      } catch {
        toast.error("Failed to remove item");
      }
      return;
    }

    try {
      await handleUpdateCartQuantity({
        itemId: item._id,
        quantity: item.quantity - 1,
      });
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (item) => {
    try {
      await handleRemoveFromCart({ itemId: item._id });
    } catch {
      toast.error("Failed to remove item");
    }
  };

  return (
    <Layout>
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <p className="mb-2 text-xs text-[var(--text-muted)]">
          Home / Shopping cart
        </p>
        <h1 className="mb-6 text-xl font-bold text-(--text)">Shopping cart</h1>

        <CartList
          items={items}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
        />

        {items.length > 0 && <CartSummary razorpay={handleCheckout} />}
      </section>
    </Layout>
  );
};

export default Cart;
