import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const MiniCart = ({ open, onClose }) => {
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);
  const subtotal = useSelector((state) => state.cart.subtotal);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[60] ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`absolute right-0 top-0 h-full w-[320px] bg-[var(--card)] p-4 flex flex-col justify-between border-l border-[var(--border)] shadow-xl transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="space-y-6">
          <p className="text-sm font-medium text-(--text)">Added to cart</p>

          {items.length ? (
            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              {items.map((item, index) => (
                <div key={item?._id || `item-${index}`} className="flex gap-3">
                  {item.product?.images?.[0]?.url ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product?.name || "Cart item"}
                      className="h-20 w-16 object-cover"
                    />
                  ) : (
                    <div className="h-20 w-16 bg-[var(--card-subtle)] text-[10px] text-[var(--text-muted)] flex items-center justify-center">
                      No image
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-(--text)">
                      {item.product?.name || "Product unavailable"}
                    </p>
                    {item.size && (
                      <p className="text-xs text-[var(--text-muted)]">
                        Size: {item.size}
                      </p>
                    )}
                    <p className="text-xs text-[var(--text-muted)]">
                      Qty: {item?.quantity || 0}
                    </p>
                    <p className="text-sm text-(--text)">
                      ₹{item?.currentPrice || item?.price?.amount || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">
              Your cart is empty.
            </p>
          )}
        </div>

        <div className="mt-10 border-t pt-6 space-y-3">
          <p className="flex justify-between text-sm text-(--text)">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </p>

          <Link
            to="/cart"
            onClick={onClose}
            className="block text-center border border-[var(--border)] py-2 text-sm text-(--text) hover:bg-[var(--card-subtle)] transition"
          >
            View cart
          </Link>

          <button
          onClick={()=> navigate("/cart")}
            type="button"
            className="w-full bg-[var(--primary-btn)] text-[var(--card)] py-2 text-sm"
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
};

export default MiniCart;
