import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import ProductBaseInfo from "../components/variants/ProductBaseInfo";
import VariantPreview from "../components/variants/VariantPreview";
import {
  createVariant,
  formatVariantsPayload,
} from "../components/variants/variant.helpers";

const SellerProductDetail = () => {
  const { productId } = useParams();
  const { handleGetProductDetails, handleAddProductVariant } = useProduct();
  const product = useSelector((state) => state.product.productDetails);
  const [variants, setVariants] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const baseImages = useMemo(() => product?.images ?? [], [product]);
  const basePriceAmount = product?.price?.amount ?? 0;
  const baseCurrency = product?.price?.currency ?? "INR";

  const mappedVariants = useMemo(() => {
    const sourceVariants = product?.variants ?? [];
    if (!sourceVariants?.length) return [];

    return sourceVariants.map((variant) => ({
      _id: variant._id,
      images: [],
      initialImages: variant.images ?? [],
      stock: variant.stock ?? 0,
      price: {
        amount:
          variant?.price?.amount != null ? String(variant.price.amount) : "",
        currency: variant?.price?.currency ?? product?.price?.currency ?? "INR",
      },
      attributes: Object.fromEntries(
        Object.entries(variant?.attributes ?? {}).map(([k, v]) => [k, v ?? ""]),
      ),
      useCustomImages: !!variant?.images?.length,
      useCustomPrice: !!variant?.price?.amount,
    }));
  }, [product]);

  useEffect(() => {
    handleGetProductDetails(productId).catch((error) => {
      console.error("Failed to fetch product details", error);
    });
  }, [productId]);

  useEffect(() => {
    setVariants([]);
    setSaved(false);
    setSubmitError("");
    setOpenIndex(null);
  }, [productId]);

  useEffect(() => {
    if (!product) return;

    if (mappedVariants.length > 0) {
      setVariants(mappedVariants);
    } else {
      setVariants([]);
    }
  }, [mappedVariants, product]);

  const updateVariant = (index, updater) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? updater(v) : v)));
  };

  const handleAddVariant = () => {
    setVariants((prev) => {
      const next = [...prev, createVariant(baseCurrency)];
      setOpenIndex(next.length - 1);
      return next;
    });
    setSaved(false);
    setSubmitError("");
  };

  const isEmptyVariant = (variant) => {
    const hasStock = Number(variant?.stock ?? 0) > 0;
    const hasCustomPrice = Number(variant?.price?.amount ?? 0) > 0;
    const hasAttributes = Object.entries(variant?.attributes ?? {}).some(
      ([key, value]) => key.trim() && String(value).trim(),
    );

    return !hasStock && !hasCustomPrice && !hasAttributes;
  };

  const isVariantValid = (variant) => {
    const hasStock = Number(variant?.stock ?? 0) > 0;
    const hasPrice = Number(variant?.price?.amount ?? 0) > 0;
    const hasAttributes = Object.entries(variant?.attributes ?? {}).some(
      ([key, value]) => key.trim() && String(value).trim(),
    );

    return hasStock || hasPrice || hasAttributes;
  };

  const handleToggle = (index) => {
    if (openIndex === index) {
      const currentVariant = variants[index];
      if (currentVariant && isEmptyVariant(currentVariant)) {
        removeVariant(index);
        return;
      }

      setOpenIndex(null);
      return;
    }

    setOpenIndex(index);
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
    setOpenIndex((prev) => {
      if (prev == null) return prev;
      if (prev === index) return null;
      if (prev > index) return prev - 1;
      return prev;
    });
  };

  const handleSubmit = async () => {
    if (!product) return;

    const cleanedVariants = variants.filter(isVariantValid);

    if (!cleanedVariants.length) {
      setSubmitError("Add at least one non-empty variant before saving.");
      return;
    }

    const newVariants = cleanedVariants.filter((v) => !v._id);

    if (!newVariants.length) {
      setSubmitError("No new variants to save.");
      return;
    }

    try {
      setSaving(true);
      setSaved(false);
      setSubmitError("");

      const payload = formatVariantsPayload(
        newVariants,
        baseImages,
        basePriceAmount,
        baseCurrency,
      );

      for (const variant of payload) {
        await handleAddProductVariant(productId, variant);
      }

      await handleGetProductDetails(productId);

      setSaved(true);
      setOpenIndex(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const hasValidVariants = variants.some(isVariantValid);
  const hasNewValidVariants = variants.some((v) => !v._id && isVariantValid(v));
  const isSubmittingDisabled =
    saving ||
    variants.length === 0 ||
    !hasValidVariants ||
    !hasNewValidVariants;

  if (!product) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl text-sm text-[var(--text-muted)]">
          Loading product details...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <ProductBaseInfo
            product={product}
            baseCurrency={baseCurrency}
            basePrice={basePriceAmount}
            baseImages={baseImages}
          />

          <section className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-(--text)">
                Variants
              </h2>

              <Button type="button" variant="outline" onClick={handleAddVariant}>
                Add Variant
              </Button>
            </div>

            <VariantPreview
              variants={variants}
              baseCurrency={baseCurrency}
              openIndex={openIndex}
              onToggle={handleToggle}
              removeVariant={removeVariant}
              updateVariant={updateVariant}
              baseImages={baseImages}
              basePriceAmount={basePriceAmount}
            />

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

            <div className="pt-2">
              {saved ? (
                <div className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                  Variants saved.
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmittingDisabled}
                >
                  {saving ? "Saving..." : "Save Variants"}
                </Button>
              )}
            </div>
          </section>
        </div>
    </Layout>
  );
};

export default SellerProductDetail;
