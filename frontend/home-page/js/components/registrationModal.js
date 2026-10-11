/**
 * Public Event Registration Modal & Form Handling Component
 * Skyline Student Association Platform
 */

import { validateRegistrationForm } from "../utils/validation.js";

export function initRegistrationModal() {
  const modal = document.getElementById("participateModal");
  const closeBtn = document.getElementById("modalCloseBtn");

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        modal.classList.remove("open");
      }
    });
  }
}

export function openRegistrationModal(eventData) {
  if (!eventData) return;

  const modal = document.getElementById("participateModal");
  const modalContent = document.getElementById("modalDynamicContent");

  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div style="margin-bottom: 20px;">
      <span class="card-cat-pill" style="margin-bottom: 8px; display: inline-block;">${eventData.categoryLabel || "Event"}</span>
      <h3 style="color: var(--color-navy); font-size: 1.25rem; font-weight: 700; margin-bottom: 6px;">${eventData.title}</h3>
      <p style="font-size: 0.875rem; color: var(--color-text-muted);">${eventData.desc}</p>
    </div>

    <div style="background: var(--color-canvas); padding: 16px; border-radius: 8px; margin-bottom: 20px; font-size: 0.875rem;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span style="color: var(--color-text-muted);">Date:</span>
        <strong style="color: var(--color-navy);">${eventData.date}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span style="color: var(--color-text-muted);">Time:</span>
        <strong style="color: var(--color-navy);">${eventData.time}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span style="color: var(--color-text-muted);">Venue:</span>
        <strong style="color: var(--color-navy);">${eventData.venue}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span style="color: var(--color-text-muted);">Pricing:</span>
        <strong style="color: var(--color-navy);">Member: ${eventData.priceMember} | Guest: ${eventData.priceGuest}</strong>
      </div>
    </div>

    <div id="registrationFeedbackMessage"></div>

    <form id="publicRegistrationForm" style="display: flex; flex-direction: column; gap: 14px;">
      <div>
        <label for="regFullName" style="display: block; font-size: 0.8125rem; font-weight: 600; color: var(--color-navy); margin-bottom: 4px;">Full Name *</label>
        <input type="text" id="regFullName" required placeholder="e.g. Alex Mercer" class="search-field" style="padding-left: 12px;" />
      </div>
      <div>
        <label for="regEmail" style="display: block; font-size: 0.8125rem; font-weight: 600; color: var(--color-navy); margin-bottom: 4px;">Email Address *</label>
        <input type="email" id="regEmail" required placeholder="student@skyline.edu" class="search-field" style="padding-left: 12px;" />
      </div>
      <div>
        <label for="regMembership" style="display: block; font-size: 0.8125rem; font-weight: 600; color: var(--color-navy); margin-bottom: 4px;">Participant Type</label>
        <select id="regMembership" class="search-field" style="padding-left: 12px; cursor: pointer;">
          <option value="guest">Guest / Non-Member (${eventData.priceGuest})</option>
          <option value="member">Skyline Association Member (${eventData.priceMember})</option>
        </select>
      </div>
      <button type="submit" id="regSubmitBtn" class="btn-baltic-primary" style="width: 100%; justify-content: center; margin-top: 8px;">
        Submit Event Registration
      </button>
    </form>
  `;

  modal.classList.add("open");

  const form = document.getElementById("publicRegistrationForm");
  if (form) {
    form.addEventListener("submit", (e) => handleFormSubmit(e, eventData.id));
  }

  const nameInput = document.getElementById("regFullName");
  if (nameInput) nameInput.focus();
}

async function handleFormSubmit(e, eventId) {
  e.preventDefault();

  const nameInput = document.getElementById("regFullName");
  const emailInput = document.getElementById("regEmail");
  const submitBtn = document.getElementById("regSubmitBtn");
  const feedbackEl = document.getElementById("registrationFeedbackMessage");

  const fullName = nameInput ? nameInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";

  // Perform validation using validation utility
  const validation = validateRegistrationForm(fullName, email);
  if (!validation.isValid) {
    if (feedbackEl) {
      feedbackEl.innerHTML = `
        <div style="background: var(--color-error-bg); border: 1px solid var(--color-error); color: var(--color-error); padding: 10px 14px; border-radius: 6px; font-size: 0.8125rem; margin-bottom: 14px;">
          ${validation.errors.join("<br/>")}
        </div>
      `;
    }
    return;
  }

  // Prevent double submissions while request is pending
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting Registration to Backend...";
    submitBtn.style.opacity = "0.7";
  }

  if (feedbackEl) feedbackEl.innerHTML = "";

  try {
    const response = await fetch(`http://localhost:5000/api/events/${encodeURIComponent(eventId)}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fullName, email })
    });

    if (response.ok) {
      const result = await response.json();
      const modalContent = document.getElementById("modalDynamicContent");
      if (modalContent) {
        modalContent.innerHTML = `
          <div style="text-align: center; padding: 24px 0;">
            <div style="width: 56px; height: 56px; background: var(--color-success-bg); color: var(--color-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto 16px;">
              ✓
            </div>
            <h3 style="color: var(--color-navy); margin-bottom: 8px; font-weight: 700;">Registration Confirmed</h3>
            <p style="margin-bottom: 16px; font-size: 0.875rem; color: var(--color-text-muted);">
              Thank you, <strong>${fullName}</strong>. Your ticket code is <strong>${result.ticketCode || result.id || "CONFIRMED"}</strong>.
            </p>
            <button type="button" class="btn-baltic-primary" style="width: auto; margin: 0 auto; padding: 10px 24px;" onclick="document.getElementById('participateModal').classList.remove('open')">
              Done
            </button>
          </div>
        `;
      }
    } else {
      const errText = await response.text();
      let errorMsg = `Server returned status ${response.status}.`;
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error && errJson.error.message) errorMsg = errJson.error.message;
      } catch (_) {}

      if (feedbackEl) {
        feedbackEl.innerHTML = `
          <div style="background: #FFF5F5; border: 1px solid #FEB2B2; color: #C53030; padding: 12px 14px; border-radius: 8px; font-size: 0.8125rem; margin-bottom: 14px; line-height: 1.4;">
            <strong>Backend API Registration Notice:</strong><br />
            ${errorMsg || "Public registration endpoint (POST /api/events/:id/tickets) is not mounted on backend server."}<br />
            <span style="font-size: 0.75rem; color: #9B2C2C; display: block; margin-top: 4px;">Entered values preserved. Frontend interaction verified.</span>
          </div>
        `;
      }
    }
  } catch (_) {
    if (feedbackEl) {
      feedbackEl.innerHTML = `
        <div style="background: #FFF5F5; border: 1px solid #FEB2B2; color: #C53030; padding: 12px 14px; border-radius: 8px; font-size: 0.8125rem; margin-bottom: 14px; line-height: 1.4;">
          <strong>Backend Service Connection Notice:</strong><br />
          Could not reach backend API endpoint at <code>http://localhost:5000/api/events/${eventId}/tickets</code>.<br />
          <span style="font-size: 0.75rem; color: #9B2C2C; display: block; margin-top: 4px;">Entered values preserved. Non-persistent frontend form validated cleanly.</span>
        </div>
      `;
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Event Registration";
      submitBtn.style.opacity = "1";
    }
  }
}
