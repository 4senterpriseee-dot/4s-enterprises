import VariantCard from "./VariantCard";

const filePreviewUrlCache = new WeakMap();

const getFilePreviewUrl = (file) => {
  const cached = filePreviewUrlCache.get(file);
  if (cached) return cached;

  const objectUrl = URL.createObjectURL(file);
  filePreviewUrlCache.set(file, objectUrl);
  return objectUrl;
};

const getPreviewImage = (variant) => {
  if (variant.images?.length) {
    const first = variant.images[0];

    if (first?.url) return first.url;

    if (first instanceof File) {
      return getFilePreviewUrl(first);
    }

    if (typeof first === "string") return first;
  }

  if (variant.initialImages?.length) {
    const first = variant.initialImages[0];
    if (first?.url) return first.url;
    if (typeof first === "string") return first;
  }

  return "";
};

const VariantPreviewRow = ({
  variant,
  index,
  baseCurrency,
  isOpen,
  onToggle,
  onRemove,
  onSave,
  children,
}) => {
  const image = getPreviewImage(variant);
  const amount = variant.price?.amount;
  const amountLabel = amount === "" || amount == null ? "Base" : amount;

  return (
    <div className="border border-[var(--border)]">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 p-3 sm:p-4">
        <div className="flex gap-4">
          <div className="aspect-[3/4] w-16 shrink-0 bg-[var(--card-subtle)]">
            {image ? (
              <img
                src={image}
                alt={`Variant ${index + 1}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center px-1 text-center text-[10px] text-[var(--text-muted)]">
                No image
              </div>
            )}
          </div>

          <div className="space-y-1 text-sm">
            <p className="font-medium">
              {baseCurrency} {amountLabel}
            </p>

            <p className="text-xs text-[var(--text-muted)]">
              Stock: {variant.stock}
            </p>

            <p className="text-xs text-[var(--text-muted)]">
              {Object.entries(variant.attributes || {})
                .map(([k, v]) => `${k}: ${v}`)
                .join(" · ")}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 items-center">
          {isOpen && onSave && (
            <button onClick={onSave} className="text-xs border px-2 py-1 bg-[var(--primary-btn)] text-[var(--card)] rounded">
              Save
            </button>
          )}
          <button onClick={onToggle} className="text-xs border px-2 py-1 rounded">
            {isOpen ? "Close" : "Edit"}
          </button>

          <button onClick={onRemove} className="text-xs border px-2 py-1">
            Remove
          </button>
        </div>
      </div>

      {/* COLLAPSE BODY */}
      {isOpen && (
        <div className="border-t border-[var(--border)] p-4">{children}</div>
      )}
    </div>
  );
};

const VariantPreview = ({
  variants,
  baseCurrency,
  openIndex,
  onToggle,
  removeVariant,
  updateVariant,
  saveVariant,
  baseImages,
  basePriceAmount,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {variants.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">No variants yet.</p>
        )}

        {variants.map((variant, index) => {
          const isOpen = openIndex === index;

          return (
            <VariantPreviewRow
              key={variant._id || index}
              variant={variant}
              index={index}
              baseCurrency={baseCurrency}
              isOpen={isOpen}
              onToggle={() => onToggle(index)}
              onRemove={() => removeVariant(index)}
              onSave={() => saveVariant(index)}
            >
              <VariantCard
                variant={variant}
                index={index}
                onChange={updateVariant}
                onRemove={removeVariant}
                baseImages={baseImages}
                basePrice={basePriceAmount}
                baseCurrency={baseCurrency}
              />
            </VariantPreviewRow>
          );
        })}
      </div>
    </div>
  );
};

export default VariantPreview;
