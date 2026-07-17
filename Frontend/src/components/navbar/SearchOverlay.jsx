import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router";

/**
 * Full-screen search overlay (desktop-first).
 * All search state is owned by the parent Navbar and passed as props.
 */
const SearchOverlay = ({
  open,
  query,
  results,
  searching,
  inputRef,
  onQueryChange,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-[var(--card)] z-50"
      onClick={onClose}
    >
      <div
        className="h-full flex flex-col items-center justify-center gap-6 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-6 right-6 text-(--text)"
          onClick={onClose}
          aria-label="Close search"
        >
          <X size={20} />
        </button>

        {/* Search input */}
        <div className="w-full max-w-xl relative">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search for products..."
            className="w-full border-b border-[var(--border)] bg-transparent text-xl outline-none placeholder:text-[var(--text-muted)] text-(--text) pb-2"
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                navigate(`/products?q=${encodeURIComponent(query.trim())}`);
                onClose();
              }
            }}
          />
        </div>

        {/* Results */}
        {query.trim() && (
          <div className="w-full max-w-xl border border-[var(--border)] bg-[var(--card)] shadow-lg">
            {searching && (
              <p className="px-4 py-3 text-sm text-[var(--text-muted)]">
                Searching...
              </p>
            )}

            {!searching && results.length === 0 && (
              <p className="px-4 py-3 text-sm text-[var(--text-muted)]">
                No results for &ldquo;{query}&rdquo;
              </p>
            )}

            {!searching &&
              results.map((product) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => {
                    navigate(`/product/${product._id}`);
                    onClose();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[var(--card-subtle)] transition border-b border-[var(--border)] last:border-0"
                >
                  {product.images?.[0]?.url && (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="h-10 w-8 object-cover shrink-0"
                    />
                  )}
                  <div>
                    <p className="text-sm text-(--text)">{product.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      ₹{product.price?.amount}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
