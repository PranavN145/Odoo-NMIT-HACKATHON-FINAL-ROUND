/**
 * Development & Demo Data Adapter for Manager Dashboard
 */

export const DEMO_VOLUNTEERS = [
  { id: "v1", name: "Jane Smith", email: "jane.smith@skyline.edu", status: "ACTIVE" },
  { id: "v2", name: "David Lee", email: "david.lee@skyline.edu", status: "ACTIVE" },
  { id: "v3", name: "Sarah Jenkins", email: "s.jenkins@skyline.edu", status: "ACTIVE" },
  { id: "v4", name: "Michael Chang", email: "m.chang@skyline.edu", status: "ACTIVE" },
  { id: "v5", name: "Emily Watson", email: "e.watson@skyline.edu", status: "ACTIVE" },
  { id: "v6", name: "Carlos Rivera", email: "c.rivera@skyline.edu", status: "ACTIVE" },
];

export const DEMO_EVENTS = [
  {
    id: "e1",
    title: "Annual General Assembly 2026",
    dateTime: "2026-10-24T18:00:00.000Z",
    formattedDate: "Oct 24, 2026 • 6:00 PM",
    venue: "Main Campus Auditorium",
    status: "PUBLISHED",
    memberPrice: 0.0,
    standardPrice: 15.0,
    capacity: 250,
    registeredCount: 184,
  },
  {
    id: "e2",
    title: "Autumn Tech & Innovation Expo",
    dateTime: "2026-11-05T10:00:00.000Z",
    formattedDate: "Nov 5, 2026 • 10:00 AM",
    venue: "Engineering Atrium",
    status: "PUBLISHED",
    memberPrice: 5.0,
    standardPrice: 20.0,
    capacity: 150,
    registeredCount: 92,
  },
  {
    id: "e3",
    title: "Leadership Workshop & Networking",
    dateTime: "2026-11-18T14:30:00.000Z",
    formattedDate: "Nov 18, 2026 • 2:30 PM",
    venue: "Student Center Room 302",
    status: "PUBLISHED",
    memberPrice: 0.0,
    standardPrice: 10.0,
    capacity: 60,
    registeredCount: 45,
  },
  {
    id: "e4",
    title: "End of Term Celebration Gala",
    dateTime: "2026-12-10T19:00:00.000Z",
    formattedDate: "Dec 10, 2026 • 7:00 PM",
    venue: "Skyline Ballroom",
    status: "DRAFT",
    memberPrice: 15.0,
    standardPrice: 35.0,
    capacity: 300,
    registeredCount: 0,
  },
];

export const DEMO_TASKS = [
  {
    id: "t1",
    title: "Check-in Desk Staffing & QR Scan",
    assigneeName: "Jane Smith",
    assigneeId: "v1",
    eventId: "e1",
    eventTitle: "Annual General Assembly",
    dueDate: "2026-10-24T17:30:00.000Z",
    formattedDueDate: "Oct 24 • 5:30 PM",
    status: "IN_PROGRESS",
  },
  {
    id: "t2",
    title: "Merchandise Booth Inventory Setup",
    assigneeName: "David Lee",
    assigneeId: "v2",
    eventId: "e1",
    eventTitle: "Annual General Assembly",
    dueDate: "2026-10-24T16:00:00.000Z",
    formattedDueDate: "Oct 24 • 4:00 PM",
    status: "PENDING",
  },
  {
    id: "t3",
    title: "Expo Speaker Welcome & Escort",
    assigneeName: "Sarah Jenkins",
    assigneeId: "v3",
    eventId: "e2",
    eventTitle: "Autumn Tech Expo",
    dueDate: "2026-11-05T09:15:00.000Z",
    formattedDueDate: "Nov 5 • 9:15 AM",
    status: "PENDING",
  },
  {
    id: "t4",
    title: "Catering & Refreshments Setup",
    assigneeName: "Michael Chang",
    assigneeId: "v4",
    eventId: "e3",
    eventTitle: "Leadership Workshop",
    dueDate: "2026-11-18T13:30:00.000Z",
    formattedDueDate: "Nov 18 • 1:30 PM",
    status: "PENDING",
  },
];

export const DEMO_MERCHANDISE = [
  { id: "m1", name: "Skyline Association Hoodie", price: 45.0, inStock: 68 },
  { id: "m2", name: "Official Member T-Shirt", price: 20.0, inStock: 142 },
  { id: "m3", name: "Stainless Steel Water Bottle", price: 18.0, inStock: 35 },
  { id: "m4", name: "Embroidered Snapback Cap", price: 22.0, inStock: 50 },
  { id: "m5", name: "Canvas Tote Bag", price: 12.0, inStock: 90 },
  { id: "m6", name: "Enamel Lapel Pin", price: 6.0, inStock: 200 },
];

export function getDashboardMetrics(events = DEMO_EVENTS, tasks = DEMO_TASKS, volunteers = DEMO_VOLUNTEERS, products = DEMO_MERCHANDISE) {
  const totalVolunteers = volunteers ? volunteers.length : 0;
  const upcomingEvents = events ? events.filter(e => new Date(e.dateTime) >= new Date("2026-10-01")).length : 0;
  const merchandiseProducts = products ? products.length : 0;
  const pendingTasks = tasks ? tasks.filter(t => t.status === "PENDING" || t.status === "IN_PROGRESS").length : 0;

  return {
    totalVolunteers,
    upcomingEvents,
    merchandiseProducts,
    pendingTasks,
  };
}

export function getUpcomingEvents(limit = 4, events = DEMO_EVENTS) {
  if (!events || events.length === 0) return [];
  return [...events]
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
    .slice(0, limit);
}

export function getVolunteerTasks(limit = 4, tasks = DEMO_TASKS) {
  if (!tasks || tasks.length === 0) return [];
  return [...tasks].slice(0, limit);
}
