/**
 * Merchandise Card & Grid Renderer Component
 * Skyline Student Association Platform
 */

export function renderMerchCard(item) {
  const hasSizes = item.sizes && item.sizes.length > 0;

  return `
    <article class="ref-merch-card" data-id="${item.id}">
      <div class="merch-photo-stage">
        <span class="merch-pill-disc">${item.discount}</span>
        <span class="merch-pill-stock">${item.stock}</span>
        <span class="merch-icon-large" aria-hidden="true">${item.icon}</span>
      </div>
      <div class="merch-content-block">
        <div>
          <span class="card-cat-pill" style="margin-bottom: 6px; display: inline-block;">${item.categoryLabel}</span>
          <h4 class="merch-name-text">${item.name}</h4>
          <div class="merch-price-line">
            <span class="price-bold">₹${item.price}</span>
            <span class="price-member-tag">₹${item.memberPrice} (Members)</span>
          </div>
          ${
            hasSizes
              ? `
              <div class="size-pill-row" id="sizes-${item.id}">
                ${item.sizes
                  .map(
                    (sz, idx) =>
                      `<button type="button" class="size-tag-btn ${
                        idx === 1 ? "active" : ""
                      }" data-item-id="${item.id}" data-size="${sz}" aria-label="Select size ${sz}">${sz}</button>`
                  )
                  .join("")}
              </div>
            `
              : `<div style="height: 26px; margin-bottom: 14px;"></div>`
          }
        </div>
        <button type="button" class="btn-add-merch-bag" data-merch-id="${item.id}" aria-label="Add ${item.name} to shopping bag">
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          Add to Bag
        </button>
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
      item.name.toLowerCase().includes(searchQuery) ||
      item.categoryLabel.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    gridElement.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px;">
        <h4 style="color: var(--color-navy); margin-bottom: 8px;">No merchandise items found</h4>
        <p style="color: var(--color-text-muted); font-size: 0.875rem;">Explore another category or clear filters.</p>
      </div>
    `;
    return;
  }

  gridElement.innerHTML = filtered.map(renderMerchCard).join("");
}
