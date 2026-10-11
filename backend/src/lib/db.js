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
    title: "TechFest 2026: AI & Robotics Expo",
    category: "tech",
    categoryLabel: "Technology",
    date: "Nov 14 - 15, 2026",
    time: "09:00 AM - 06:00 PM",
    venue: "Main Auditorium & Labs",
    desc: "Flagship symposium featuring autonomous robotics battleground, student AI demos, and keynote tech panels.",
    priceMember: "Free",
    priceGuest: "₹199",
    memberPrice: 0,
    standardPrice: 199,
    capacity: 300,
    status: "PUBLISHED",
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
    memberPrice: 0,
    standardPrice: 0,
    capacity: 200,
    status: "PUBLISHED",
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
    memberPrice: 0,
    standardPrice: 99,
    capacity: 500,
    status: "PUBLISHED",
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
    memberPrice: 0,
    standardPrice: 149,
    capacity: 100,
    status: "PUBLISHED",
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
    memberPrice: 0,
    standardPrice: 0,
    capacity: 400,
    status: "PUBLISHED",
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
    memberPrice: 0,
    standardPrice: 249,
    capacity: 150,
    status: "PUBLISHED",
    imageUrl: null
  }
];

const memoryProducts = [
  {
    id: "m-1",
    name: "Skyline Varsity Fleece Hoodie",
    category: "apparel",
    categoryLabel: "Apparel",
    price: 1199,
    basePrice: 1199,
    memberPrice: 1019,
    stock: "In Stock",
    isAvailable: true,
    icon: "🧥",
    discount: "15% OFF",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "m-2",
    name: "Classic Campus Crest T-Shirt",
    category: "apparel",
    categoryLabel: "Apparel",
    price: 499,
    basePrice: 499,
    memberPrice: 424,
    stock: "In Stock",
    isAvailable: true,
    icon: "👕",
    discount: "15% OFF",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "m-3",
    name: "HydroShield Steel Flask (750ml)",
    category: "drinkware",
    categoryLabel: "Drinkware",
    price: 649,
    basePrice: 649,
    memberPrice: 550,
    stock: "Only 8 Left",
    isAvailable: true,
    icon: "🍶",
    discount: "15% OFF",
    sizes: []
  },
  {
    id: "m-4",
    name: "Executive Hardcover Dot Notebook",
    category: "stationery",
    categoryLabel: "Stationery",
    price: 349,
    basePrice: 349,
    memberPrice: 295,
    stock: "In Stock",
    isAvailable: true,
    icon: "📓",
    discount: "15% OFF",
    sizes: []
  },
  {
    id: "m-5",
    name: "Embroidered Skyline Brass Cap",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 399,
    basePrice: 399,
    memberPrice: 339,
    stock: "In Stock",
    isAvailable: true,
    icon: "🧢",
    discount: "15% OFF",
    sizes: []
  },
  {
    id: "m-6",
    name: "Heavy Canvas Eco Tote Bag",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 299,
    basePrice: 299,
    memberPrice: 254,
    stock: "In Stock",
    isAvailable: true,
    icon: "👜",
    discount: "15% OFF",
    sizes: []
  },
  {
    id: "m-7",
    name: "Tech Accessory Cable Organizer",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 449,
    basePrice: 449,
    memberPrice: 380,
    stock: "Few Left",
    isAvailable: true,
    icon: "💼",
    discount: "15% OFF",
    sizes: []
  },
  {
    id: "m-8",
    name: "Enamel Skyline Pin Collector Set",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 199,
    basePrice: 199,
    memberPrice: 169,
    stock: "In Stock",
    isAvailable: true,
    icon: "🎖️",
    discount: "15% OFF",
    sizes: []
  }
];

const memoryTickets = [];
const memoryOrders = [];

module.exports = {
  prisma,
  memoryEvents,
  memoryProducts,
  memoryTickets,
  memoryOrders
};
