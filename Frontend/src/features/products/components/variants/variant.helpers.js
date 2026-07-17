export const createVariant = (baseCurrency = "INR") => ({
  images: [],
  initialImages: [],
  stock: 0,
  price: { amount: "", currency: baseCurrency },
  attributes: {},
  useCustomImages: false,
  useCustomPrice: false,
});

export const formatVariantsPayload = (
  variants,
  baseImages,
  basePriceAmount,
  baseCurrency,
) => {
  return variants.map((variant) => {
    const stock = Number(variant.stock);

    const hasCustomImages =
      variant.useCustomImages &&
      (variant.images?.length > 0 || variant.initialImages?.length > 0);

    const effectiveImages = hasCustomImages
      ? variant.images?.length
        ? variant.images
        : variant.initialImages
      : baseImages;

    const hasCustomPrice = variant.useCustomPrice && variant.price?.amount !== "";

    return {
      images: effectiveImages,
      stock: Number.isFinite(stock) ? stock : 0,
      attributes: Object.fromEntries(
        Object.entries(variant.attributes || {}).filter(
          ([key, value]) => key.trim() && String(value).trim(),
        ),
      ),
      price: {
        amount: hasCustomPrice ? Number(variant.price.amount) : basePriceAmount,
        currency: hasCustomPrice
          ? variant.price?.currency || baseCurrency
          : baseCurrency,
      },
    };
  });
};