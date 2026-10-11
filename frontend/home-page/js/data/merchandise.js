/**
 * Sample Merchandise Dataset & Data Loader Module
 * Skyline Student Association Platform
 * Official Apparel: Skyline Navy Hoodie
 */

export const MERCH_DATA = [
  {
    id: "m-1",
    name: "Skyline Navy Hoodie",
    category: "apparel",
    categoryLabel: "Official Apparel",
    price: 1299,
    memberPrice: 899,
    priceMember: "₹899",
    priceGuest: "₹1,299",
    stock: "In Stock",
    statusText: "In Stock",
    statusType: "open",
    imageUrl: "./assets/Navy Hoodie Logo Mockup Duo.png",
    desc: "Premium heavyweight collegiate navy blue hoodie crafted from 100% organic combed cotton with embroidered campus crest, fleece interior warmth, and kangaroo pocket.",
    sizes: ["S", "M", "L", "XL"]
  }
];

/**
 * Fetches merchandise items from backend endpoint if available, with graceful fallback.
 */
export async function fetchMerchandiseData() {
  try {
    const res = await fetch("http://localhost:5000/api/products", { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.data?.items || data.items || (Array.isArray(data.data) ? data.data : []));
      if (Array.isArray(list) && list.length > 0) {
        return {
          merchandise: list.map((item, idx) => ({
            id: item.id || `m-${idx + 1}`,
            name: item.name || "Skyline Navy Hoodie",
            category: item.category || "apparel",
            categoryLabel: item.categoryLabel || "Official Apparel",
            price: item.price || 1299,
            memberPrice: item.memberPrice || 899,
            priceMember: item.priceMember || "₹899",
            priceGuest: item.priceGuest || "₹1,299",
            stock: item.stock || "In Stock",
            statusText: item.statusText || "In Stock",
            statusType: item.statusType || "open",
            imageUrl: item.imageUrl || "./assets/Navy Hoodie Logo Mockup Duo.png",
            desc: item.desc || "Premium heavyweight collegiate navy blue hoodie crafted from 100% organic combed cotton.",
            sizes: item.sizes || ["S", "M", "L", "XL"]
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
