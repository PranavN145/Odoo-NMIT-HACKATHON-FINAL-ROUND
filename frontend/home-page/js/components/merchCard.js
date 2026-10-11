/**
 * Clean Merchandise Card Component
 * Minimalist design matching event cards
 * Clicking card opens Product Overview & Purchase Checkout
 * Skyline Student Association Platform
 */

export function renderMerchCard(item) {
  const memberPrice = item.priceMember || (item.memberPrice ? `₹${item.memberPrice}` : "₹899");
  const guestPrice = item.priceGuest || (item.price ? `₹${item.price}` : "₹1,299");
  const imageUrl = item.imageUrl || "./assets/Navy Hoodie Logo Mockup Duo.png";
  const stockText = item.statusText || item.stock || "In Stock";

  return `
    <article class="odoo-clean-event-card clickable-card" data-merch-id="${item.id}" tabindex="0" role="button" aria-label="View details for ${item.name}">
      <!-- Top Image Stage (No text above photo) -->
      <div class="odoo-card-cover-stage" style="height: 200px; background: #FFFFFF; display: flex; align-items: center; justify-content: center; padding: 12px; position: relative;">
        <img src="${imageUrl}" alt="${item.name}" class="odoo-cover-img" style="object-fit: contain; max-height: 100%; width: auto;" />
      </div>

      <!-- Card Main Info (Clean & Simple) -->
      <div class="odoo-card-body">
        <!-- Category & Mode Tag Pills -->
        <div class="odoo-tag-pill-row">
          <span class="odoo-tag-pill category">${item.categoryLabel || "Official Apparel"}</span>
          <span class="odoo-tag-pill mode">Campus Gear</span>
        </div>

        <!-- Title -->
        <h3 class="odoo-card-title">${item.name}</h3>

        <!-- Pricing Line -->
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid #EEF2F6; padding-top: 10px; margin-top: 8px;">
          <div>
            <span style="font-size: 1.125rem; font-weight: 700; color: var(--color-navy);">${memberPrice}</span>
            <span style="font-size: 0.75rem; color: var(--color-baltic); font-weight: 600; margin-left: 4px;">(Member Price)</span>
          </div>
          <span style="font-size: 0.8125rem; color: var(--color-text-muted); text-decoration: line-through;">${guestPrice}</span>
        </div>
      </div>

      <!-- Card Footer: Status Pill -->
      <div class="odoo-card-footer">
        <div class="event-status-pill open" style="width: 100%; text-align: center;">In Stock</div>
      </div>
    </article>
  `;
}

export function renderMerchGrid(gridElement, merchList, currentCategory, searchQuery) {
  if (!gridElement) return;

  const filtered = merchList.filter((item) => {
    const matchesCategory = currentCategory === "all" || item.category === currentCategory;
    const matchesSearch =
      searchQuery === "" ||
      (item.name && item.name.toLowerCase().includes(searchQuery)) ||
      (item.categoryLabel && item.categoryLabel.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    gridElement.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px;">
        <h4 style="color: var(--color-navy); margin-bottom: 8px;">No merchandise items found</h4>
        <p style="color: var(--color-text-muted); font-size: 0.875rem;">Clear search query to see available gear.</p>
      </div>
    `;
    return;
  }

  gridElement.innerHTML = filtered.map(renderMerchCard).join("");
}
