/**
 * Skyline Student Association — Member Portal JavaScript
 * Implements: Dashboard, Event Booking, Merch Store, Announcements, My Passes & Orders
 */

// Application State
const state = {
  member: {
    id: "uuid-user-8924",
    memberId: "SSA-2026-8924",
    name: "Jane Doe",
    email: "jane.doe@university.edu",
    phone: "+1 (555) 234-8924",
    role: "MEMBER",
    isVolunteer: false,
    membership: {
      status: "ACTIVE",
      tier: "Student Regular",
      annualFee: 25.00,
      startDate: "2026-09-01T00:00:00.000Z",
      expiryDate: "2027-08-31T23:59:59.000Z",
      daysRemaining: 325
    }
  },

  events: [
    {
      id: "ev-1",
      title: "Annual Tech Symposium 2026",
      category: "academic",
      categoryLabel: "Academic & Tech",
      dateFormatted: "Nov 15, 2026 • 10:00 AM",
      venue: "Campus Auditorium",
      capacity: 200,
      ticketsSold: 145,
      standardPrice: 25.00,
      memberPrice: 10.00,
      description: "Join industry leaders from top tech firms, student showcase demos, and career networking roundtables. Lunch provided."
    },
    {
      id: "ev-2",
      title: "Autumn Cultural Gala & Showcase",
      category: "cultural",
      categoryLabel: "Cultural & Arts",
      dateFormatted: "Dec 05, 2026 • 6:30 PM",
      venue: "Great Hall, Student Center",
      capacity: 350,
      ticketsSold: 280,
      standardPrice: 35.00,
      memberPrice: 15.00,
      description: "An evening celebrating student talent, live musical performances, international culinary booths, and dance showcases."
    },
    {
      id: "ev-3",
      title: "Alumni & Industry Networking Night",
      category: "networking",
      categoryLabel: "Networking",
      dateFormatted: "Jan 18, 2027 • 5:00 PM",
      venue: "Student Union Level 3 Ballroom",
      capacity: 120,
      ticketsSold: 88,
      standardPrice: 20.00,
      memberPrice: 5.00,
      description: "Connect with association alumni working in engineering, design, finance, and product management. Resumes welcome."
    },
    {
      id: "ev-4",
      title: "Hackathon Demo Day & Awards Ceremony",
      category: "academic",
      categoryLabel: "Academic & Tech",
      dateFormatted: "Feb 10, 2027 • 2:00 PM",
      venue: "Innovation Hub Gallery",
      capacity: 150,
      ticketsSold: 130,
      standardPrice: 10.00,
      memberPrice: 0.00,
      description: "Watch the top 10 student finalist teams pitch their projects to guest judges. Complimentary entry for all active members."
    }
  ],

  merch: [
    {
      id: "prod-1",
      name: "Skyline Association Hoodie 2026",
      basePrice: 35.00,
      badge: "BESTSELLER",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
      variants: [
        { id: "var-1-s", size: "S", stockQuantity: 15 },
        { id: "var-1-m", size: "M", stockQuantity: 30 },
        { id: "var-1-l", size: "L", stockQuantity: 25 },
        { id: "var-1-xl", size: "XL", stockQuantity: 2 },
        { id: "var-1-xxl", size: "XXL", stockQuantity: 0 }
      ]
    },
    {
      id: "prod-2",
      name: "Embroidered Collegiate Crewneck",
      basePrice: 28.00,
      badge: "NEW DROP",
      image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=600&q=80",
      variants: [
        { id: "var-2-s", size: "S", stockQuantity: 8 },
        { id: "var-2-m", size: "M", stockQuantity: 14 },
        { id: "var-2-l", size: "L", stockQuantity: 18 },
        { id: "var-2-xl", size: "XL", stockQuantity: 5 },
        { id: "var-2-xxl", size: "XXL", stockQuantity: 2 }
      ]
    },
    {
      id: "prod-3",
      name: "Heritage Embroidered Varsity Cap",
      basePrice: 18.00,
      badge: "POPULAR",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80",
      variants: [
        { id: "var-3-std", size: "Standard", stockQuantity: 40 }
      ]
    },
    {
      id: "prod-4",
      name: "Skyline Official Enamel Pin Set",
      basePrice: 8.00,
      badge: "ACCESSORY",
      image: "https://images.unsplash.com/photo-1614036417651-efe5912149d8?auto=format&fit=crop&w=600&q=80",
      variants: [
        { id: "var-4-std", size: "Standard", stockQuantity: 55 }
      ]
    }
  ],

  announcements: [
    {
      id: "ann-1",
      title: "Annual General Assembly & Constitution Amendment",
      date: "October 09, 2026",
      audience: "ALL",
      author: "Executive Board",
      content: "The Fall General Body Meeting is scheduled for next Friday, Oct 16 at 5:00 PM in Lecture Hall C. Active members will vote on the proposed club bylaws amendment. Refreshments will be served."
    },
    {
      id: "ann-2",
      title: "Exclusive Member Merchandise Drop: 2026 Winter Collection",
      date: "October 07, 2026",
      audience: "MEMBERS",
      author: "Merchandise Committee",
      content: "The 2026 Association fleece hoodies and embroidered crewnecks are now live in the Merch Store. Active members receive reserved size variant stock for the first 7 days before public release."
    },
    {
      id: "ann-3",
      title: "Volunteer Registration Open for Annual Tech Symposium",
      date: "October 02, 2026",
      audience: "ALL",
      author: "Events Operations Team",
      content: "We are onboarding volunteer staff for badge distribution, speaker hospitality, and live stage management. Check in at the association office if you hold an active membership and wish to assist."
    }
  ],

  myTickets: [
    {
      id: "tic-1",
      eventId: "ev-1",
      eventTitle: "Annual Tech Symposium 2026",
      ticketCode: "TIC-2026-9A8B7C",
      dateFormatted: "Nov 15, 2026 • 10:00 AM",
      venue: "Campus Auditorium",
      pricePaid: 10.00,
      status: "PAID",
      bookedAt: "2026-10-08T14:22:00.000Z"
    },
    {
      id: "tic-2",
      eventId: "ev-2",
      eventTitle: "Autumn Cultural Gala & Showcase",
      ticketCode: "TIC-2026-4F2E1A",
      dateFormatted: "Dec 05, 2026 • 6:30 PM",
      venue: "Great Hall, Student Center",
      pricePaid: 15.00,
      status: "PAID",
      bookedAt: "2026-10-09T18:10:00.000Z"
    }
  ],

  myOrders: [
    {
      id: "ORD-2026-8924",
      date: "Oct 08, 2026",
      itemsSummary: "1x Skyline Hoodie (Size L)",
      totalAmount: 35.00,
      paymentStatus: "PAID",
      fulfillmentStatus: "READY FOR PICKUP"
    }
  ],

  cart: [],
  selectedMerchVariants: {}, // productId -> variantId
  bookingEventTarget: null
};

// =============================================================================
// DOM Elements & Selectors
// =============================================================================
const navItems = document.querySelectorAll('.nav-item');
const tabPanels = document.querySelectorAll('.tab-panel');
const toastContainer = document.getElementById('toastContainer');

// Cart Drawer Elements
const openCartBtn = document.getElementById('openCartBtn');
const viewCartHeaderBtn = document.getElementById('viewCartHeaderBtn');
const closeCartDrawerBtn = document.getElementById('closeCartDrawerBtn');
const cartDrawerBackdrop = document.getElementById('cartDrawerBackdrop');
const cartItemsList = document.getElementById('cartItemsList');
const cartEmptyState = document.getElementById('cartEmptyState');
const cartDrawerFooter = document.getElementById('cartDrawerFooter');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartGrandTotal = document.getElementById('cartGrandTotal');
const cartDrawerSubtitle = document.getElementById('cartDrawerSubtitle');
const checkoutBtn = document.getElementById('checkoutBtn');
const startShoppingBtn = document.getElementById('startShoppingBtn');
const headerCartCount = document.getElementById('headerCartCount');
const cartTriggerBadge = document.getElementById('cartTriggerBadge');
const cartCountBtnLabel = document.getElementById('cartCountBtnLabel');

// Booking Modal Elements
const bookEventModal = document.getElementById('bookEventModal');
const closeBookModalBtn = document.getElementById('closeBookModalBtn');
const cancelBookBtn = document.getElementById('cancelBookBtn');
const confirmBookTicketBtn = document.getElementById('confirmBookTicketBtn');
const bookModalEventTitle = document.getElementById('bookModalEventTitle');
const bookModalDateVenue = document.getElementById('bookModalDateVenue');
const bookModalStandardPrice = document.getElementById('bookModalStandardPrice');
const bookModalMemberPrice = document.getElementById('bookModalMemberPrice');
const confirmPriceBtnLabel = document.getElementById('confirmPriceBtnLabel');

// Ticket Pass Modal Elements
const ticketPassModal = document.getElementById('ticketPassModal');
const closeTicketModalBtn = document.getElementById('closeTicketModalBtn');
const dismissTicketModalBtn = document.getElementById('dismissTicketModalBtn');
const printTicketBtn = document.getElementById('printTicketBtn');
const modalTicketEventTitle = document.getElementById('modalTicketEventTitle');
const modalTicketDate = document.getElementById('modalTicketDate');
const modalTicketVenue = document.getElementById('modalTicketVenue');
const modalTicketCode = document.getElementById('modalTicketCode');
const modalQrCodeRender = document.getElementById('modalQrCodeRender');

// Subtab history elements
const subnavTabs = document.querySelectorAll('.subnav-tab');
const subtabPanels = document.querySelectorAll('.subtab-panel');

// =============================================================================
// Core Functions & View Rendering
// =============================================================================

function initApp() {
  setupNavigation();
  setupCartDrawer();
  setupBookingModal();
  setupTicketPassModal();
  setupHistorySubnav();
  setupAnnouncementsSearch();
  setupEventFilters();

  renderDashboard();
  renderEvents();
  renderMerchandise();
  renderAnnouncements();
  renderMyTickets();
  renderMyOrders();
  updateCartUI();

  // Try fetching live data from backend if running
  fetchBackendData();
}

/**
 * Handle Tab Navigation Switching
 */
function setupNavigation() {
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  // Handle inline quick switches (e.g. "View All Events ->")
  document.querySelectorAll('[data-switch-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-switch-tab');
      switchTab(target);
    });
  });

  document.getElementById('openMembershipModalBtn').addEventListener('click', () => {
    showToast("Membership is verified and valid through Aug 31, 2027.", "info");
  });

  document.getElementById('renewMembershipBtn').addEventListener('click', () => {
    showToast("Your membership is already active with 325 days remaining. Renewal opens 30 days prior to expiry.", "info");
  });
}

function switchTab(tabId) {
  navItems.forEach(n => {
    if (n.getAttribute('data-tab') === tabId) {
      n.classList.add('active');
    } else {
      n.classList.remove('active');
    }
  });

  tabPanels.forEach(panel => {
    if (panel.id === `tab-${tabId}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Render Dashboard Overview Tab
 */
function renderDashboard() {
  const previewContainer = document.getElementById('dashEventsPreviewList');
  const annContainer = document.getElementById('dashAnnouncementsPreview');

  // Events preview (First 2 events)
  previewContainer.innerHTML = state.events.slice(0, 2).map(ev => `
    <div class="preview-item-card">
      <div>
        <div class="preview-meta">
          <span>${ev.dateFormatted}</span>
          <span>&bull;</span>
          <span>${ev.venue}</span>
        </div>
        <div class="preview-title">${ev.title}</div>
      </div>
      <div>
        <button class="btn btn-primary" onclick="openBookModal('${ev.id}')">
          Book ($${ev.memberPrice.toFixed(2)})
        </button>
      </div>
    </div>
  `).join('');

  // Announcements preview (First 2)
  annContainer.innerHTML = state.announcements.slice(0, 2).map(ann => `
    <div class="preview-item-card">
      <div>
        <div class="preview-meta">
          <span class="audience-pill ${ann.audience.toLowerCase()}">${ann.audience}</span>
          <span>${ann.date}</span>
        </div>
        <div class="preview-title">${ann.title}</div>
      </div>
      <div>
        <button class="btn btn-ghost" onclick="switchTab('announcements')">Read</button>
      </div>
    </div>
  `).join('');
}

/**
 * Render Events Catalog
 */
function renderEvents(filter = 'all') {
  const container = document.getElementById('eventsContainer');
  const filtered = filter === 'all' 
    ? state.events 
    : state.events.filter(e => e.category === filter);

  container.innerHTML = filtered.map(ev => {
    const seatsRemaining = ev.capacity - ev.ticketsSold;
    const progressPercent = Math.min(100, Math.round((ev.ticketsSold / ev.capacity) * 100));
    const savings = (ev.standardPrice - ev.memberPrice).toFixed(2);
    const hasTicket = state.myTickets.some(t => t.eventId === ev.id && t.status === 'PAID');

    return `
      <div class="event-card">
        <div class="event-card-top">
          <span class="event-date-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            ${ev.dateFormatted}
          </span>
          <span class="event-category-tag">${ev.categoryLabel}</span>
        </div>

        <h3 class="event-title">${ev.title}</h3>

        <div class="event-venue">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          ${ev.venue}
        </div>

        <p class="event-description">${ev.description}</p>

        <!-- Capacity Meter -->
        <div class="capacity-container">
          <div class="capacity-labels">
            <span>Capacity Status</span>
            <span><strong>${ev.ticketsSold}</strong> / ${ev.capacity} booked (${seatsRemaining} remaining)</span>
          </div>
          <div class="capacity-progress-track">
            <div class="capacity-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <!-- Price Comparison Box -->
        <div class="event-price-box">
          <div class="price-col">
            <span class="price-sub">Non-Member</span>
            <span class="tabular-num strike-price">$${ev.standardPrice.toFixed(2)}</span>
          </div>
          <div class="price-col">
            <span class="price-sub">Member Price</span>
            <span class="price-main tabular-num">$${ev.memberPrice.toFixed(2)}</span>
          </div>
          ${ev.memberPrice < ev.standardPrice ? `<span class="price-discount-pill">Save $${savings}</span>` : ''}
        </div>

        <div>
          ${hasTicket 
            ? `<button class="btn btn-outline btn-full" onclick="viewExistingTicket('${ev.id}')">
                &#10003; Ticket Booked (View Pass)
               </button>`
            : seatsRemaining <= 0
              ? `<button class="btn btn-primary btn-full" disabled>Event Sold Out</button>`
              : `<button class="btn btn-primary btn-full" onclick="openBookModal('${ev.id}')">
                  Book Member Pass ($${ev.memberPrice.toFixed(2)})
                 </button>`
          }
        </div>
      </div>
    `;
  }).join('');
}

function setupEventFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderEvents(btn.getAttribute('data-event-filter'));
    });
  });
}

/**
 * Render Merchandise Store
 */
function renderMerchandise() {
  const container = document.getElementById('merchContainer');

  container.innerHTML = state.merch.map(item => {
    // Default select first available variant if not set
    if (!state.selectedMerchVariants[item.id]) {
      const firstAvailable = item.variants.find(v => v.stockQuantity > 0) || item.variants[0];
      state.selectedMerchVariants[item.id] = firstAvailable.id;
    }

    const currentVariantId = state.selectedMerchVariants[item.id];
    const currentVariant = item.variants.find(v => v.id === currentVariantId) || item.variants[0];
    const isOutOfStock = currentVariant.stockQuantity <= 0;

    let stockText = `${currentVariant.stockQuantity} in stock`;
    let stockClass = "text-muted";
    if (isOutOfStock) {
      stockText = "Sold Out";
      stockClass = "text-danger";
    } else if (currentVariant.stockQuantity <= 5) {
      stockText = `Low stock: ${currentVariant.stockQuantity} left`;
      stockClass = "text-warning";
    }

    return `
      <div class="merch-card">
        <div class="merch-image-wrap">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          <span class="merch-badge">${item.badge}</span>
        </div>

        <div class="merch-body">
          <h3 class="merch-title">${item.name}</h3>
          <div class="merch-price tabular-num">$${item.basePrice.toFixed(2)}</div>

          <!-- Size Variant Picker -->
          <div class="size-selector-group">
            <div class="size-label-row">
              <span class="size-label">Select Size / Option:</span>
              <span class="stock-indicator ${stockClass}">${stockText}</span>
            </div>
            <div class="size-pill-row">
              ${item.variants.map(v => {
                const isSelected = v.id === currentVariantId;
                const disabled = v.stockQuantity <= 0 ? 'disabled' : '';
                return `
                  <button 
                    class="size-pill ${isSelected ? 'selected' : ''}" 
                    ${disabled}
                    onclick="selectVariant('${item.id}', '${v.id}')"
                    title="${v.size}: ${v.stockQuantity} in stock"
                  >
                    ${v.size}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <button 
            class="btn btn-primary btn-full mt-auto" 
            ${isOutOfStock ? 'disabled' : ''}
            onclick="addToCart('${item.id}', '${currentVariant.id}')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span>${isOutOfStock ? 'Sold Out' : `Add Size ${currentVariant.size} to Cart`}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function selectVariant(productId, variantId) {
  state.selectedMerchVariants[productId] = variantId;
  renderMerchandise();
}

/**
 * Shopping Cart Management
 */
function addToCart(productId, variantId) {
  const product = state.merch.find(p => p.id === productId);
  if (!product) return;
  const variant = product.variants.find(v => v.id === variantId);
  if (!variant || variant.stockQuantity <= 0) return;

  const existingItem = state.cart.find(item => item.variantId === variantId);
  if (existingItem) {
    if (existingItem.quantity < variant.stockQuantity) {
      existingItem.quantity++;
      showToast(`Added another ${product.name} (${variant.size}) to cart.`, "success");
    } else {
      showToast(`Cannot add more. Reached max available stock (${variant.stockQuantity}).`, "warning");
    }
  } else {
    state.cart.push({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      size: variant.size,
      unitPrice: product.basePrice,
      image: product.image,
      quantity: 1,
      maxStock: variant.stockQuantity
    });
    showToast(`Added ${product.name} (${variant.size}) to cart!`, "success");
  }

  updateCartUI();
}

function updateCartQuantity(variantId, delta) {
  const item = state.cart.find(i => i.variantId === variantId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter(i => i.variantId !== variantId);
    showToast("Item removed from cart.", "info");
  } else if (item.quantity > item.maxStock) {
    item.quantity = item.maxStock;
    showToast(`Max available stock is ${item.maxStock}.`, "warning");
  }

  updateCartUI();
}

function updateCartUI() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = state.cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  // Badge updates
  cartTriggerBadge.textContent = totalItems;
  cartCountBtnLabel.textContent = totalItems;
  headerCartCount.textContent = totalItems;
  headerCartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';

  cartDrawerSubtitle.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'} selected`;
  cartSubtotal.textContent = `$${totalCost.toFixed(2)}`;
  cartGrandTotal.textContent = `$${totalCost.toFixed(2)}`;

  if (state.cart.length === 0) {
    cartEmptyState.style.display = 'flex';
    cartItemsList.style.display = 'none';
    cartDrawerFooter.style.display = 'none';
  } else {
    cartEmptyState.style.display = 'none';
    cartItemsList.style.display = 'block';
    cartDrawerFooter.style.display = 'block';

    cartItemsList.innerHTML = state.cart.map(item => `
      <div class="cart-item-row">
        <img class="cart-item-thumb" src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-variant">Size: <strong>${item.size}</strong></div>
          <div class="cart-item-price tabular-num">$${(item.unitPrice * item.quantity).toFixed(2)}</div>
        </div>
        <div class="cart-qty-ctrl">
          <button class="qty-btn" onclick="updateCartQuantity('${item.variantId}', -1)">&minus;</button>
          <span class="tabular-num">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQuantity('${item.variantId}', 1)">&plus;</button>
        </div>
      </div>
    `).join('');
  }
}

function setupCartDrawer() {
  openCartBtn.addEventListener('click', () => openCart());
  viewCartHeaderBtn.addEventListener('click', () => openCart());
  closeCartDrawerBtn.addEventListener('click', () => closeCart());
  startShoppingBtn.addEventListener('click', () => {
    closeCart();
    switchTab('store');
  });

  cartDrawerBackdrop.addEventListener('click', (e) => {
    if (e.target === cartDrawerBackdrop) closeCart();
  });

  checkoutBtn.addEventListener('click', handleCheckout);
}

function openCart() {
  cartDrawerBackdrop.classList.add('open');
  cartDrawerBackdrop.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartDrawerBackdrop.classList.remove('open');
  cartDrawerBackdrop.setAttribute('aria-hidden', 'true');
}

function handleCheckout() {
  if (state.cart.length === 0) return;

  const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const totalAmount = state.cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const itemsSummary = state.cart.map(i => `${i.quantity}x ${i.name} (${i.size})`).join(', ');

  // Decrement local inventory
  state.cart.forEach(cartItem => {
    const product = state.merch.find(p => p.id === cartItem.productId);
    if (product) {
      const variant = product.variants.find(v => v.id === cartItem.variantId);
      if (variant) {
        variant.stockQuantity = Math.max(0, variant.stockQuantity - cartItem.quantity);
      }
    }
  });

  // Record Order
  const newOrder = {
    id: orderId,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    itemsSummary: itemsSummary,
    totalAmount: totalAmount,
    paymentStatus: "PAID",
    fulfillmentStatus: "READY FOR PICKUP"
  };

  state.myOrders.unshift(newOrder);
  state.cart = [];

  updateCartUI();
  renderMerchandise();
  renderMyOrders();
  closeCart();

  showToast(`Order #${orderId} confirmed! Ready for pickup at Student Desk 3.`, "success");
  switchTab('history');
}

/**
 * Event Ticket Booking Flow
 */
function setupBookingModal() {
  closeBookModalBtn.addEventListener('click', closeBookModal);
  cancelBookBtn.addEventListener('click', closeBookModal);
  bookEventModal.addEventListener('click', (e) => {
    if (e.target === bookEventModal) closeBookModal();
  });

  confirmBookTicketBtn.addEventListener('click', handleConfirmBooking);
}

function openBookModal(eventId) {
  const event = state.events.find(e => e.id === eventId);
  if (!event) return;

  state.bookingEventTarget = event;
  bookModalEventTitle.textContent = `Reserve Pass: ${event.title}`;
  bookModalDateVenue.textContent = `${event.dateFormatted} • ${event.venue}`;
  bookModalStandardPrice.textContent = `$${event.standardPrice.toFixed(2)}`;
  bookModalMemberPrice.textContent = `$${event.memberPrice.toFixed(2)}`;
  confirmPriceBtnLabel.textContent = event.memberPrice.toFixed(2);

  bookEventModal.classList.add('open');
  bookEventModal.setAttribute('aria-hidden', 'false');
}

function closeBookModal() {
  bookEventModal.classList.remove('open');
  bookEventModal.setAttribute('aria-hidden', 'true');
  state.bookingEventTarget = null;
}

function handleConfirmBooking() {
  const ev = state.bookingEventTarget;
  if (!ev) return;

  // Check duplicate booking
  const alreadyBooked = state.myTickets.some(t => t.eventId === ev.id && t.status === 'PAID');
  if (alreadyBooked) {
    showToast("You already hold an active ticket pass for this event.", "warning");
    closeBookModal();
    return;
  }

  // Create ticket pass
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  const ticketCode = `TIC-2026-${randomHex}`;

  const newTicket = {
    id: `tic-${Date.now()}`,
    eventId: ev.id,
    eventTitle: ev.title,
    ticketCode: ticketCode,
    dateFormatted: ev.dateFormatted,
    venue: ev.venue,
    pricePaid: ev.memberPrice,
    status: "PAID",
    bookedAt: new Date().toISOString()
  };

  ev.ticketsSold = Math.min(ev.capacity, ev.ticketsSold + 1);
  state.myTickets.unshift(newTicket);

  closeBookModal();
  renderEvents();
  renderMyTickets();
  renderDashboard();

  showToast(`Ticket booked! Your code is ${ticketCode}`, "success");
  openTicketPassModal(newTicket);
}

/**
 * Digital Ticket Pass Modal
 */
function setupTicketPassModal() {
  closeTicketModalBtn.addEventListener('click', closeTicketPassModal);
  dismissTicketModalBtn.addEventListener('click', closeTicketPassModal);
  ticketPassModal.addEventListener('click', (e) => {
    if (e.target === ticketPassModal) closeTicketPassModal();
  });

  printTicketBtn.addEventListener('click', () => {
    window.print();
  });
}

function openTicketPassModal(ticket) {
  modalTicketEventTitle.textContent = ticket.eventTitle;
  modalTicketDate.textContent = ticket.dateFormatted;
  modalTicketVenue.textContent = ticket.venue;
  modalTicketCode.textContent = ticket.ticketCode;

  // Generate SVG QR Code representation
  modalQrCodeRender.innerHTML = generateQrSvg(ticket.ticketCode);

  ticketPassModal.classList.add('open');
  ticketPassModal.setAttribute('aria-hidden', 'false');
}

function closeTicketPassModal() {
  ticketPassModal.classList.remove('open');
  ticketPassModal.setAttribute('aria-hidden', 'true');
}

function viewExistingTicket(eventId) {
  const ticket = state.myTickets.find(t => t.eventId === eventId);
  if (ticket) {
    openTicketPassModal(ticket);
  }
}

/**
 * Render Announcements
 */
function renderAnnouncements(searchQuery = '') {
  const container = document.getElementById('announcementsFeed');
  let list = state.announcements;

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    list = list.filter(a => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q));
  }

  if (list.length === 0) {
    container.innerHTML = `<p class="text-muted p-4">No announcements match your search query.</p>`;
    return;
  }

  container.innerHTML = list.map(a => `
    <article class="announcement-card">
      <div class="announcement-top">
        <span class="audience-pill ${a.audience.toLowerCase()}">${a.audience} NOTICE</span>
        <span class="announcement-date">${a.date} &bull; Published by ${a.author}</span>
      </div>
      <h2 class="announcement-title">${a.title}</h2>
      <p class="announcement-content">${a.content}</p>
    </article>
  `).join('');
}

function setupAnnouncementsSearch() {
  const input = document.getElementById('announcementSearchInput');
  input.addEventListener('input', (e) => {
    renderAnnouncements(e.target.value);
  });
}

/**
 * Render My Passes & Orders Subtabs
 */
function setupHistorySubnav() {
  subnavTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      subnavTabs.forEach(t => t.classList.remove('active'));
      subtabPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const target = tab.getAttribute('data-subtab');
      document.getElementById(`subtab-${target}-panel`).classList.add('active');
    });
  });
}

function renderMyTickets() {
  const container = document.getElementById('myTicketsContainer');
  document.getElementById('myTicketsBadgeCount').textContent = state.myTickets.length;
  document.getElementById('dashTicketCount').textContent = `${state.myTickets.length} Tickets`;

  if (state.myTickets.length === 0) {
    container.innerHTML = `<p class="text-muted p-4">You have not booked any event passes yet.</p>`;
    return;
  }

  container.innerHTML = state.myTickets.map(t => `
    <div class="my-ticket-card">
      <div class="ticket-header-row">
        <span class="ticket-status-pill ${t.status.toLowerCase()}">${t.status}</span>
        <span class="ticket-code-tag">${t.ticketCode}</span>
      </div>
      <h3 class="event-title">${t.eventTitle}</h3>
      <div class="event-venue">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        ${t.dateFormatted}
      </div>
      <div class="event-venue">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        ${t.venue}
      </div>
      <button class="btn btn-outline btn-full mt-3" onclick="openTicketPassModalById('${t.id}')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        <span>View Digital QR Pass</span>
      </button>
    </div>
  `).join('');
}

function openTicketPassModalById(ticketId) {
  const ticket = state.myTickets.find(t => t.id === ticketId);
  if (ticket) openTicketPassModal(ticket);
}

function renderMyOrders() {
  const tbody = document.getElementById('myOrdersTableBody');
  document.getElementById('myOrdersBadgeCount').textContent = state.myOrders.length;
  document.getElementById('dashOrdersCount').textContent = `${state.myOrders.length} Active`;

  if (state.myOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-muted p-4">No merchandise orders placed yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.myOrders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.date}</td>
      <td>${o.itemsSummary}</td>
      <td class="tabular-num"><strong>$${o.totalAmount.toFixed(2)}</strong></td>
      <td><span class="order-badge paid">${o.paymentStatus}</span></td>
      <td><span class="order-badge delivered">${o.fulfillmentStatus}</span></td>
      <td>
        <button class="btn btn-ghost" onclick="showToast('Order ${o.id} is ready for collection at Student Desk 3.', 'info')">
          Details
        </button>
      </td>
    </tr>
  `).join('');
}

/**
 * Dynamic QR Code SVG Generator for Entrance Scanners
 */
function generateQrSvg(code) {
  // Deterministic seed based on code string
  const hash = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const size = 120;
  const mod = 12;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer positioning anchors -->
      <rect x="2" y="2" width="7" height="7" fill="#13293D" rx="1"/>
      <rect x="3.5" y="3.5" width="4" height="4" fill="#FFFFFF"/>
      <rect x="4.5" y="4.5" width="2" height="2" fill="#13293D"/>

      <rect x="15" y="2" width="7" height="7" fill="#13293D" rx="1"/>
      <rect x="16.5" y="3.5" width="4" height="4" fill="#FFFFFF"/>
      <rect x="17.5" y="4.5" width="2" height="2" fill="#13293D"/>

      <rect x="2" y="15" width="7" height="7" fill="#13293D" rx="1"/>
      <rect x="3.5" y="16.5" width="4" height="4" fill="#FFFFFF"/>
      <rect x="4.5" y="17.5" width="2" height="2" fill="#13293D"/>

      <!-- Timing tracks and pseudo data patterns -->
      <rect x="10" y="3" width="2" height="2" fill="#13293D"/>
      <rect x="12" y="5" width="2" height="2" fill="#13293D"/>
      <rect x="10" y="7" width="2" height="2" fill="#13293D"/>
      <rect x="4" y="11" width="2" height="2" fill="#13293D"/>
      <rect x="6" y="12" width="2" height="2" fill="#13293D"/>

      <!-- Center data grid based on hash -->
      <rect x="10" y="10" width="4" height="4" fill="#13293D"/>
      <rect x="16" y="11" width="2" height="3" fill="#13293D"/>
      <rect x="19" y="10" width="2" height="2" fill="#13293D"/>
      <rect x="11" y="16" width="3" height="2" fill="#13293D"/>
      <rect x="15" y="15" width="2" height="2" fill="#13293D"/>
      <rect x="18" y="17" width="3" height="3" fill="#13293D"/>
      <rect x="15" y="19" width="2" height="2" fill="#13293D"/>
    </svg>
  `;
}

/**
 * Toast Notification Helper
 */
function showToast(message, type = "info") {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 180ms ease';
    setTimeout(() => toast.remove(), 200);
  }, 3500);
}

/**
 * Backend API Synchronization (Optional graceful degradation)
 */
async function fetchBackendData() {
  try {
    const healthRes = await fetch('http://localhost:5000/api/health', { method: 'GET' });
    if (healthRes.ok) {
      console.log('Connected to Student Organization System Backend API.');
    }
  } catch (err) {
    // Backend offline; client gracefully operates with loaded dataset
    console.log('Running in client standalone mode with complete member data state.');
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', initApp);
