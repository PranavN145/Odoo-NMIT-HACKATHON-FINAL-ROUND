/**
 * Skyline Student Association — Homepage Application Logic
 * Adheres to Docx/design.md
 */

// Sample Events Dataset
const EVENTS_DATA = [
  {
    id: "evt-1",
    title: "TechFest 2026: AI & Robotics Expo",
    category: "tech",
    categoryLabel: "Technology",
    date: "Nov 14 - 15, 2026",
    time: "09:00 AM - 06:00 PM",
    venue: "Main Auditorium & Labs",
    desc: "Flagship symposium featuring autonomous robotics battleground, student AI demos, and keynote tech panels.",
    priceMember: "Free",
    priceGuest: "₹199",
    capacityTotal: 400,
    capacityRegistered: 342,
    badgeClass: "badge-tech"
  },
  {
    id: "evt-2",
    title: "Skyline Hackathon 4.0: 36h Sprint",
    category: "hackathon",
    categoryLabel: "Hackathons",
    date: "Nov 22 - 23, 2026",
    time: "36-Hour Hackathon",
    venue: "Innovation Hub & Cloud Lab",
    desc: "Build next-gen solutions in FinTech, AI, and Sustainability. ₹1.5L prize pool with VC mentoring.",
    priceMember: "Free",
    priceGuest: "Free",
    capacityTotal: 200,
    capacityRegistered: 184,
    badgeClass: "badge-hack"
  },
  {
    id: "evt-3",
    title: "Symphony: Annual Cultural Night",
    category: "cultural",
    categoryLabel: "Cultural",
    date: "Dec 05, 2026",
    time: "06:00 PM - 10:30 PM",
    venue: "Open Air Amphitheatre",
    desc: "Campus celebration showcasing battle of the bands, classical fusion choreography, and comedy sketches.",
    priceMember: "Free",
    priceGuest: "₹99",
    capacityTotal: 800,
    capacityRegistered: 748,
    badgeClass: "badge-cult"
  },
  {
    id: "evt-4",
    title: "Full-Stack Cloud & DevOps Workshop",
    category: "workshop",
    categoryLabel: "Workshops",
    date: "Dec 12, 2026",
    time: "10:00 AM - 04:00 PM",
    venue: "Computer Center, Lab 304",
    desc: "Hands-on Docker, Kubernetes, and CI/CD pipelines deployment bootcamp led by top cloud architects.",
    priceMember: "Free",
    priceGuest: "₹149",
    capacityTotal: 60,
    capacityRegistered: 56,
    badgeClass: "badge-work"
  },
  {
    id: "evt-5",
    title: "Inter-Collegiate Sports Carnival",
    category: "sports",
    categoryLabel: "Sports",
    date: "Dec 18 - 20, 2026",
    time: "All Day",
    venue: "Campus Athletics Complex",
    desc: "Annual tournament across football, basketball, badminton, and track athletics. 16 participating teams.",
    priceMember: "Free",
    priceGuest: "Free",
    capacityTotal: 500,
    capacityRegistered: 412,
    badgeClass: "badge-sport"
  },
  {
    id: "evt-6",
    title: "Startup Pitch & Founder Summit",
    category: "tech",
    categoryLabel: "Technology",
    date: "Jan 08, 2027",
    time: "01:00 PM - 05:30 PM",
    venue: "Executive Seminar Hall 1",
    desc: "Present business ideas to active angel investors and network with successful alumni entrepreneurs.",
    priceMember: "Free",
    priceGuest: "₹249",
    capacityTotal: 150,
    capacityRegistered: 138,
    badgeClass: "badge-tech"
  },
  {
    id: "evt-7",
    title: "Photography & Visual Storytelling",
    category: "workshop",
    categoryLabel: "Workshops",
    date: "Jan 15, 2027",
    time: "11:00 AM - 03:00 PM",
    venue: "Media Studio B",
    desc: "Master DSLR framing, lighting techniques, and Adobe Lightroom editing workflows.",
    priceMember: "₹100",
    priceGuest: "₹200",
    capacityTotal: 50,
    capacityRegistered: 45,
    badgeClass: "badge-work"
  },
  {
    id: "evt-8",
    title: "Winter Beats Acoustic Jam",
    category: "cultural",
    categoryLabel: "Cultural",
    date: "Jan 22, 2027",
    time: "05:00 PM - 08:00 PM",
    venue: "Student Plaza Lounge",
    desc: "Cozy open-mic evening under fairy lights with warm cocoa, acoustic covers, and poetry.",
    priceMember: "Free",
    priceGuest: "Free",
    capacityTotal: 300,
    capacityRegistered: 280,
    badgeClass: "badge-cult"
  }
];

// Sample Merchandise Dataset
const MERCH_DATA = [
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

// State
let currentEventCategory = "all";
let currentMerchCategory = "all";
let currentSearchQuery = "";
let cartItems = [];

// DOM References
document.addEventListener("DOMContentLoaded", () => {
  initLoginDropdown();
  initEventFilters();
  initMerchFilters();
  initSearch();
  initModals();
  initCart();
  renderEvents();
  renderMerchandise();
});

/* ==========================================================================
   1. Login Dropdown (Member, Manager, User)
   ========================================================================== */
function initLoginDropdown() {
  const container = document.getElementById("loginDropdownContainer");
  const toggleBtn = document.getElementById("loginDropdownBtn");

  if (!container || !toggleBtn) return;

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    container.classList.toggle("open");
  });

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      container.classList.remove("open");
    }
  });

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      container.classList.remove("open");
    }
  });
}

/* ==========================================================================
   2. Event Filter & Rendering
   ========================================================================== */
function initEventFilters() {
  const filterBtns = document.querySelectorAll("#eventFilterBar .pill-filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentEventCategory = btn.getAttribute("data-category");
      renderEvents();
    });
  });
}

function renderEvents() {
  const grid = document.getElementById("eventsGrid");
  if (!grid) return;

  const filtered = EVENTS_DATA.filter((item) => {
    const matchesCategory =
      currentEventCategory === "all" || item.category === currentEventCategory;
    const matchesSearch =
      currentSearchQuery === "" ||
      item.title.toLowerCase().includes(currentSearchQuery) ||
      item.desc.toLowerCase().includes(currentSearchQuery) ||
      item.venue.toLowerCase().includes(currentSearchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px;">
        <h4 style="color: var(--color-navy); margin-bottom: 8px;">No events found</h4>
        <p>Try clearing filters or search terms.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered
    .map((evt) => {
      const pct = Math.round((evt.capacityRegistered / evt.capacityTotal) * 100);
      return `
        <article class="ref-event-card" data-id="${evt.id}">
          <div>
            <div class="card-top-row">
              <span class="card-cat-pill">${evt.categoryLabel}</span>
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
            <div class="progress-track-box">
              <div class="progress-labels">
                <span>Booked: <strong>${evt.capacityRegistered}/${evt.capacityTotal}</strong></span>
                <span><strong>${pct}%</strong></span>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${pct}%;"></div>
              </div>
            </div>
          </div>
          <div class="card-bottom-action-row">
            <div class="price-display-group">
              <span class="price-main-lbl">Member: ${evt.priceMember}</span>
              <span class="price-guest-lbl">Guest: ${evt.priceGuest}</span>
            </div>
            <button class="btn-participate-card" onclick="openParticipateModal('${evt.id}')">
              Participate
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

/* ==========================================================================
   3. Merchandise Filter & Rendering
   ========================================================================== */
function initMerchFilters() {
  const filterBtns = document.querySelectorAll("#merchFilterBar .pill-filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentMerchCategory = btn.getAttribute("data-category");
      renderMerchandise();
    });
  });
}

function renderMerchandise() {
  const grid = document.getElementById("merchGrid");
  if (!grid) return;

  const filtered = MERCH_DATA.filter((item) => {
    const matchesCategory =
      currentMerchCategory === "all" || item.category === currentMerchCategory;
    const matchesSearch =
      currentSearchQuery === "" ||
      item.name.toLowerCase().includes(currentSearchQuery) ||
      item.categoryLabel.toLowerCase().includes(currentSearchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px;">
        <h4 style="color: var(--color-navy); margin-bottom: 8px;">No merchandise found</h4>
        <p>Try exploring another category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered
    .map((item) => {
      const hasSizes = item.sizes && item.sizes.length > 0;
      return `
        <article class="ref-merch-card" data-id="${item.id}">
          <div class="merch-photo-stage">
            <span class="merch-pill-disc">${item.discount}</span>
            <span class="merch-pill-stock">${item.stock}</span>
            <span class="merch-icon-large">${item.icon}</span>
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
                          }" onclick="selectSize('${item.id}', '${sz}', this)">${sz}</button>`
                      )
                      .join("")}
                  </div>
                `
                  : `<div style="height: 26px; margin-bottom: 14px;"></div>`
              }
            </div>
            <button class="btn-add-merch-bag" onclick="addToCart('${item.id}')">
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              Add to Bag
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

// Size selection handler
window.selectSize = function (itemId, size, btn) {
  const container = document.getElementById(`sizes-${itemId}`);
  if (container) {
    container.querySelectorAll(".size-tag-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }
};

/* ==========================================================================
   4. Real-time Search
   ========================================================================== */
function initSearch() {
  const searchInput = document.getElementById("globalSearchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    currentSearchQuery = e.target.value.trim().toLowerCase();
    renderEvents();
    renderMerchandise();
  });
}

/* ==========================================================================
   5. Event Participation Modal
   ========================================================================== */
function initModals() {
  const modal = document.getElementById("participateModal");
  const closeBtn = document.getElementById("modalCloseBtn");

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("open");
    });
  }

  // Backdrop click to close
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
      }
    });
  }
}

window.openParticipateModal = function (eventId) {
  const event = EVENTS_DATA.find((e) => e.id === eventId);
  if (!event) return;

  const modal = document.getElementById("participateModal");
  const modalContent = document.getElementById("modalDynamicContent");

  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div style="margin-bottom: 20px;">
      <span class="badge ${event.badgeClass}" style="margin-bottom: 8px;">${event.categoryLabel}</span>
      <h3 style="color: var(--color-navy); margin-bottom: 6px;">${event.title}</h3>
      <p style="font-size: 0.9375rem; color: var(--color-text-muted);">${event.desc}</p>
    </div>

    <div style="background: var(--color-canvas); padding: 16px; border-radius: 8px; margin-bottom: 20px; font-size: 0.875rem;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span style="color: var(--color-text-muted);">Date:</span>
        <strong style="color: var(--color-navy);">${event.date}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span style="color: var(--color-text-muted);">Time:</span>
        <strong style="color: var(--color-navy);">${event.time}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span style="color: var(--color-text-muted);">Venue:</span>
        <strong style="color: var(--color-navy);">${event.venue}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span style="color: var(--color-text-muted);">Pricing:</span>
        <strong style="color: var(--color-navy);">Member: ${event.priceMember} | Guest: ${event.priceGuest}</strong>
      </div>
    </div>

    <form onsubmit="handleRegistrationSubmit(event, '${event.id}')" style="display: flex; flex-direction: column; gap: 14px;">
      <div>
        <label style="display: block; font-size: 0.8125rem; font-weight: 600; color: var(--color-navy); margin-bottom: 4px;">Full Name</label>
        <input type="text" required placeholder="Enter student full name" class="search-field" style="padding-left: 12px;" />
      </div>
      <div>
        <label style="display: block; font-size: 0.8125rem; font-weight: 600; color: var(--color-navy); margin-bottom: 4px;">College Email / Roll No</label>
        <input type="email" required placeholder="student@skyline.edu" class="search-field" style="padding-left: 12px;" />
      </div>
      <div>
        <label style="display: block; font-size: 0.8125rem; font-weight: 600; color: var(--color-navy); margin-bottom: 4px;">Membership Status</label>
        <select class="search-field" style="padding-left: 12px; cursor: pointer;">
          <option value="member">Active Skyline Member (Free Entry)</option>
          <option value="guest">Guest Student (${event.priceGuest})</option>
        </select>
      </div>
      <button type="submit" class="btn-baltic-primary" style="width: 100%; justify-content: center; margin-top: 8px;">
        Confirm Participation & Generate Pass
      </button>
    </form>
  `;

  modal.classList.add("open");
};

window.handleRegistrationSubmit = function (e, eventId) {
  e.preventDefault();
  const modalContent = document.getElementById("modalDynamicContent");
  if (!modalContent) return;

  const event = EVENTS_DATA.find((ev) => ev.id === eventId);
  modalContent.innerHTML = `
    <div style="text-align: center; padding: 24px 0;">
      <div style="width: 56px; height: 56px; background: var(--color-success-bg); color: var(--color-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto 16px;">
        ✓
      </div>
      <h3 style="color: var(--color-navy); margin-bottom: 8px;">Participation Confirmed!</h3>
      <p style="margin-bottom: 20px;">Your digital entry pass for <strong>${event ? event.title : "Event"}</strong> has been registered successfully. A confirmation receipt has been issued.</p>
      <div style="background: var(--color-canvas); border: 1px dashed var(--color-border); border-radius: 8px; padding: 16px; margin-bottom: 20px; font-size: 0.8125rem;">
        Pass ID: <strong>SKY-2026-${Math.floor(1000 + Math.random() * 9000)}</strong><br/>
        Check-in: Show your student ID at the registration desk.
      </div>
      <button type="button" class="btn-baltic-primary" style="width: auto; margin: 0 auto; padding: 10px 24px;" onclick="document.getElementById('participateModal').classList.remove('open')">
        Done
      </button>
    </div>
  `;
};

/* ==========================================================================
   6. Shopping Bag Drawer & Cart Logic
   ========================================================================== */
function initCart() {
  const toggleBtn = document.getElementById("cartToggleBtn");
  const overlay = document.getElementById("cartDrawerOverlay");
  const closeBtn = document.getElementById("cartCloseBtn");

  if (toggleBtn && overlay) {
    toggleBtn.addEventListener("click", () => overlay.classList.add("open"));
  }

  if (closeBtn && overlay) {
    closeBtn.addEventListener("click", () => overlay.classList.remove("open"));
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("open");
    });
  }
}

window.addToCart = function (itemId) {
  const item = MERCH_DATA.find((m) => m.id === itemId);
  if (!item) return;

  const existing = cartItems.find((ci) => ci.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({
      id: item.id,
      name: item.name,
      price: item.price,
      memberPrice: item.memberPrice,
      qty: 1
    });
  }

  updateCartUI();
  // Open drawer to give feedback
  const overlay = document.getElementById("cartDrawerOverlay");
  if (overlay) overlay.classList.add("open");
};

window.removeFromCart = function (itemId) {
  cartItems = cartItems.filter((ci) => ci.id !== itemId);
  updateCartUI();
};

function updateCartUI() {
  const counter = document.getElementById("cartCounter");
  const body = document.getElementById("cartItemsBody");
  const subtotalEl = document.getElementById("cartSubtotal");
  const totalEl = document.getElementById("cartTotal");

  const totalQty = cartItems.reduce((acc, curr) => acc + curr.qty, 0);
  if (counter) counter.textContent = totalQty;

  if (!body) return;

  if (cartItems.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 48px 0; color: var(--color-text-muted);">
        <p style="font-size: 2rem; margin-bottom: 8px;">🛍️</p>
        <p>Your merchandise bag is empty.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = "₹0";
    if (totalEl) totalEl.textContent = "₹0";
    return;
  }

  let subtotal = 0;
  body.innerHTML = cartItems
    .map((item) => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;
      return `
        <div class="cart-item">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">Qty: ${item.qty} × ₹${item.price} = ₹${itemTotal}</div>
          </div>
          <button type="button" class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
      `;
    })
    .join("");

  // 15% Member discount demonstration
  const discount = Math.round(subtotal * 0.15);
  const total = subtotal - discount;

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (totalEl) totalEl.textContent = `₹${total}`;
}

window.handleCheckout = function () {
  if (cartItems.length === 0) {
    alert("Please add items to your merchandise bag before checkout.");
    return;
  }
  alert("Merchandise order simulated successfully! In production, this connects with the backend order endpoint.");
  cartItems = [];
  updateCartUI();
  const overlay = document.getElementById("cartDrawerOverlay");
  if (overlay) overlay.classList.remove("open");
};
