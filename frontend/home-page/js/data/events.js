/**
 * Sample Events Dataset & Data Loader Module
 * College Club Events with Discounted Member Prices & Statuses
 */

export const INITIAL_EVENTS_DATA = [
  {
    id: "evt-1",
    title: "GitHub & Open Source Workshop",
    category: "workshop",
    categoryLabel: "Tech Workshop",
    mode: "In Person",
    dateMonth: "OCT",
    dateDay: "10",
    date: "Oct 10, 2026",
    time: "10:00 AM - 01:00 PM",
    venue: "Computer Lab 304, Skyline Campus",
    desc: "Comprehensive hands-on workshop covering Git version control, GitHub team workflows, pull request reviews, and open-source project contribution fundamentals led by senior developers.",
    priceMember: "₹199",
    priceGuest: "₹499",
    statusText: "Open",
    statusType: "open",
    imageUrl: null
  },
  {
    id: "evt-2",
    title: "Annual Spring Gala 2026",
    category: "cultural",
    categoryLabel: "College Gala",
    mode: "In Person",
    dateMonth: "OCT",
    dateDay: "12",
    date: "Oct 12, 2026",
    time: "06:00 PM - 10:00 PM",
    venue: "Main Quadrangle, Skyline Campus",
    desc: "The premier formal evening event of the academic year celebrating student achievements, club honors, live acoustic performances, fine dining, and annual leadership awards.",
    priceMember: "₹499",
    priceGuest: "₹999",
    statusText: "Closing Soon",
    statusType: "closing-soon",
    imageUrl: null
  },
  {
    id: "evt-3",
    title: "Skyline Campus Live Concert",
    category: "cultural",
    categoryLabel: "Live Concert",
    mode: "In Person",
    dateMonth: "OCT",
    dateDay: "15",
    date: "Oct 15, 2026",
    time: "06:30 PM - 11:00 PM",
    venue: "Open Air Amphitheatre, Bangalore",
    desc: "Annual campus music festival featuring student band showdowns, light shows, and a celebrity guest artist live headline performance.",
    priceMember: "₹299",
    priceGuest: "₹599",
    statusText: "Sold Out",
    statusType: "sold-out",
    imageUrl: null
  }
];

/**
 * Fetches events from backend endpoint if available, with graceful fallback.
 */
export async function fetchEventsData() {
  try {
    const res = await fetch("http://localhost:5000/api/events", { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return {
          events: data.map((item, idx) => ({
            id: item.id || `evt-${idx + 1}`,
            title: item.title || "College Event",
            category: item.category || "tech",
            categoryLabel: item.categoryLabel || "Event",
            mode: item.mode || "In Person",
            dateMonth: item.dateMonth || "OCT",
            dateDay: item.dateDay || String(10 + idx * 2),
            date: item.date || "Upcoming",
            time: item.time || "Scheduled",
            venue: item.venue || "Campus Venue",
            desc: item.desc || item.description || "Skyline Club Event",
            priceMember: item.priceMember || (idx === 0 ? "₹199" : idx === 1 ? "₹499" : "₹299"),
            priceGuest: item.priceGuest || (idx === 0 ? "₹499" : idx === 1 ? "₹999" : "₹599"),
            statusText: item.statusText || (idx === 0 ? "Open" : idx === 1 ? "Closing Soon" : "Sold Out"),
            statusType: item.statusType || (idx === 0 ? "open" : idx === 1 ? "closing-soon" : "sold-out"),
            imageUrl: item.imageUrl || null
          })),
          isFromApi: true
        };
      }
    }
  } catch (_) {
    // Fallback to initial events
  }

  return {
    events: [...INITIAL_EVENTS_DATA],
    isFromApi: false
  };
}
