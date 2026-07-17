import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "JPY"];

const VariantPrice = ({ variant, index, onChange, basePrice, baseCurrency }) => {
  const usingBasePrice =
  !variant.useCustomPrice || variant.price?.amount === "";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">
          Price
        </p>
        <label className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <input
            type="checkbox"
            checked={variant.useCustomPrice}
            onChange={(e) =>
              onChange(index, (current) => ({
                ...current,
                useCustomPrice: e.target.checked,
              }))
            }
          />
          Use custom price
        </label>
      </div>

      <div className="flex gap-3">
        <Input
          type="number"
          min="0"
          placeholder={`Base: ${baseCurrency} ${basePrice}`}
          value={variant.price?.amount ?? ""}
          disabled={!variant.useCustomPrice}
          onChange={(e) =>
            onChange(index, (current) => ({
              ...current,
              price: {
                ...current.price,
                amount: e.target.value,
              },
            }))
          }
        />
        <Select
          value={variant.price?.currency || baseCurrency}
          onValueChange={(value) =>
            onChange(index, (current) => ({
              ...current,
              price: {
                ...current.price,
                currency: value,
              },
            }))
          }
          disabled={!variant.useCustomPrice}
        >
          <SelectTrigger className="w-28">
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

      {usingBasePrice && (
        <p className="text-xs text-[var(--text-muted)]">Using base price</p>
      )}
    </div>
  );
};

export default VariantPrice;