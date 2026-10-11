/**
 * Database & Data Layer Connection Module
 * Connects to PostgreSQL via Prisma Client when DATABASE_URL is configured,
 * with resilient in-memory fallback datasets.
 */

const { PrismaClient } = require('@prisma/client');

let prisma;
let isDbConnected = false;

try {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("YOUR_PASSWORD")) {
    prisma = new PrismaClient();
  }
} catch (err) {
  console.warn("Prisma Client initialization warning:", err.message);
}

// In-Memory Database Fallback Datasets
const memoryEvents = [
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
    memberPrice: 199,
    standardPrice: 499,
    capacity: 100,
    status: "PUBLISHED",
    statusText: "Open",
    statusType: "open",
    isSoldOut: false,
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
    memberPrice: 499,
    standardPrice: 999,
    capacity: 300,
    status: "PUBLISHED",
    statusText: "Closing Soon",
    statusType: "closing-soon",
    isSoldOut: false,
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
    memberPrice: 299,
    standardPrice: 599,
    capacity: 500,
    status: "PUBLISHED",
    statusText: "Sold Out",
    statusType: "sold-out",
    isSoldOut: true,
    imageUrl: null
  }
];

const memoryProducts = [
  {
    id: "m-1",
    name: "Skyline Navy Hoodie",
    category: "apparel",
    categoryLabel: "Official Apparel",
    price: 1299,
    basePrice: 1299,
    memberPrice: 899,
    priceMember: "₹899",
    priceGuest: "₹1,299",
    stock: "In Stock",
    isAvailable: true,
    statusText: "In Stock",
    statusType: "open",
    imageUrl: "./assets/Navy Hoodie Logo Mockup Duo.png",
    desc: "Premium heavyweight collegiate navy blue hoodie crafted from 100% organic combed cotton with embroidered campus crest and brushed interior warmth.",
    sizes: ["S", "M", "L", "XL"]
  }
];

const memoryTickets = [];
const memoryOrders = [];

const memoryUsers = [
  {
    id: "usr-admin",
    name: "System Administrator",
    email: "admin@demo.in",
    password: "pass@123",
    role: "ADMIN",
    createdAt: new Date().toISOString()
  },
  {
    id: "usr-manager",
    name: "Operations Manager",
    email: "manager@demo.in",
    password: "pass@123",
    role: "MANAGER",
    createdAt: new Date().toISOString()
  },
  {
    id: "usr-member",
    name: "Alex Mercer",
    email: "member@demo.in",
    password: "pass@123",
    role: "MEMBER",
    createdAt: new Date().toISOString()
  },
  {
    id: "usr-user",
    name: "Jordan Lee",
    email: "user@demo.in",
    password: "pass@123",
    role: "USER",
    createdAt: new Date().toISOString()
  }
];

module.exports = {
  prisma,
  memoryEvents,
  memoryProducts,
  memoryTickets,
  memoryOrders,
  memoryUsers
};
