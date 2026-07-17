import ImageUploader from "../ImageUploader";

const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (image.url) return image.url;
  return "";
};

const VariantImages = ({ variant, index, onChange, baseImages }) => {
  const customImageSource =
    variant.useCustomImages &&
    ((variant.images?.length ?? 0) > 0 || (variant.initialImages?.length ?? 0) > 0);

  const imagesToShow = customImageSource
    ? variant.images?.length
      ? variant.images
      : variant.initialImages
    : baseImages;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">
          Images
        </p>
        <label className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <input
            type="checkbox"
            checked={variant.useCustomImages}
            onChange={(e) =>
              onChange(index, (current) => ({
                ...current,
                useCustomImages: e.target.checked,
              }))
            }
          />
          Use custom images
        </label>
      </div>

      {variant.useCustomImages && (
        <ImageUploader
          files={variant.images}
          onChange={(files) =>
            onChange(index, (current) => ({
              ...current,
              images: files,
            }))
          }
        />
      )}

      {!customImageSource && (
        <p className="text-xs text-[var(--text-muted)]">Using base product images</p>
      )}

      {imagesToShow?.length > 0 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {imagesToShow.slice(0, 6).map((img, imgIndex) => {
            const src = getImageUrl(img);
            if (!src) return null;

            return (
              <div
                key={`variant-${index}-img-${imgIndex}`}
                className="aspect-square border border-[var(--border)] bg-[var(--card-subtle)]"
              >
                <img
                  src={src}
                  alt={`Variant ${index + 1} image ${imgIndex + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VariantImages;