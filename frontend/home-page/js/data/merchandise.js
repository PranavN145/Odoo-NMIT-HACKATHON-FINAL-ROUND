/**
 * Sample Merchandise Dataset & Data Loader Module
 * Skyline Student Association Platform
 */

export const MERCH_DATA = [
  {
    id: "m-1",
    name: "Skyline Varsity Fleece Hoodie",
    category: "apparel",
    categoryLabel: "Apparel",
    price: 1199,
    memberPrice: 1019,
    stock: "In Stock",
    icon: "🧥",
    discount: "15% OFF",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "m-2",
    name: "Classic Campus Crest T-Shirt",
    category: "apparel",
    categoryLabel: "Apparel",
    price: 499,
    memberPrice: 424,
    stock: "In Stock",
    icon: "👕",
    discount: "15% OFF",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "m-3",
    name: "HydroShield Steel Flask (750ml)",
    category: "drinkware",
    categoryLabel: "Drinkware",
    price: 649,
    memberPrice: 550,
    stock: "Only 8 Left",
    icon: "🍶",
    discount: "15% OFF",
    sizes: []
  },
  {
    id: "m-4",
    name: "Executive Hardcover Dot Notebook",
    category: "stationery",
    categoryLabel: "Stationery",
    price: 349,
    memberPrice: 295,
    stock: "In Stock",
    icon: "📓",
    discount: "15% OFF",
    sizes: []
  },
  {
    id: "m-5",
    name: "Embroidered Skyline Brass Cap",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 399,
    memberPrice: 339,
    stock: "In Stock",
    icon: "🧢",
    discount: "15% OFF",
    sizes: []
  },
  {
    id: "m-6",
    name: "Heavy Canvas Eco Tote Bag",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 299,
    memberPrice: 254,
    stock: "In Stock",
    icon: "👜",
    discount: "15% OFF",
    sizes: []
  },
  {
    id: "m-7",
    name: "Tech Accessory Cable Organizer",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 449,
    memberPrice: 380,
    stock: "Few Left",
    icon: "💼",
    discount: "15% OFF",
    sizes: []
  },
  {
    id: "m-8",
    name: "Enamel Skyline Pin Collector Set",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 199,
    memberPrice: 169,
    stock: "In Stock",
    icon: "🎖️",
    discount: "15% OFF",
    sizes: []
  }
];

export async function fetchMerchandiseData() {
  try {
    const res = await fetch("http://localhost:5000/api/products", { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return {
          merchandise: data.map((item) => ({
            id: item.id || `m-${Math.random()}`,
            name: item.name || "Merchandise Product",
            category: item.category || "accessories",
            categoryLabel: item.categoryLabel || "Merchandise",
            price: item.basePrice || item.price || 499,
            memberPrice: item.memberPrice || Math.round((item.basePrice || 499) * 0.85),
            stock: item.isAvailable ? "In Stock" : "Out of Stock",
            icon: item.icon || "🛍️",
            discount: "15% OFF",
            sizes: item.sizes || []
          })),
          isFromApi: true
        };
      }
    }
  } catch (_) {
    // Fallback to initial merchandise data
  }

  return {
    merchandise: [...MERCH_DATA],
    isFromApi: false
  };
}
