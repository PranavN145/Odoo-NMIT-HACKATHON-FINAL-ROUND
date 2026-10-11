/**
 * Shopping Bag Drawer Component
 * Skyline Student Association Platform
 */

import { MERCH_DATA } from "../data/merchandise.js";

let cartItems = [];

export function initCartDrawer() {
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

export function addToCart(itemId, merchList = MERCH_DATA) {
  const item = merchList.find((m) => m.id === itemId);
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

  const overlay = document.getElementById("cartDrawerOverlay");
  if (overlay) overlay.classList.add("open");
}

export function removeFromCart(itemId) {
  cartItems = cartItems.filter((ci) => ci.id !== itemId);
  updateCartUI();
}

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
        <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--color-border-subtle);">
          <div>
            <div style="font-size: 0.875rem; font-weight: 600; color: var(--color-navy);">${item.name}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Qty: ${item.qty} × ₹${item.price} = ₹${itemTotal}</div>
          </div>
          <button type="button" class="cart-item-remove" data-remove-id="${item.id}" style="background: transparent; border: none; color: var(--color-error); font-size: 0.75rem; cursor: pointer;">Remove</button>
        </div>
      `;
    })
    .join("");

  const discount = Math.round(subtotal * 0.15);
  const total = subtotal - discount;

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (totalEl) totalEl.textContent = `₹${total}`;
}

export function handleCheckout() {
  if (cartItems.length === 0) {
    alert("Please add merchandise items to your bag before checkout.");
    return;
  }
  alert("Merchandise order preview. In production, this integrates with the official backend order endpoint.");
  cartItems = [];
  updateCartUI();
  const overlay = document.getElementById("cartDrawerOverlay");
  if (overlay) overlay.classList.remove("open");
}
