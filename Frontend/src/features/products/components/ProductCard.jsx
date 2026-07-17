import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const ProductCard = ({ product, onClick }) => {
  const primaryImage = product?.images?.[0]?.url;
  const secondaryImage = product?.images?.[1]?.url;
  const name = product?.name || "Untitled product";
  const amount = product?.price?.amount ?? product?.price ?? 0;

  return (
    <Card
      className="group cursor-pointer gap-0 overflow-hidden border-0 bg-transparent py-0 ring-0 shadow-none"
      onClick={onClick}
      aria-label={`View ${name}`}
    >
      <div className="relative aspect-[4/5] object-center overflow-hidden bg-[var(--card-subtle)]">
        {primaryImage ? (
          <>
            <img
              src={primaryImage}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
              loading="lazy"
            />
            {secondaryImage ? (
              <img
                src={secondaryImage}
                alt={`${name} alternate view`}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                loading="lazy"
              />
            ) : null}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[11px] text-[var(--text-muted)]">
            No image
          </div>
        )}
      </div>

      <CardContent className="px-0 pt-3 pb-0 space-y-0.5">
        <p className="truncate text-sm font-medium text-(--text)">{name}</p>
        <p className="text-sm text-(--text)">₹{amount}</p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
