/**
 * Skyline Student Association — User Portal Application Logic
 * Coordinates Events, Merchandise, Past Participation, and Membership Pricing views.
 */

// Global User State
let currentUser = {
  name: "Jordan Lee",
  email: "user@demo.in",
  role: "USER",
  isMember: false
};

// Initial Participation Data
let userParticipations = [
  {
    eventTitle: "GitHub & Open Source Workshop",
    date: "Oct 10, 2026",
    ticketRef: "#TKT-74102",
    tier: "Standard (₹499)",
    status: "Confirmed · Ready",
    statusClass: "pill-active",
    venue: "Lab 304, Skyline Campus"
  },
  {
    eventTitle: "Annual Hackathon Winter 2025",
    date: "Nov 14, 2025",
    ticketRef: "#TKT-48921",
    tier: "Participant (Free)",
    status: "Attended · Completed",
    statusClass: "pill-attended",
    venue: "Main Auditorium"
  },
  {
    eventTitle: "Tech Leaders Speaker Series #3",
    date: "Aug 22, 2025",
    ticketRef: "#TKT-31209",
    tier: "Attendee (Free)",
    status: "Attended",
    statusClass: "pill-attended",
    venue: "Seminar Hall 2"
  }
];

let selectedHoodieSize = 'M';

// On Page Load: Initialize User Session & Views
document.addEventListener('DOMContentLoaded', () => {
  initUserSession();
});

function initUserSession() {
  const sessionData = sessionStorage.getItem('skyline_user_auth');
  if (sessionData) {
    try {
      const parsed = JSON.parse(sessionData);
      if (parsed.name) currentUser.name = parsed.name;
      if (parsed.email) currentUser.email = parsed.email;
      if (parsed.role) currentUser.role = parsed.role;
      if (parsed.isMember) currentUser.isMember = true;
    } catch (e) {
      console.warn("Failed to parse user session", e);
    }
  }

  // Update DOM elements with user info
  const nameEl = document.getElementById('userDisplayName');
  const emailEl = document.getElementById('userDisplayEmail');
  const avatarEl = document.getElementById('userAvatarText');
  const headerBadge = document.getElementById('userHeaderRoleBadge');

  if (nameEl) nameEl.textContent = currentUser.name;
  if (emailEl) emailEl.textContent = currentUser.email;

  // Set avatar initials (e.g. "Jordan Lee" -> "JL")
  if (avatarEl && currentUser.name) {
    const parts = currentUser.name.trim().split(' ');
    const initials = parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
    avatarEl.textContent = initials;
  }

  if (headerBadge && currentUser.isMember) {
    headerBadge.textContent = 'Skyline Member';
    headerBadge.style.background = '#DEF7EC';
    headerBadge.style.color = '#03543F';
  }

  const buyerNameInput = document.getElementById('modalHoodieBuyerName');
  if (buyerNameInput) buyerNameInput.value = currentUser.name;
}

// Tab Switching Handler
function switchUserTab(tabName) {
  const tabs = ['events', 'merchandise', 'participation', 'pricing'];
  
  tabs.forEach(t => {
    const panel = document.getElementById(`tab-${t}`);
    const navBtn = document.querySelector(`.nav-item[data-tab="${t}"]`);
    
    if (panel) {
      panel.style.display = (t === tabName) ? 'block' : 'none';
      if (t === tabName) panel.classList.add('active');
      else panel.classList.remove('active');
    }
    
    if (navBtn) {
      if (t === tabName) navBtn.classList.add('active');
      else navBtn.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Hoodie Size Selection
function selectUserSize(size, btn) {
  selectedHoodieSize = size;
  const buttons = document.querySelectorAll('#hoodieSizeSelector .size-tag-btn');
  buttons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const sizeSelect = document.getElementById('modalHoodieSizeSelect');
  if (sizeSelect) sizeSelect.value = size;
}

// Hoodie Order Modal Controls
function openOrderHoodieModal() {
  const sizeSelect = document.getElementById('modalHoodieSizeSelect');
  if (sizeSelect) sizeSelect.value = selectedHoodieSize;

  const priceSummary = document.getElementById('modalHoodiePriceSummary');
  if (priceSummary) {
    priceSummary.textContent = currentUser.isMember ? '₹899 (Member Rate)' : '₹1,299 (Guest Rate)';
  }

  document.getElementById('orderHoodieModal').classList.add('open');
}

function closeOrderHoodieModal() {
  document.getElementById('orderHoodieModal').classList.remove('open');
}

function submitHoodieOrder(e) {
  e.preventDefault();
  const size = document.getElementById('modalHoodieSizeSelect').value;
  const name = document.getElementById('modalHoodieBuyerName').value;
  const pickup = document.getElementById('modalHoodiePickupSelect').value;
  const orderId = '#ORD-' + Math.floor(1000 + Math.random() * 9000);

  closeOrderHoodieModal();
  alert(`Order Confirmed! Ref: ${orderId}\n\nItem: Skyline Navy Hoodie (Size ${size})\nReserved for: ${name}\nPickup: ${pickup === 'desk' ? 'Main Council Desk' : 'Hostel Dispatch Desk'}`);
}

// Digital Pass Modal Controls
function viewDigitalPass(eventTitle, ref, timeVenue, lab) {
  document.getElementById('modalPassEventTitle').textContent = eventTitle;
  document.getElementById('modalPassRef').textContent = ref;
  document.getElementById('modalPassAttendeeName').textContent = currentUser.name;
  document.getElementById('modalPassTimeVenue').textContent = `${timeVenue} · ${lab}`;
  document.getElementById('digitalPassModal').classList.add('open');
}

function closeDigitalPassModal() {
  document.getElementById('digitalPassModal').classList.remove('open');
}

// Certificate Mock Download
function downloadCertMock(eventName) {
  alert(`Official Certificate of Participation for "${eventName}" verified for ${currentUser.name}.\n\nYour PDF certificate has been prepared.`);
}

// Event Registration Flow
function openEventRegisterModal(title, date, guestPrice, memberPrice) {
  const price = currentUser.isMember ? memberPrice : guestPrice;
  const rateLabel = currentUser.isMember ? 'Member Rate' : 'Standard Rate';

  const confirmRegistration = confirm(
    `Register for ${title}?\n\nDate: ${date}\nPrice: ₹${price} (${rateLabel})\nAttendee: ${currentUser.name}\n\nClick OK to confirm registration and reserve your ticket.`
  );

  if (confirmRegistration) {
    const ticketRef = '#TKT-' + Math.floor(50000 + Math.random() * 40000);
    
    // Add to user participations
    userParticipations.unshift({
      eventTitle: title,
      date: date,
      ticketRef: ticketRef,
      tier: currentUser.isMember ? `Member (₹${memberPrice})` : `Standard (₹${guestPrice})`,
      status: "Confirmed · Ready",
      statusClass: "pill-active",
      venue: "Skyline Campus"
    });

    renderParticipationTable();

    // Switch to participation tab
    switchUserTab('participation');
    viewDigitalPass(title, ticketRef, date, "Campus Entrance Gate 1");
  }
}

function renderParticipationTable() {
  const tbody = document.getElementById('participationTableBody');
  if (!tbody) return;

  tbody.innerHTML = userParticipations.map(p => `
    <tr style="border-bottom: 1px solid var(--color-border-subtle);">
      <td style="padding: 14px; font-weight: 600; color: var(--color-navy);">${p.eventTitle}</td>
      <td style="padding: 14px; color: var(--color-text-muted);">${p.date}</td>
      <td style="padding: 14px; font-family: monospace; font-weight: 600;">${p.ticketRef}</td>
      <td style="padding: 14px;">${p.tier}</td>
      <td style="padding: 14px;">
        <span style="background: ${p.status.includes('Confirmed') ? '#DEF7EC' : '#F1F5F9'}; color: ${p.status.includes('Confirmed') ? '#03543F' : 'var(--color-navy)'}; font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 4px;">
          ${p.status}
        </span>
      </td>
      <td style="padding: 14px; text-align: right;">
        <button type="button" class="btn-baltic-primary" style="height: 28px; padding: 0 10px; font-size: 0.75rem;" onclick="viewDigitalPass('${p.eventTitle}', '${p.ticketRef}', '${p.date}', '${p.venue}')">
          View Digital Pass
        </button>
      </td>
    </tr>
  `).join('');

  const badge = document.getElementById('participationBadge');
  if (badge) badge.textContent = userParticipations.length;
}

// Membership Upgrade Modal Controls
function openUpgradeMembershipModal() {
  document.getElementById('upgradeModal').classList.add('open');
}

function closeUpgradeModal() {
  document.getElementById('upgradeModal').classList.remove('open');
}

function handleUpgradeSubmit(e) {
  e.preventDefault();
  currentUser.isMember = true;

  // Persist in session
  const session = JSON.parse(sessionStorage.getItem('skyline_user_auth') || '{}');
  session.isMember = true;
  sessionStorage.setItem('skyline_user_auth', JSON.stringify(session));

  closeUpgradeModal();
  initUserSession();

  alert(`Congratulations ${currentUser.name}!\n\nYour Skyline Student Membership has been activated.\nAll member discount pricing is now enabled.`);
  switchUserTab('events');
}

// User Sign Out Handler
function handleUserLogout() {
  sessionStorage.removeItem('skyline_user_auth');
  window.location.href = './login.html';
}
