/**
 * Skyline Student Association — User Portal Logic (Volunteer Desk Operations)
 * Matches reference styling and PRD volunteer requirements
 */

// Initial Data: Assigned Events
const ASSIGNED_EVENTS = [
  {
    id: "evt-101",
    title: "TechFest 2026: AI & Robotics Expo",
    date: "Nov 14 - 15, 2026",
    time: "09:00 AM - 05:00 PM",
    venue: "Main University Auditorium & Labs",
    role: "Lead Desk Coordinator",
    shift: "Morning Shift (08:30 AM - 01:30 PM)",
    leadManager: "Prof. Rajesh Verma (+91 98765 43210)",
    totalRegistered: 400,
    checkedIn: 342,
    badgeClass: "badge-member"
  },
  {
    id: "evt-102",
    title: "Skyline Hackathon 4.0: 36h Sprint",
    date: "Nov 22 - 23, 2026",
    time: "08:00 AM Onwards",
    venue: "Innovation Center & Cloud Lab",
    role: "Check-in & Badge Distribution Volunteer",
    shift: "Evening Shift (04:00 PM - 10:00 PM)",
    leadManager: "Ananya Deshmukh (+91 98450 11223)",
    totalRegistered: 200,
    checkedIn: 184,
    badgeClass: "badge-member"
  },
  {
    id: "evt-103",
    title: "Symphony: Annual Cultural Night",
    date: "Dec 05, 2026",
    time: "05:00 PM - 11:00 PM",
    venue: "Open Air Amphitheatre",
    role: "Crowd Control & Gate 2 Check-in",
    shift: "Night Shift (05:00 PM - 10:30 PM)",
    leadManager: "Vikram Sengupta (+91 97654 32109)",
    totalRegistered: 800,
    checkedIn: 0,
    badgeClass: "badge-guest"
  }
];

// Initial Data: Volunteer Tasks Assigned to User
let USER_TASKS = [
  {
    id: "tsk-1",
    title: "Auditorium Main Gate Check-in Desk Setup",
    eventTitle: "TechFest 2026",
    priority: "high",
    priorityLabel: "High",
    dueTime: "Today • 08:30 AM",
    status: "completed",
    assignedBy: "Alex Mercer (Manager)",
    desc: "Verify QR scanner barcode terminals, wristband distribution crates, and attendee badge packs."
  },
  {
    id: "tsk-2",
    title: "Keynote Speaker Welcome & Media Escort",
    eventTitle: "TechFest 2026",
    priority: "high",
    priorityLabel: "High",
    dueTime: "Today • 10:15 AM",
    status: "in-progress",
    assignedBy: "Prof. Rajesh Verma",
    desc: "Receive Dr. Sunita Rao at VIP Entrance Gate 1 and escort to Executive Green Room."
  },
  {
    id: "tsk-3",
    title: "Merchandise Stall Restock & Size Sorting",
    eventTitle: "Campus Operations",
    priority: "medium",
    priorityLabel: "Medium",
    dueTime: "Today • 02:00 PM",
    status: "pending",
    assignedBy: "Merchandise Desk Lead",
    desc: "Transfer 50 Skyline Hoodies (M & L) from storage Room 204 to student plaza stall."
  },
  {
    id: "tsk-4",
    title: "Collect Physical Event Feedback Forms",
    eventTitle: "TechFest 2026",
    priority: "normal",
    priorityLabel: "Normal",
    dueTime: "Today • 04:30 PM",
    status: "pending",
    assignedBy: "Alex Mercer (Manager)",
    desc: "Distribute and gather paper survey forms from Workshop Hall 2 attendees."
  },
  {
    id: "tsk-5",
    title: "Hackathon Sponsor Banner Mounting",
    eventTitle: "Skyline Hackathon 4.0",
    priority: "medium",
    priorityLabel: "Medium",
    dueTime: "Nov 21 • 06:00 PM",
    status: "pending",
    assignedBy: "Sponsorship Team",
    desc: "Install cloud partner and sponsor standees across the Innovation Center perimeter."
  }
];

// Initial Data: Registered Participants Roster
let PARTICIPANTS = [
  {
    ticketId: "TIC-2026-8924",
    name: "Alex Mercer",
    rollNo: "23CS104",
    email: "alex.mercer@skyline.edu",
    type: "Member",
    event: "TechFest 2026: AI & Robotics Expo",
    checkedIn: true,
    checkInTime: "09:14 AM"
  },
  {
    ticketId: "TIC-2026-3419",
    name: "Sneha Patil",
    rollNo: "22EC082",
    email: "sneha.p@skyline.edu",
    type: "Member",
    event: "TechFest 2026: AI & Robotics Expo",
    checkedIn: true,
    checkInTime: "09:28 AM"
  },
  {
    ticketId: "TIC-2026-5512",
    name: "Rohan Kulkarni",
    rollNo: "24ME015",
    email: "rohan.k@gmail.com",
    type: "Guest",
    event: "TechFest 2026: AI & Robotics Expo",
    checkedIn: false,
    checkInTime: null
  },
  {
    ticketId: "TIC-2026-7841",
    name: "Meera Nair",
    rollNo: "23IT044",
    email: "meera.nair@skyline.edu",
    type: "Member",
    event: "TechFest 2026: AI & Robotics Expo",
    checkedIn: true,
    checkInTime: "10:02 AM"
  },
  {
    ticketId: "TIC-2026-9021",
    name: "Aman Sharma",
    rollNo: "21CS199",
    email: "aman.s@outlook.com",
    type: "Guest",
    event: "Skyline Hackathon 4.0: 36h Sprint",
    checkedIn: false,
    checkInTime: null
  },
  {
    ticketId: "TIC-2026-1148",
    name: "Pooja Hegde",
    rollNo: "23EE031",
    email: "pooja.h@skyline.edu",
    type: "Member",
    event: "TechFest 2026: AI & Robotics Expo",
    checkedIn: false,
    checkInTime: null
  },
  {
    ticketId: "TIC-2026-6632",
    name: "Karan Johar",
    rollNo: "24CS091",
    email: "karan.j@skyline.edu",
    type: "Member",
    event: "TechFest 2026: AI & Robotics Expo",
    checkedIn: true,
    checkInTime: "10:25 AM"
  }
];

// App Initialization
document.addEventListener("DOMContentLoaded", () => {
  initNavigationTabs();
  initUserProfileDropdown();
  renderDashboard();
  renderCheckinRoster();
  renderTasks();
  renderAssignedEvents();
  initSearchAndFilters();
  initRegistrationForm();
});

/* ==========================================================================
   1. Tab Navigation
   ========================================================================== */
function initNavigationTabs() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      switchTab(targetTab);
    });
  });

  // Switch tab buttons (e.g., Quick action shortcuts)
  document.querySelectorAll("[data-switch-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-switch-tab");
      switchTab(tab);
    });
  });
}

function switchTab(tabName) {
  // Update sidebar buttons
  document.querySelectorAll(".nav-item").forEach((item) => {
    if (item.getAttribute("data-tab") === tabName) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Update panels
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    if (panel.id === `tab-${tabName}`) {
      panel.classList.add("active");
    } else {
      panel.classList.remove("active");
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==========================================================================
   2. User Profile Dropdown
   ========================================================================== */
function initUserProfileDropdown() {
  const widget = document.getElementById("userProfileWidget");
  const menu = document.getElementById("userProfileMenu");

  if (!widget || !menu) return;

  widget.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!widget.contains(e.target)) {
      menu.classList.remove("open");
    }
  });
}

/* ==========================================================================
   3. Dashboard Stats & Recent Activity
   ========================================================================== */
function renderDashboard() {
  // Update metric counters
  const totalTasks = USER_TASKS.length;
  const pendingTasks = USER_TASKS.filter((t) => t.status !== "completed").length;
  const checkedInCount = PARTICIPANTS.filter((p) => p.checkedIn).length;
  const totalRoster = PARTICIPANTS.length;

  const statTasks = document.getElementById("statPendingTasks");
  if (statTasks) statTasks.textContent = `${pendingTasks} Pending (${totalTasks} Total)`;

  const statChecked = document.getElementById("statCheckedIn");
  if (statChecked) statChecked.textContent = `${checkedInCount} / ${totalRoster}`;

  // Update badge in sidebar
  const taskBadge = document.getElementById("taskSidebarBadge");
  if (taskBadge) taskBadge.textContent = `${pendingTasks} Due`;

  // Render Recent Activity Preview
  const listEl = document.getElementById("recentDeskActivityList");
  if (!listEl) return;

  const recentCheckins = PARTICIPANTS.filter((p) => p.checkedIn).slice(-3).reverse();
  listEl.innerHTML = recentCheckins
    .map(
      (p) => `
      <div class="activity-item">
        <div class="activity-icon-container">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div class="activity-details">
          <span class="activity-title">Participant Check-in Confirmed: <strong>${p.name}</strong></span>
          <div class="activity-submeta">
            <span class="related-tag">${p.ticketId}</span>
            <span>&bull; ${p.event}</span>
          </div>
        </div>
        <span class="activity-timestamp">${p.checkInTime || "Just now"}</span>
      </div>
    `
    )
    .join("");
}

/* ==========================================================================
   4. Event Check-in Terminal (Live Search, Scan, Verify)
   ========================================================================== */
let checkinFilterQuery = "";
let checkinStatusFilter = "all";

function initSearchAndFilters() {
  const searchInput = document.getElementById("checkinSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      checkinFilterQuery = e.target.value.trim().toLowerCase();
      renderCheckinRoster();
    });
  }

  const filterSelect = document.getElementById("checkinFilterSelect");
  if (filterSelect) {
    filterSelect.addEventListener("change", (e) => {
      checkinStatusFilter = e.target.value;
      renderCheckinRoster();
    });
  }
}

function renderCheckinRoster() {
  const tableBody = document.getElementById("checkinTableBody");
  if (!tableBody) return;

  const filtered = PARTICIPANTS.filter((p) => {
    const matchesQuery =
      checkinFilterQuery === "" ||
      p.name.toLowerCase().includes(checkinFilterQuery) ||
      p.rollNo.toLowerCase().includes(checkinFilterQuery) ||
      p.ticketId.toLowerCase().includes(checkinFilterQuery);

    const matchesStatus =
      checkinStatusFilter === "all" ||
      (checkinStatusFilter === "checked" && p.checkedIn) ||
      (checkinStatusFilter === "pending" && !p.checkedIn);

    return matchesQuery && matchesStatus;
  });

  // Update counters
  const total = PARTICIPANTS.length;
  const checked = PARTICIPANTS.filter((p) => p.checkedIn).length;
  const statEl = document.getElementById("terminalCheckinRatio");
  if (statEl) statEl.textContent = `${checked} / ${total} Checked in (${Math.round((checked / total) * 100)}%)`;

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 36px; color: var(--color-text-muted);">
          No participant records matched your search query.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered
    .map(
      (p) => `
      <tr>
        <td><strong style="color: var(--color-text-main); font-variant-numeric: tabular-nums;">${p.ticketId}</strong></td>
        <td>
          <div style="font-weight: 600; color: var(--color-text-main);">${p.name}</div>
          <div style="font-size: 0.75rem; color: var(--color-text-muted);">${p.email}</div>
        </td>
        <td><span style="font-size: 0.8125rem; font-weight: 500;">${p.rollNo}</span></td>
        <td>
          <span class="badge-status ${p.type === "Member" ? "badge-member" : "badge-guest"}">${p.type}</span>
        </td>
        <td>
          ${
            p.checkedIn
              ? `<span class="badge-status badge-checked-in">&#10003; Checked in (${p.checkInTime})</span>`
              : `<span class="badge-status badge-pending">&bull; Awaiting Entrance</span>`
          }
        </td>
        <td>
          ${
            p.checkedIn
              ? `<button class="btn btn-outline btn-sm" onclick="toggleCheckin('${p.ticketId}', false)">Undo</button>`
              : `<button class="btn btn-primary btn-sm" onclick="toggleCheckin('${p.ticketId}', true)">Check In</button>`
          }
        </td>
      </tr>
    `
    )
    .join("");
}

window.toggleCheckin = function (ticketId, markChecked) {
  const p = PARTICIPANTS.find((item) => item.ticketId === ticketId);
  if (!p) return;

  p.checkedIn = markChecked;
  if (markChecked) {
    const now = new Date();
    p.checkInTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    showToast(`Checked in: ${p.name} (${ticketId})`);
  } else {
    p.checkInTime = null;
    showToast(`Check-in reversed for ${p.name}`);
  }

  renderCheckinRoster();
  renderDashboard();
};

// Scan Simulation via prompt / modal
window.openScanPrompt = function () {
  const ticketInput = prompt("Simulate Scanner: Enter or scan Ticket ID (e.g. TIC-2026-5512):", "TIC-2026-5512");
  if (!ticketInput) return;

  const found = PARTICIPANTS.find((p) => p.ticketId.toUpperCase() === ticketInput.trim().toUpperCase());
  if (found) {
    if (found.checkedIn) {
      alert(`⚠️ Already Checked In!\nAttendee: ${found.name}\nChecked in at: ${found.checkInTime}`);
    } else {
      toggleCheckin(found.ticketId, true);
      alert(`✅ Verified Pass!\nAttendee: ${found.name}\nRoll No: ${found.rollNo}\nStatus: Marked Checked In.`);
    }
  } else {
    alert("❌ Invalid Ticket: No attendee found matching this Ticket ID.");
  }
};

/* ==========================================================================
   5. Walk-in Participant Registration Form
   ========================================================================== */
function initRegistrationForm() {
  const form = document.getElementById("participantRegistrationForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("regFullName").value.trim();
    const rollNo = document.getElementById("regRollNo").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const type = document.getElementById("regType").value;
    const event = document.getElementById("regEventSelect").value;
    const autoCheckin = document.getElementById("regAutoCheckin").checked;

    const newTicketId = `TIC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newParticipant = {
      ticketId: newTicketId,
      name,
      rollNo,
      email,
      type,
      event,
      checkedIn: autoCheckin,
      checkInTime: autoCheckin ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null
    };

    PARTICIPANTS.unshift(newParticipant);
    renderCheckinRoster();
    renderDashboard();

    // Show Pass Modal
    showGeneratedPass(newParticipant);
    form.reset();
  });
}

function showGeneratedPass(participant) {
  const modal = document.getElementById("passModal");
  const body = document.getElementById("passModalBody");
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="width: 48px; height: 48px; background: var(--color-success-bg); color: var(--color-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 1.5rem;">
        ✓
      </div>
      <h3 style="color: var(--color-text-main); margin-bottom: 4px;">Participant Registered!</h3>
      <p style="font-size: 0.875rem; color: var(--color-text-muted);">Pass verified for desk entrance.</p>
    </div>

    <div style="background: var(--color-canvas); border: 1px dashed var(--color-border); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="color: var(--color-text-muted); font-size: 0.8125rem;">TICKET PASS ID:</span>
        <strong style="color: var(--color-primary); font-variant-numeric: tabular-nums;">${participant.ticketId}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="color: var(--color-text-muted); font-size: 0.8125rem;">ATTENDEE:</span>
        <strong style="color: var(--color-text-main);">${participant.name} (${participant.rollNo})</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="color: var(--color-text-muted); font-size: 0.8125rem;">EVENT:</span>
        <strong style="color: var(--color-text-main);">${participant.event}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span style="color: var(--color-text-muted); font-size: 0.8125rem;">STATUS:</span>
        <span class="badge-status ${participant.checkedIn ? "badge-checked-in" : "badge-pending"}">
          ${participant.checkedIn ? "Checked In" : "Pending Check-in"}
        </span>
      </div>
    </div>

    <div style="display: flex; gap: 10px;">
      <button class="btn btn-outline" style="flex: 1;" onclick="window.print()">Print Pass</button>
      <button class="btn btn-primary" style="flex: 1;" onclick="closeModal('passModal')">Done</button>
    </div>
  `;

  modal.classList.add("open");
}

/* ==========================================================================
   6. Task Management (Volunteer Task Board)
   ========================================================================= */
let currentTaskFilter = "all";

function renderTasks() {
  const container = document.getElementById("tasksContainer");
  if (!container) return;

  const filtered = USER_TASKS.filter((t) => {
    if (currentTaskFilter === "all") return true;
    return t.status === currentTaskFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px; padding: 40px; text-align: center;">
        <h4 style="color: var(--color-text-main); margin-bottom: 6px;">No tasks found</h4>
        <p style="font-size: 0.875rem; color: var(--color-text-muted);">All duties in this category are completed or cleared.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered
    .map(
      (task) => `
      <div class="task-card" data-id="${task.id}">
        <div>
          <div class="task-card-top">
            <span class="task-priority-badge priority-${task.priority}">${task.priorityLabel} Priority</span>
            <span style="font-size: 0.75rem; font-weight: 600; color: var(--color-primary);">${task.eventTitle}</span>
          </div>
          <h3 class="task-title">${task.title}</h3>
          <p class="task-desc">${task.desc}</p>
          <div class="task-meta">
            <div class="task-meta-row">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>Due: <strong>${task.dueTime}</strong></span>
            </div>
            <div class="task-meta-row">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              <span>Assigned By: ${task.assignedBy}</span>
            </div>
          </div>
        </div>

        <div class="task-card-footer">
          <div>
            <span style="font-size: 0.75rem; color: var(--color-text-muted);">Status: </span>
            <strong style="font-size: 0.8125rem; text-transform: capitalize; color: ${
              task.status === "completed"
                ? "var(--color-success)"
                : task.status === "in-progress"
                ? "var(--color-warning)"
                : "var(--color-primary)"
            };">
              ${task.status.replace("-", " ")}
            </strong>
          </div>
          <div style="display: flex; gap: 6px;">
            ${
              task.status !== "completed"
                ? `<button class="btn btn-success btn-sm" onclick="updateTaskStatus('${task.id}', 'completed')">Mark Done</button>`
                : `<button class="btn btn-outline btn-sm" onclick="updateTaskStatus('${task.id}', 'pending')">Reopen</button>`
            }
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

window.filterTasks = function (status, btn) {
  currentTaskFilter = status;
  document.querySelectorAll("#taskFilterBar button").forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderTasks();
};

window.updateTaskStatus = function (taskId, newStatus) {
  const task = USER_TASKS.find((t) => t.id === taskId);
  if (!task) return;

  task.status = newStatus;
  showToast(`Task updated: "${task.title}" marked as ${newStatus}`);
  renderTasks();
  renderDashboard();
};

/* ==========================================================================
   7. Assigned Events Overview
   ========================================================================== */
function renderAssignedEvents() {
  const container = document.getElementById("assignedEventsGrid");
  if (!container) return;

  container.innerHTML = ASSIGNED_EVENTS.map(
    (ev) => `
    <div class="split-card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <span class="badge-status badge-member">${ev.role}</span>
          <span style="font-size: 0.75rem; font-weight: 600; color: var(--color-text-muted);">${ev.date}</span>
        </div>
        <h3 style="font-size: 1.125rem; font-weight: 700; color: var(--color-text-main); margin-bottom: 8px;">${ev.title}</h3>
        
        <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.8125rem; color: var(--color-text-muted); margin-bottom: 16px;">
          <div>📍 <strong>Venue:</strong> ${ev.venue}</div>
          <div>⏱️ <strong>Duty Shift:</strong> ${ev.shift}</div>
          <div>👤 <strong>Coordinator:</strong> ${ev.leadManager}</div>
        </div>
      </div>

      <div style="border-top: 1px solid var(--color-border-subtle); padding-top: 14px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 0.75rem; color: var(--color-text-muted);">Check-in Roster:</span><br/>
          <strong style="color: var(--color-text-main); font-size: 0.9375rem;">${ev.checkedIn} / ${ev.totalRegistered}</strong>
        </div>
        <button class="btn btn-outline btn-sm" onclick="switchTab('checkin')">Open Desk →</button>
      </div>
    </div>
  `
  ).join("");
}

/* ==========================================================================
   8. Utility Toast & Modals
   ========================================================================== */
window.closeModal = function (modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove("open");
};

function showToast(msg) {
  const c = document.getElementById("toastContainer");
  if (!c) return;

  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  c.appendChild(t);

  setTimeout(() => {
    t.style.opacity = "0";
    setTimeout(() => t.remove(), 200);
  }, 3000);
}
