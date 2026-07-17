import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";

const Footer = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <footer className="mt-20 bg-[var(--footer-bg,#0f0f0f)] text-[var(--footer-text,#d4d4d4)]">
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">

        {/* Logo & Tagline */}
        <div className="col-span-2 sm:col-span-1 space-y-4">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-white">4senterprises</p>
            <p className="text-xs text-[var(--text-muted)]">
              Your Trusted Corporate Gifting Partner.
            </p>
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search products..."
            className="w-full max-w-xs border-b border-[var(--border)] pb-2 bg-transparent outline-none placeholder:text-[var(--text-muted)] text-white text-sm focus:border-white transition-colors"
          />
        </div>

        {/* Links: Shop */}
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 font-semibold text-white">Shop</h3>
          <Link to="/products" className="hover:text-white transition-colors duration-200">All Products</Link>
        </div>

        {/* Links: Account */}
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 font-semibold text-white">Account</h3>
          <Link to="/orders" className="hover:text-white transition-colors duration-200">Orders</Link>
          <Link to="/cart" className="hover:text-white transition-colors duration-200">Cart</Link>
          {user?.role === "seller" && (
            <Link to="/seller/dashboard" className="hover:text-white transition-colors duration-200">Dashboard</Link>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 mt-8 pt-4 pb-6 text-center text-xs text-[var(--text-muted)]">
        © 2026 4senterprises
      </div>
    </footer>
  );
};

export default Footer;