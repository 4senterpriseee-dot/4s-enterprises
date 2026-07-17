/**
 * NAV_ITEMS drives both the desktop dropdown and the mobile drawer.
 * To add a new category, just add an entry here — no component changes needed.
 *
 * - label      : display text
 * - category   : query param value → /products?category=tops
 * - items      : sub-category links → /products?category=tops&sub=tshirts
 */
export const NAV_ITEMS = [
  {
    label: "Tops",
    category: "tops",
    items: [
      { label: "T-Shirts", sub: "tshirts" },
      { label: "Shirts", sub: "shirts" },
      { label: "Tanks", sub: "tanks" },
    ],
  },
  {
    label: "Bottoms",
    category: "bottoms",
    items: [
      { label: "Jeans", sub: "jeans" },
      { label: "Trousers", sub: "trousers" },
    ],
  },
];
