import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const CartSummary = ({ razorpay }) => {
  const navigate = useNavigate();
  const subtotal = useSelector((state) => state.cart.subtotal);

  return (
    <div className="mt-8 pt-6 space-y-4">
      <div className="flex justify-end text-xl gap-2">
        <p className="text-[var(--text)] font-semibold">Subtotal :</p>
        <p className="text-[var(--text)]">₹{subtotal}</p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-1/2 border border-[var(--border)] py-3 text-sm text-[var(--text)] hover:bg-[var(--card-subtle)] transition"
        >
          Continue shopping
        </button>

        <button
          type="button"
          onClick={razorpay}
          className="w-1/2 bg-[var(--primary-btn)] py-3 text-sm text-[var(--card)]"
        >
          Checkout
        </button>
      </div>

      <p className="text-center text-xs text-[var(--text-muted)]">
        Taxes and shipping calculated at checkout
      </p>
    </div>
  );
};

export default CartSummary;
