import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { NAV_ITEMS } from "@/app/nav.config";
import { searchProducts } from "@/features/products/services/product.api";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * Mobile slide-in drawer.
 * Owns its own search state so it works independently of the desktop overlay.
 */
const MobileDrawer = ({ open, onClose, user }) => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  /* ── Local mobile search state ── */
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  /* Debounced live search  */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchProducts(query.trim());
        setResults(data.products || []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  /* Reset search when drawer closes */
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const handleClose = () => {
    setQuery("");
    setResults([]);
    onClose();
  };

  const handleResultClick = (id) => {
    navigate(`/product/${id}`);
    handleClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          "fixed inset-0 z-40 bg-black/55 backdrop-blur-[3px] transition-opacity duration-300 md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={handleClose}
      />

      {/* Drawer panel */}
      <div
        className={[
          "fixed top-0 left-0 z-50 h-full w-[80%] max-w-sm bg-[var(--card)] p-5 shadow-xl transition-transform duration-300 ease-out will-change-transform md:hidden overflow-y-auto",
          open ? "translate-x-0" : "-translate-x-full pointer-events-none",
        ].join(" ")}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-medium">MENU</span>
          <button type="button" onClick={handleClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        {/* ── Mobile search input ── */}
        <div className="mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for..."
            className="w-full border-b pb-2 bg-transparent outline-none placeholder:text-[var(--text-muted)] text-(--text)"
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                navigate(`/products?q=${encodeURIComponent(query.trim())}`);
                handleClose();
              }
            }}
          />
        </div>

        {/* Live search results */}
        {query && (
          <div className="mb-6 space-y-1">
            {searching && (
              <p className="text-xs text-[var(--text-muted)] py-1">Searching...</p>
            )}

            {!searching && results.length === 0 && (
              <p className="text-sm text-[var(--text-muted)]">No results found</p>
            )}

            {!searching &&
              results.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => handleResultClick(p._id)}
                  className="flex items-center gap-2 w-full text-left py-2 border-b border-[var(--border)] last:border-0 hover:bg-[var(--card-subtle)] px-1 transition"
                >
                  {p.images?.[0]?.url && (
                    <img
                      src={p.images[0].url}
                      alt={p.name}
                      className="h-8 w-6 object-cover shrink-0"
                    />
                  )}
                  <div>
                    <p className="text-sm text-(--text)">{p.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      ₹{p.price?.amount}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        )}

        {/* Nav sections — only visible when not searching */}
        {!query && (
          <div className="space-y-8 text-base font-semibold">
            {/* Navigation links */}
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <Link
                  to="/cart"
                  className="text-(--text)"
                  onClick={handleClose}
                >
                  Cart
                </Link>
                {user?.role === "seller" && (
                  <Link
                    to="/seller/dashboard"
                    className="text-(--text)"
                    onClick={handleClose}
                  >
                    Dashboard
                  </Link>
                )}
                {user ? (
                  <>
                    <Link
                      to="/orders"
                      className="text-(--text)"
                      onClick={handleClose}
                    >
                      Orders
                    </Link>
                    <button
                      type="button"
                      className="text-left text-(--text)"
                      onClick={() => { handleClose(); handleLogout(navigate); }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="nav-link text-(--text)"
                      onClick={handleClose}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="nav-link text-(--text)"
                      onClick={handleClose}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileDrawer;
