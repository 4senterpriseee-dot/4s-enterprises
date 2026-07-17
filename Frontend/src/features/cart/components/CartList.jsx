import CartItem from "@/features/cart/components/CartItem";
import { useNavigate } from "react-router";

const CartList = ({ items, onIncrease, onDecrease, onRemove }) => {
  const navigate = useNavigate();

  if (!items?.length) {
    return (
      <div className="rounded border border-[var(--border)] bg-[var(--card)] p-6 text-center space-y-4">
        <p className="text-sm text-[var(--text-muted)]">Your cart is empty.</p>

        <button
          onClick={() => navigate("/")}
          className="border border-[var(--border)] px-5 py-2 text-sm text-[var(--text)] hover:bg-[var(--card-subtle)] transition"
        >
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Table header — desktop only */}
      <div className="hidden md:flex items-center justify-end border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-8 text-xs text-[var(--text-muted)]">
          <p className="w-16 text-center">Price</p>
          <p className="w-24 text-center">Qty</p>
          <p className="w-20 text-right">Total</p>
        </div>
      </div>

      {items.map((item, index) => (
        <CartItem
          key={item?._id || `item-${index}`}
          item={item}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default CartList;
