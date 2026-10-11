/**
 * Public Header Component & Role Dropdown Handler
 * Skyline Student Association Platform
 */

export function initHeaderComponent() {
  const container = document.getElementById("loginDropdownContainer");
  const toggleBtn = document.getElementById("loginDropdownBtn");

  if (!container || !toggleBtn) return;

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = container.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      container.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && container.classList.contains("open")) {
      container.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.focus();
    }
  });
}
