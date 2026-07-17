import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const removeKey = (attributes, keyToRemove) =>
  Object.entries(attributes || {}).reduce((acc, [key, value]) => {
    if (key !== keyToRemove) acc[key] = value;
    return acc;
  }, {});

const VariantAttributes = ({ variant, index, onChange }) => {
  const entries = Object.entries(variant.attributes || {});
  const hasEmpty = entries.some(([key]) => !key.trim());

  const addAttribute = () => {
    onChange(index, (current) => {
      if (Object.prototype.hasOwnProperty.call(current.attributes || {}, "")) {
        return current;
      }

      return {
        ...current,
        attributes: {
          ...(current.attributes || {}),
          "": "",
        },
      };
    });
  };

  const updateValue = (key, value) => {
    onChange(index, (current) => ({
      ...current,
      attributes: {
        ...(current.attributes || {}),
        [key]: value,
      },
    }));
  };

  const updateKey = (oldKey, newKey) => {
    onChange(index, (current) => {
      if (oldKey === newKey) return current;

      const attrs = current.attributes || {};

      if (newKey && attrs[newKey] && newKey !== oldKey) {
        return current;
      }

      const oldValue = attrs[oldKey] ?? "";

      const nextAttrs = {
        ...removeKey(attrs, oldKey),
        [newKey]: oldValue,
      };

      return {
        ...current,
        attributes: nextAttrs,
      };
    });
  };

  const removeAttribute = (key) => {
    onChange(index, (current) => ({
      ...current,
      attributes: removeKey(current.attributes || {}, key),
    }));
  };

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">
        Attributes
      </p>

      {entries.length > 0 &&
        entries.map(([key, value], i) => (
          <div key={`variant-${index}-attr-${i}`} className="flex gap-2">
            {/* KEY */}
            <Input
              placeholder="Attribute (e.g. Color)"
              value={key}
              className={!key.trim() ? "border-red-400" : ""}
              onChange={(e) => updateKey(key, e.target.value)}
            />

            {/* VALUE */}
            <Input
              placeholder="Value (e.g. Red)"
              value={value}
              onChange={(e) => updateValue(key, e.target.value)}
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => removeAttribute(key)}
            >
              Remove
            </Button>
          </div>
        ))}

      <Button
        type="button"
        disabled={hasEmpty}
        variant="outline"
        onClick={addAttribute}
      >
        Add Attribute
      </Button>
    </div>
  );
};

export default VariantAttributes;
