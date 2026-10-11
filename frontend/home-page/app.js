/**
 * Skyline Student Association — Public Frontend Orchestrator
 * Clean Modular Architecture
 */

import { fetchEventsData } from "./js/data/events.js";
import { fetchMerchandiseData } from "./js/data/merchandise.js";
import { initHeaderComponent } from "./js/components/header.js";
import { renderEventsGrid } from "./js/components/eventCard.js";
import { renderMerchGrid } from "./js/components/merchCard.js";
import { initRegistrationModal, openRegistrationModal } from "./js/components/registrationModal.js";
import { initMerchandiseModal, openMerchandiseModal } from "./js/components/merchandiseModal.js";
import { initCartDrawer, addToCart, removeFromCart, handleCheckout } from "./js/components/cartDrawer.js";

// State Management
let currentEventCategory = "all";
let currentMerchCategory = "all";
let currentSearchQuery = "";
let eventsList = [];
let merchList = [];
let isEventsLoading = true;

document.addEventListener("DOMContentLoaded", async () => {
  initHeaderComponent();
  initRegistrationModal();
  initMerchandiseModal();
  initCartDrawer();
  initSearch();
  initEventFilters();
  initMerchFilters();
  initGlobalEventDelegation();

  const hasEventsGrid = !!document.getElementById("eventsGrid");
  const hasMerchGrid = !!document.getElementById("merchGrid");

  const fetchPromises = [];
  if (hasEventsGrid) fetchPromises.push(fetchEventsData());
  else fetchPromises.push(Promise.resolve({ events: [], isFromApi: false }));

  if (hasMerchGrid) fetchPromises.push(fetchMerchandiseData());
  else fetchPromises.push(Promise.resolve({ merchandise: [], isFromApi: false }));

  const [eventsResult, merchResult] = await Promise.all(fetchPromises);

  eventsList = eventsResult.events || [];
  merchList = merchResult.merchandise || [];
  isEventsLoading = false;

  renderEvents();
  renderMerchandise();
});

function renderEvents() {
  const grid = document.getElementById("eventsGrid");
  if (grid) {
    renderEventsGrid(grid, eventsList, currentEventCategory, currentSearchQuery, isEventsLoading);
  }
}

function renderMerchandise() {
  const grid = document.getElementById("merchGrid");
  if (grid) {
    renderMerchGrid(grid, merchList, currentMerchCategory, currentSearchQuery);
  }
}

function initEventFilters() {
  const programSelect = document.getElementById("programFilterSelect");
  const modeSelect = document.getElementById("modeFilterSelect");

  if (programSelect) {
    programSelect.addEventListener("change", (e) => {
      currentEventCategory = e.target.value;
      renderEvents();
    });
  }

  if (modeSelect) {
    modeSelect.addEventListener("change", (e) => {
      const modeVal = e.target.value;
      renderEvents();
    });
  }

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

function initSearch() {
  const searchInput = document.getElementById("globalSearchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    currentSearchQuery = e.target.value.trim().toLowerCase();
    renderEvents();
    renderMerchandise();
  });
}

function initGlobalEventDelegation() {
  document.addEventListener("click", (e) => {
    // Event card "Register" button click
    const regBtn = e.target.closest("[data-event-id]");
    if (regBtn) {
      const eventId = regBtn.getAttribute("data-event-id");
      const targetEvent = eventsList.find((ev) => ev.id === eventId);
      if (targetEvent) {
        openRegistrationModal(targetEvent);
      }
      return;
    }

    // Merch card click: open details and purchase modal
    const merchBtn = e.target.closest("[data-merch-id]");
    if (merchBtn) {
      const merchId = merchBtn.getAttribute("data-merch-id");
      const targetMerch = merchList.find((m) => m.id === merchId);
      if (targetMerch) {
        openMerchandiseModal(targetMerch);
      }
      return;
    }

    // Cart remove item click
    const removeBtn = e.target.closest("[data-remove-id]");
    if (removeBtn) {
      const removeId = removeBtn.getAttribute("data-remove-id");
      removeFromCart(removeId);
      return;
    }
  });

  // Keyboard accessibility for cards
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target && e.target.classList.contains("clickable-card")) {
      const eventId = e.target.getAttribute("data-event-id");
      if (eventId) {
        e.preventDefault();
        const targetEvent = eventsList.find((ev) => ev.id === eventId);
        if (targetEvent) {
          openRegistrationModal(targetEvent);
        }
        return;
      }
      const merchId = e.target.getAttribute("data-merch-id");
      if (merchId) {
        e.preventDefault();
        const targetMerch = merchList.find((m) => m.id === merchId);
        if (targetMerch) {
          openMerchandiseModal(targetMerch);
        }
        return;
      }
    }
  });

  // Global handler for checkout preview
  window.handleCheckout = handleCheckout;
}
