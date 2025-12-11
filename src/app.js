const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { Clerk } = require('@clerk/clerk-sdk-node');

const app = express();

// Initialize Clerk (new API for v4.x)
const clerk = new Clerk({ 
  secretKey: process.env.CLERK_SECRET_KEY 
});

// Initialize Prisma Client - it reads config from prisma.config.ts
const prisma = new PrismaClient();  // ✅ Correct for Prisma 7

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware (updated for Clerk v4.x)
const requireAuth = async (req, res, next) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionToken) {
      return res.status(401).json({ error: 'No session token' });
    }
    
    // Verify session with Clerk v4.x API
    const session = await clerk.sessions.verifySession(sessionToken);
    
    if (!session || session.status !== 'active') {
      return res.status(401).json({ error: 'Invalid session' });
    }
    
    // Get user info
    const user = await clerk.users.getUser(session.userId);
    
    // Get or create user profile
    let profile = await prisma.profile.findUnique({
      where: { id: user.id }
    });
    
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          plan: 'free'
        }
      });
    }
    
    req.user = profile;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'jobflow-backend',
    timestamp: new Date().toISOString()
  });
});

// Protected route example
app.get('/api/user/profile', requireAuth, async (req, res) => {
  res.json(req.user);
});

// Test route - no auth required
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend is running!',
    prisma: 'Configured correctly',
    clerk: process.env.CLERK_SECRET_KEY ? 'Key set' : 'Key missing',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 Database URL configured: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
  console.log(`🔐 Clerk Secret Key: ${process.env.CLERK_SECRET_KEY ? 'Set' : 'Missing - set CLERK_SECRET_KEY in .env'}`);
});