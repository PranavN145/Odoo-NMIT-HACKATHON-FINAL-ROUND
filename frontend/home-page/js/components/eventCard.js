/**
 * Event Card & Grid Renderer Component
 * Skyline Student Association Platform
 */

const CATEGORY_ICONS = {
  tech: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
  hackathon: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`,
  cultural: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>`,
  workshop: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`,
  sports: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
};

export function renderEventCard(evt) {
  const hasImage = evt.imageUrl && evt.imageUrl.trim() !== "";
  const categoryIcon = CATEGORY_ICONS[evt.category] || CATEGORY_ICONS.tech;

  return `
    <article class="ref-event-card" data-id="${evt.id}">
      <div>
        <div style="height: 140px; width: 100%; border-radius: 8px; overflow: hidden; margin-bottom: 14px; background: var(--color-surface-subtle); border: 1px solid var(--color-border-subtle); display: flex; align-items: center; justify-content: center; position: relative;">
          ${
            hasImage
              ? `<img src="${evt.imageUrl}" alt="${evt.title}" style="width: 100%; height: 100%; object-fit: cover;" />`
              : `<div style="display: flex; flex-direction: column; align-items: center; gap: 6px; color: var(--color-cerulean);">
                  <div style="width: 40px; height: 40px; border-radius: 50%; background: #EAF5FB; border: 1px solid #BDE0FE; display: flex; align-items: center; justify-content: center;">
                    ${categoryIcon}
                  </div>
                  <span style="font-size: 0.75rem; font-weight: 600; color: var(--color-text-muted);">${evt.categoryLabel || "Event"}</span>
                 </div>`
          }
        </div>

        <div class="card-top-row">
          <span class="card-cat-pill">${evt.categoryLabel || "Event"}</span>
          <span class="card-date-sub">${evt.date}</span>
        </div>

        <h3 class="event-card-name">${evt.title}</h3>
        <p class="event-card-desc">${evt.desc}</p>

        <div class="event-meta-lines">
          <div class="meta-line-item">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>${evt.time}</span>
          </div>
          <div class="meta-line-item">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>${evt.venue}</span>
          </div>
        </div>
      </div>

      <div class="card-bottom-action-row">
        <div class="price-display-group">
          <span class="price-main-lbl">Member: ${evt.priceMember}</span>
          <span class="price-guest-lbl">Guest: ${evt.priceGuest}</span>
        </div>
        <button type="button" class="btn-participate-card" data-event-id="${evt.id}" aria-label="Register for ${evt.title}">
          Register
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
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
      (item.desc && item.desc.toLowerCase().includes(searchQuery)) ||
      (item.venue && item.venue.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    gridElement.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px;">
        <h4 style="color: var(--color-navy); margin-bottom: 8px;">No events found</h4>
        <p style="color: var(--color-text-muted); font-size: 0.875rem;">Try clearing your filter selection or search query.</p>
      </div>
    `;
    return;
  }

  gridElement.innerHTML = filtered.map(renderEventCard).join("");
}
