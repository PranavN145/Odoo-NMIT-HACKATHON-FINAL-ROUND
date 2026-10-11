/**
 * Clean Event Card Component
 * Minimalist cards with status badges (Open, Closing Soon, Sold Out)
 * Clicking card opens Event Detail & Registration Modal
 */

export function renderEventCard(evt) {
  const hasImage = evt.imageUrl && evt.imageUrl.trim() !== "";
  const dateMonth = evt.dateMonth || "OCT";
  const dateDay = evt.dateDay || "10";
  const statusType = evt.statusType || (evt.isSoldOut ? "sold-out" : "open");
  const statusText = evt.statusText || (statusType === "sold-out" ? "Sold Out" : statusType === "closing-soon" ? "Closing Soon" : "Open");

  return `
    <article class="odoo-clean-event-card clickable-card" data-event-id="${evt.id}" tabindex="0" role="button" aria-label="View details for ${evt.title}">
      <!-- Top Image Stage with Floating Circular Date Badge -->
      <div class="odoo-card-cover-stage">
        ${
          hasImage
            ? `<img src="${evt.imageUrl}" alt="${evt.title}" class="odoo-cover-img" />`
            : `<div class="odoo-cover-gradient-fallback">
                <svg width="32" height="32" fill="none" stroke="rgba(255,255,255,0.4)" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
               </div>`
        }

        <!-- Top Right Floating Date Badge -->
        <div class="odoo-date-badge-circle" aria-label="${dateMonth} ${dateDay}">
          <span class="badge-month">${dateMonth}</span>
          <span class="badge-day">${dateDay}</span>
        </div>
      </div>

      <!-- Card Main Info -->
      <div class="odoo-card-body">
        <!-- Category & Mode Tag Pills -->
        <div class="odoo-tag-pill-row">
          <span class="odoo-tag-pill category">${evt.categoryLabel || "Event"}</span>
          <span class="odoo-tag-pill mode">${evt.mode || "In Person"}</span>
        </div>

        <!-- Title -->
        <h3 class="odoo-card-title">${evt.title}</h3>

        <!-- Location Line -->
        <div class="odoo-location-line">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>${evt.venue || "Skyline Campus"}</span>
        </div>
      </div>

      <!-- Card Footer: Status Pill Only (Open, Closing Soon, Sold Out) -->
      <div class="odoo-card-footer">
        <div class="event-status-pill ${statusType}">${statusText}</div>
      </div>
    </article>
  `;
}

export function renderEventsGrid(gridElement, eventsList, currentCategory, searchQuery, isLoading) {
  if (!gridElement) return;

  if (isLoading) {
    gridElement.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px;">
        <p style="color: var(--color-navy); font-weight: 600;">Loading events...</p>
      </div>
    `;
    return;
  }

  const filtered = eventsList.filter((item) => {
    const matchesCategory = currentCategory === "all" || item.category === currentCategory;
    const matchesSearch =
      searchQuery === "" ||
      (item.title && item.title.toLowerCase().includes(searchQuery)) ||
      (item.venue && item.venue.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    gridElement.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px;">
        <h4 style="color: var(--color-navy); margin-bottom: 8px;">No events found</h4>
        <p style="color: var(--color-text-muted); font-size: 0.875rem;">Try clearing search query.</p>
      </div>
    `;
    return;
  }

  gridElement.innerHTML = filtered.map(renderEventCard).join("");
}
