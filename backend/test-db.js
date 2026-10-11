/**
 * Database & API Health Connection Verification Script
 * Run: node backend/test-db.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function checkConnection() {
  console.log('\n======================================================');
  console.log(' Skyline Platform — Database & API Connection Diagnostic');
  console.log('======================================================\n');

  console.log('1. Checking Environment Variables...');
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log('❌ DATABASE_URL is missing in backend/.env');
    process.exit(1);
  }

  console.log(`   DATABASE_URL: ${dbUrl.replace(/:[^:@]+@/, ':****@')}`);

  console.log('\n2. Testing PostgreSQL / Prisma Database Connection...');
  const prisma = new PrismaClient();
  try {
    // Attempt raw query or model query to test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ DATABASE STATUS: Connected successfully to PostgreSQL database!');
    
    try {
      const eventCount = await prisma.event.count();
      console.log(`   Found ${eventCount} event records in database.`);
    } catch (_) {
      console.log('   (Database connected, run "npx prisma db push" if tables are not created yet).');
    }
  } catch (err) {
    console.log('⚠️ DATABASE STATUS: PostgreSQL DB not reachable with current password/host.');
    console.log(`   Error detail: ${err.message.split('\n')[0]}`);
    console.log('   ℹ️ Fallback mode active: System automatically serves pre-seeded campus API data.');
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n3. Testing Backend REST API Health Endpoint (http://localhost:5000/api/health)...');
  try {
    const res = await fetch('http://localhost:5000/api/health');
    if (res.ok) {
      const data = await res.json();
      console.log('✅ BACKEND API STATUS: Online & healthy!');
      console.log(`   Message: ${data.message}`);
    } else {
      console.log(`❌ BACKEND API STATUS: Responded with status ${res.status}`);
    }
  } catch (err) {
    console.log('⚠️ BACKEND API STATUS: Server not running. Start it with "node backend/server.js".');
  }

  console.log('\n======================================================\n');
}

checkConnection();
