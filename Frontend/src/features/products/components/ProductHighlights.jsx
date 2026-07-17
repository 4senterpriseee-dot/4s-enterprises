import React from "react";
import { Truck, RefreshCcw, ShieldCheck } from "lucide-react";

const ProductHighlights = () => {
  const items = [
    {
      icon: Truck,
      text: "Delivery within 6-8 days",
    },
    {
      icon: RefreshCcw,
      text: "Easy 7-day return & exchange",
    },
    {
      icon: ShieldCheck,
      text: "100% authentic products",
    },
  ];

  return (
    <div className="space-y-3 text-sm text-(--text)">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} className="flex items-center gap-3">
            <Icon size={20} strokeWidth={1.5} className="text-[var(--text-muted)]" />
            <p className="text-[var(--text-muted)]">{item.text}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ProductHighlights;