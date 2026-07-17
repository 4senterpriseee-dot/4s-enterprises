import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import ProductHighlights from "../components/ProductHighlights";
import RelatedProducts from "../components/RelatedProducts";
import { useCart } from "@/features/cart/hooks/useCart";
import MiniCart from "@/features/cart/components/MiniCart";
import toast from "react-hot-toast";
import PageSkeleton from "@/components/ui/PageSkeleton";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleGetProductDetails } = useProduct();
  const { handleAddToCart } = useCart();
  const product = useSelector((state) => state.product.productDetails);
  const user = useSelector((state) => state.auth.user);
  const allVariants = useMemo(
    () => [
      {
        _id: "base",
        images: product?.images || [],
        price: product?.price,
      },
      ...(product?.variants || []),
    ],
    [product],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M");
  const [loading, setLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const selectedVariant = allVariants[selectedVariantIndex];
  const displayImages = selectedVariant?.images?.length
    ? selectedVariant.images
    : product?.images || [];
  const displayPrice =
    selectedVariant?.price?.amount ?? product?.price?.amount ?? 0;

  const images = useMemo(() => displayImages || [], [displayImages]);
  const activeImageUrl = images[activeIndex]?.url;

  const setPrevImage = () => {
    if (!images.length) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const setNextImage = () => {
    if (!images.length) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  useEffect(() => {
    handleGetProductDetails(productId).catch((error) => {
      console.error("Failed to fetch product details", error);
    });
  }, [productId]);

  useEffect(() => {
    setActiveIndex(0);
    setSelectedVariantIndex(0);
    setQuantity(1);
    setSize("M");
  }, [productId]);

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedVariantIndex]);

  useEffect(() => {
    const count = allVariants.length;

    if (!count) {
      setSelectedVariantIndex(0);
      return;
    }

    if (selectedVariantIndex > count - 1) {
      setSelectedVariantIndex(0);
    }
  }, [allVariants, selectedVariantIndex]);

  if (!product) {
    return (
      <Layout>
        <PageSkeleton />
      </Layout>
    );
  }

  const amount = displayPrice;
  const variantId =
    selectedVariant?._id && selectedVariant._id !== "base"
      ? selectedVariant._id
      : null;

  const handleAdd = async () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!size) {
      toast.error("Select size");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const response = await handleAddToCart({
        productId: product._id,
        variantId,
        quantity,
        size,
        requiresSize: true,
      });
      if (response?.success) {
        setCartOpen(true);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!size) {
      toast.error("Select size");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const response = await handleAddToCart({
        productId: product._id,
        variantId,
        quantity,
        size,
        requiresSize: true,
      });
      if (response?.success) {
        navigate("/cart");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="mx-auto w-full max-w-7xl">
        <div className="grid items-start gap-10 md:grid-cols-2">
          {/* LEFT */}
          <div>
            <div className="space-y-3 md:grid md:grid-cols-[84px_1fr] md:gap-3 md:space-y-0">
              {/* MAIN IMAGE */}
              <div className="relative group order-1 aspect-[4/5] overflow-hidden bg-[var(--card-subtle)] md:order-2">
                {activeImageUrl ? (
                  <img
                    src={activeImageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex aspect-[3/4] items-center justify-center text-xs text-[var(--text-muted)]">
                    No image
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={setPrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition border border-[var(--border)] bg-[var(--card)] p-1 text-(--text)"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={setNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition border border-[var(--border)] bg-[var(--card)] p-1 text-(--text)"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>

              {/* THUMBNAILS */}
              <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
                {images.length ? (
                  images.map((image, index) => (
                    <button
                      key={`${image.url}-${index}`}
                      type="button"
                      className={[
                        "h-20 w-16 shrink-0 overflow-hidden border",
                        index === activeIndex
                          ? "border-[var(--border-focus)]"
                          : "border-[var(--border)]",
                      ].join(" ")}
                      onClick={() => setActiveIndex(index)}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} ${index}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </button>
                  ))
                ) : (
                  <div className="text-xs text-[var(--text-muted)]">
                    No images
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            <h1 className="text-2xl font-semibold uppercase tracking-[0.08em] text-(--text)">
              {product.name}
            </h1>

            <p className="text-xl text-(--text)">₹{amount}</p>

            {product?.variants?.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {allVariants.map((variant, index) => {
                  const img = variant?.images?.[0]?.url;

                  return (
                    <button
                      key={variant?._id || index}
                      type="button"
                      onClick={() => setSelectedVariantIndex(index)}
                      className={`border p-1 transition ${
                        selectedVariantIndex === index
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                      aria-label={`Select variant ${index + 1}`}
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={`Variant ${index + 1}`}
                          className="h-12 w-12 object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              {product.description}
            </p>

            {/* QUANTITY */}
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                Quantity
              </p>
              <div className="inline-flex items-center border border-[var(--border)] bg-[var(--card)]">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-none"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  <Minus size={14} />
                </Button>
                <span className="min-w-10 px-2 text-center text-sm">
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-none"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  <Plus size={14} />
                </Button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 w-full py-3 text-base font-medium">
              <Button
                onClick={handleAdd}
                disabled={loading}
                className="bg-[var(--primary-btn)] text-[var(--card)]"
              >
                {loading ? "Adding..." : "Add to cart"}
              </Button>

              <Button
                variant="outline"
                onClick={handleBuyNow}
                disabled={loading}
              >
                {loading ? "Processing..." : "Buy now"}
              </Button>
            </div>

            {/* INFO */}
            <div className="pt-4">
              <ProductHighlights />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6">
        <RelatedProducts
          currentProductId={product._id}
          category={product?.category}
        />
      </section>

      <MiniCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </Layout>
  );
};

export default ProductDetail;
