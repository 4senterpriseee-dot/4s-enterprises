import { Trash2 } from "lucide-react";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const imageUrl = item.product?.images?.[0]?.url;
  const name = item.product?.name || "Product unavailable";
  const originalPrice = Number(item.price?.amount) || 0;
  const currentPrice = Number(item.currentPrice) || originalPrice;
  const hasDiscount = originalPrice > 0 && currentPrice < originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;
  const total = currentPrice * (Number(item.quantity) || 0);
  const size = item.size;

  const ProductImage = ({ className }) =>
    imageUrl ? (
      <img src={imageUrl} alt={name || "Cart product"} className={className} />
    ) : (
      <div
        className={`${className} flex items-center justify-center bg-[var(--card-subtle)] text-[10px] text-[var(--text-muted)]`}
      >
        No image
      </div>
    );

  const QtyControls = () => (
    <div className="flex items-center border border-[var(--border)]">
      <button
        type="button"
        onClick={() => onDecrease(item)}
        className="px-3 py-1 text-sm hover:bg-[var(--card-subtle)] transition"
      >
        -
      </button>
      <span className="px-3 text-sm">{item.quantity || 0}</span>
      <button
        type="button"
        onClick={() => onIncrease(item)}
        className="px-3 py-1 text-sm hover:bg-[var(--card-subtle)] transition"
      >
        +
      </button>
    </div>
  );

  return (
    <div className="border-b border-[var(--border)] py-6">
      {/* ── MOBILE LAYOUT ── */}
      <div className="flex gap-4 md:hidden">
        <ProductImage className="w-20 h-24 object-cover shrink-0" />

        <div className="flex-1 flex flex-col justify-between">
          {/* Name + remove */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-base font-medium leading-tight text-(--text)">
                {name}
              </p>
              {size && (
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Size: {size}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="text-red-500 hover:opacity-80 transition shrink-0"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Price · Qty · Total — single row */}
          {/* Price · Qty · Total */}
          <div className="flex items-center justify-between mt-3">
            {/* Price */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-(--text)">
                  ₹{currentPrice}
                </span>

                {hasDiscount && (
                  <span className="text-xs line-through text-[var(--text-muted)]">
                    ₹{originalPrice}
                  </span>
                )}
              </div>

              {hasDiscount && (
                <span className="text-xs text-green-600 font-medium">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Qty */}
            <QtyControls />

            {/* Total */}
            <p className="text-sm font-medium text-(--text)">₹{total}</p>
          </div>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:flex md:items-center md:justify-between gap-6">
        {/* Left — image + info */}
        <div className="flex gap-4">
          <ProductImage className="w-20 h-24 object-cover shrink-0" />
          <div className="space-y-1">
            <p className="text-base font-medium leading-tight text-(--text)">
              {name}
            </p>
            {size && (
              <p className="text-xs text-[var(--text-muted)]">Size: {size}</p>
            )}
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="text-red-500 hover:opacity-80 transition mt-1"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Right — price / qty / total */}
        <div className="flex items-center gap-8">
          {/* Price block */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-(--text)">
                ₹{currentPrice}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-xs line-through text-[var(--text-muted)]">
                    ₹{originalPrice}
                  </span>
                  <span className="text-xs text-green-600 font-medium">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Qty */}
          <QtyControls />

          {/* Total */}
          <p className="w-20 text-right text-sm font-medium text-(--text)">
            ₹{total}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
