require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Instantiate a single PrismaClient instance for the backend process
const prisma = new PrismaClient();

module.exports = prisma;
