import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAllProducts } from "@/features/products/services/product.api";
import ProductCard from "@/features/products/components/ProductCard";

/**
 * RelatedProducts
 *
 * Props:
 *   currentProductId  – string  – exclude this product from the list
 *   category          – string? – optionally filter by same category
 *   limit             – number  – max products to show (default 6)
 */
const RelatedProducts = ({ currentProductId, category, limit = 6 }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentProductId) return;

    let cancelled = false;
    setLoading(true);

   getAllProducts(category ? { category } : {})
  .then((data) => {
    if (cancelled) return;
    const filtered = (data.products || [])
      .filter((p) => p._id !== currentProductId)
      .slice(0, limit);
    setProducts(filtered);
  })
  .catch((err) => {
    console.error("Failed to load related products:", err);
  })
  .finally(() => {
    if (!cancelled) setLoading(false);
  });

    return () => {
      cancelled = true;
    };
  }, [currentProductId, category, limit]);

  if (loading) {
    return (
      <section className="mt-16">
        <h2 className="mb-6 text-center text-2xl font-bold uppercase tracking-widest text-[var(--text)]">
          You may also like
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: limit > 4 ? 4 : limit }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded"
            >
              <div className="aspect-[3/4] w-full rounded bg-[var(--card-subtle)]" />
              <div className="mt-3 h-3 w-3/4 rounded bg-[var(--card-subtle)]" />
              <div className="mt-2 h-3 w-1/2 rounded bg-[var(--card-subtle)]" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-center text-2xl font-bold uppercase tracking-widest text-[var(--text)]">
        You may also like
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onClick={() => navigate(`/product/${product._id}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
