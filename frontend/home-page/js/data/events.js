/**
 * Sample Events Dataset & Data Loader Module
 * Skyline Student Association Platform
 */

export const INITIAL_EVENTS_DATA = [
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
    imageUrl: null
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
    imageUrl: null
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
    imageUrl: null
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
    imageUrl: null
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
    imageUrl: null
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
          events: data.map((item) => ({
            id: item.id || `evt-${Math.random()}`,
            title: item.title || "Campus Event",
            category: item.category || "tech",
            categoryLabel: item.categoryLabel || item.category || "General",
            date: item.date ? new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Upcoming",
            time: item.time || "Scheduled",
            venue: item.venue || "Campus Venue",
            desc: item.description || item.desc || "Skyline Student Association Event",
            priceMember: item.memberPrice ? `₹${item.memberPrice}` : "Free",
            priceGuest: item.standardPrice ? `₹${item.standardPrice}` : "Free",
            imageUrl: item.imageUrl || null
          })),
          isFromApi: true
        };
      }
    }
  } catch (_) {
    // API unmounted or backend down, fallback to sample data
  }

  return {
    events: [...INITIAL_EVENTS_DATA],
    isFromApi: false
  };
}
