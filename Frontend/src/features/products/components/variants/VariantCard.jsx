import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import VariantAttributes from "./VariantAttributes";
import VariantImages from "./VariantImages";
import VariantPrice from "./VariantPrice";

const VariantCard = ({
  variant,
  index,
  onChange,
  onRemove,
  baseImages,
  basePrice,
  baseCurrency,
}) => {
  return (
    <div className="space-y-4 border border-[var(--border)] p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-(--text)">
          Variant {index + 1}
        </p>
        <Button type="button" variant="ghost" onClick={() => onRemove(index)}>
          Remove Variant
        </Button>
      </div>

      <VariantImages
        variant={variant}
        index={index}
        onChange={onChange}
        baseImages={baseImages}
      />

      <VariantPrice
        variant={variant}
        index={index}
        onChange={onChange}
        basePrice={basePrice}
        baseCurrency={baseCurrency}
      />

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">
          Stock
        </p>
        <Input
          type="number"
          min="0"
          placeholder="Stock"
          value={variant.stock}
          onChange={(e) =>
            onChange(index, (current) => ({
              ...current,
              stock: Number(e.target.value),
            }))
          }
        />
      </div>

      <VariantAttributes variant={variant} index={index} onChange={onChange} />
    </div>
  );
};

export default VariantCard;
