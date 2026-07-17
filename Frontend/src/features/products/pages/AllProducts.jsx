import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { getAllProducts } from "../services/product.api";
import Layout from "@/components/layout/Layout";
import PageSkeleton from "@/components/ui/PageSkeleton";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { Filter, X } from "lucide-react";
import { NAV_ITEMS } from "@/app/nav.config";

const AllProducts = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSub = searchParams.get("sub") || "";
  const initialSearch = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState(initialCategory);
  const [sub, setSub] = useState(initialSub);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);

    getAllProducts({ category, sub })
      .then((data) => {
        let result = data.products || [];

        if (searchQuery) {
          result = result.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        }

        setProducts(result);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, sub, searchQuery]);

  return (
    <Layout>
      <section className="mx-auto w-full max-w-[1400px] px-2 sm:px-3 lg:px-4 py-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm w-full sm:w-80"
          />

          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="text-sm border flex items-center justify-center gap-1 border-[var(--border)] px-4 py-2 cursor-pointer"
          >
            Filters <Filter size={16} />
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 border border-[var(--border)] bg-[var(--card)] rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">Filters</p>
              {(category || sub) && (
                <button
                  onClick={() => {
                    setCategory("");
                    setSub("");
                  }}
                  className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-(--text) transition"
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>

            {/* Sub-categories */}
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                Category
              </p>

              <div className="flex gap-2 flex-wrap">
                {NAV_ITEMS.flatMap((n) => n.items).map((item) => {
                  const subCat = item.sub;
                  const active = sub === subCat;

                  return (
                    <button
                      key={subCat}
                      onClick={() => {
                        if (active) {
                          setSub("");
                          setCategory("");
                        } else {
                          const parentNav = NAV_ITEMS.find((n) =>
                            n.items.some((i) => i.sub === subCat)
                          );
                          setSub(subCat);
                          if (parentNav) {
                            setCategory(parentNav.category);
                          }
                        }
                      }}
                      className={[
                        "px-3 py-1.5 text-xs capitalize border transition-all duration-200",
                        active
                          ? "bg-(--text) text-[var(--card)] border-(--text)"
                          : "border-[var(--border)] text-(--text) hover:bg-[var(--card-subtle)]",
                      ].join(" ")}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {loading && <PageSkeleton />}

        {!loading && !products.length && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[var(--card-subtle)] flex items-center justify-center text-2xl">
              🛍️
            </div>
            <p className="text-base font-medium text-(--text)">
              No products found
            </p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="block"
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default AllProducts;
