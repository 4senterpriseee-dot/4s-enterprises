const ProductBaseInfo = ({ product, baseCurrency, basePrice, baseImages }) => {
  const previewImage = baseImages[0]?.url || "";

  return (
    <section className="space-y-4 max-w-md w-full">
      <div className="w-full max-h-[500px] overflow-hidden border border-[var(--border)] bg-[var(--card-subtle)]">
        {previewImage ? (
          <img
            src={previewImage}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[var(--text-muted)]">
            No image
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h1 className="text-lg font-semibold text-(--text)">{product.name}</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Base price: {baseCurrency} {basePrice}
        </p>
      </div>
    </section>
  );
};

export default ProductBaseInfo;