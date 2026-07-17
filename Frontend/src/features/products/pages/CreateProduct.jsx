import React, { useState } from "react";
import { Store, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../auth/state/auth.slice";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { Button } from "@/components/ui/Button";
import { NAV_ITEMS } from "@/app/nav.config";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import ImageUploader from "../components/ImageUploader";
import Layout from "@/components/layout/Layout";

/* ── Constants ── */
const MAX_FILES = 7;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const CURRENCIES = ["INR", "USD", "EUR", "GBP", "JPY"];

const fieldLabelCls =
  "text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-secondary)]";

const fieldCls = (hasError) =>
  [
    "h-10 rounded-lg bg-[var(--card)] text-(--text) placeholder:text-[var(--text-muted)]",
    hasError
      ? "border-[var(--error)]"
      : "border-[var(--border)] hover:border-[var(--border-focus)]",
  ].join(" ");

const FieldError = ({ id, message }) =>
  message ? (
    <p id={id} role="alert" className="text-[11px] text-[var(--error)]">
      {message}
    </p>
  ) : null;

const PageHeader = () => (
  <header className="mb-6 w-full flex flex-col items-center text-center">
    <div className="flex items-center gap-2.5">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary-btn)] shrink-0">
        <Store size={16} strokeWidth={2} className="text-[var(--card)]" />
      </div>
      <span className="text-lg font-bold tracking-widest uppercase text-(--text) leading-none">
        4senterprises
      </span>
    </div>

    <p className="mt-1.5 text-[12px] text-[var(--text-muted)] font-normal tracking-normal">
      Manage your catalog and publish new items.
    </p>
  </header>
);

/* ─── Create Product Page ──────────────────────────────── */
const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* Redux global error (same system as auth pages) */
  const reduxError = useSelector((state) => state.auth.error);

  /* ── Form state ── */
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    currency: "INR",
    category: "",
    subCategory: "",
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── Handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const extra = name === "category" ? { subCategory: "" } : {};
    setForm((prev) => ({ ...prev, [name]: value, ...extra }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (reduxError) dispatch(setError(null));
  };

  const handleCurrencyChange = (val) => {
    setForm((prev) => ({ ...prev, currency: val }));
    if (reduxError) dispatch(setError(null));
  };

  const handleImagesChange = (files) => {
    setImages(files);
    if (errors.images) setErrors((prev) => ({ ...prev, images: "" }));
  };

  /* ── Validation ── */
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";
    if (!form.price) {
      newErrors.price = "Price is required.";
    } else if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = "Enter a valid price.";
    }
    if (images.length === 0) {
      newErrors.images = "Add at least one product image.";
    } else if (images.length > MAX_FILES) {
      newErrors.images = `Maximum ${MAX_FILES} images allowed.`;
    } else {
      const oversized = images.find((f) => f.size > MAX_SIZE_BYTES);
      if (oversized)
        newErrors.images = `"${oversized.name}" exceeds the 5 MB size limit.`;
    }
    return newErrors;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    dispatch(setError(null));
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("priceAmount", Math.round(Number(form.price)));
      formData.append("priceCurrency", form.currency);
      formData.append("category", form.category);
      formData.append("subCategory", form.subCategory);
      images.forEach((img) => formData.append("images", img));

      await handleCreateProduct(formData);
      navigate("/");
    } catch (err) {
      const { field, message } = err?.response?.data ?? {};
      if (field && message) {
        setErrors({ [field]: message });
      } else {
        dispatch(
          setError(message || "Something went wrong. Please try again."),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

 return (
    <Layout mainClassName="min-h-screen bg-[var(--bg)] px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-4xl">
        <PageHeader />

        <Card
          className="register-card rounded-2xl border border-[var(--border)] bg-[var(--card)] text-(--text) py-0"
          style={{ boxShadow: "0 6px 32px rgba(27,28,26,0.07)" }}
          aria-label="Create a new product"
        >
          <CardHeader className="px-7 pt-7 sm:px-8 sm:pt-8 pb-2">
            <CardTitle className="text-[17px] font-semibold text-(--text)">
              Create Product
            </CardTitle>
            <CardDescription className="text-[var(--text-muted)]">
              Add a new item to your storefront with details, pricing, and
              images.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="px-7 py-5 sm:px-8 space-y-6">
              <section className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className={fieldLabelCls}>
                    Product Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. Slim Fit Linen Shirt"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="off"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={fieldCls(!!errors.name)}
                  />
                  <FieldError id="name-error" message={errors.name} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className={fieldLabelCls}>
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Describe the product - material, fit, occasion..."
                    value={form.description}
                    onChange={handleChange}
                    aria-invalid={!!errors.description}
                    aria-describedby={
                      errors.description ? "desc-error" : undefined
                    }
                    className={[
                      fieldCls(!!errors.description),
                      "min-h-28 resize-none leading-relaxed",
                    ].join(" ")}
                  />
                  <FieldError id="desc-error" message={errors.description} />
                </div>
              </section>

              <section className="space-y-4">
                <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Pricing
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-3 items-start">
                  <div className="space-y-1.5">
                    <Label htmlFor="price" className={fieldLabelCls}>
                      Price
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={form.price}
                      onChange={handleChange}
                      aria-invalid={!!errors.price}
                      aria-describedby={
                        errors.price ? "price-error" : undefined
                      }
                      className={fieldCls(!!errors.price)}
                    />
                    <FieldError id="price-error" message={errors.price} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="currency" className={fieldLabelCls}>
                      Currency
                    </Label>
                    <Select
                      value={form.currency}
                      onValueChange={handleCurrencyChange}
                    >
                      <SelectTrigger
                        id="currency"
                        className={fieldCls(false).replace(
                          "h-10",
                          "h-10 w-full",
                        )}
                      >
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              {/* ── Images section ── */}
              <section className="space-y-4">
                <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Images
                </p>

                <div className="space-y-1.5">
                  <Label htmlFor="images" className={fieldLabelCls}>
                    Product Images
                  </Label>
                  <ImageUploader
                    files={images}
                    onChange={handleImagesChange}
                    error={errors.images}
                  />
                </div>
              </section>
            </CardContent>

            <CardFooter className="px-7 pb-7 pt-1 sm:px-8 sm:pb-8 bg-[var(--card)] flex-col items-stretch gap-3">
              {reduxError && (
                <p role="alert" className="text-[11px] text-[var(--error)]">
                  {reduxError}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 rounded-lg bg-[var(--primary-btn)] text-[var(--card)] hover:bg-[var(--primary-hover)]"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    Publish Product
                    <ChevronRight size={14} strokeWidth={2} />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateProduct;
