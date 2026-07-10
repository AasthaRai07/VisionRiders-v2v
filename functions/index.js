const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

const express = require("express");
const cors = require("cors");

const usersRoutes = require("./src/routes/users");
const coursesRoutes = require("./src/routes/courses");
const mentorsRoutes = require("./src/routes/mentors");
const jobsRoutes = require("./src/routes/jobs");
const communityRoutes = require("./src/routes/community");
const skillGapRoutes = require("./src/routes/skillGap");
const interviewsRoutes = require("./src/routes/interviews");
const searchRoutes = require("./src/routes/search");
const financeRoutes = require("./src/routes/finance");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Authentication middleware
const authenticate = async (req, res, next) => {
  // Public paths that allow unauthenticated access
  const publicPaths = ['/courses', '/mentors', '/jobs', '/community/posts', '/search', '/skill-gap/labels', '/skill-gap/roles', '/finance'];
  const isPublicGet = req.method === 'GET' && publicPaths.some(p => req.path.startsWith(p));
  const isPublicPost = req.method === 'POST' && req.path === '/jobs/parse-resume';

  if (isPublicPost || req.path.startsWith('/finance')) {
    return next();
  }
  // Whitelist demo user for development
  if (req.path.includes('/demo-user-123/') || req.path.includes('/skill-gap/analyze')) {
    req.user = { uid: 'demo-user-123' };
    return next();
  }

  const authHeader = req.headers.authorization;
  const hasToken = authHeader && authHeader.startsWith('Bearer ');

  if (hasToken) {
    const idToken = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      return next();
    } catch (error) {
      // If it's a public GET, continue without auth (token was invalid/expired)
      if (isPublicGet) {
        req.user = null;
        return next();
      }
      console.error('Error while verifying Firebase ID token:', error);
      return res.status(403).json({ error: 'Unauthorized. Invalid token.' });
    }
  }

  // No token provided
  if (isPublicGet) {
    req.user = null;
    return next();
  }

  // For community POST routes in dev, use demo user
  if (req.path.startsWith('/community/')) {
    req.user = { uid: 'demo-user-123', email: 'demo@hernova.app' };
    return next();
  }

  return res.status(403).json({ error: 'Unauthorized. Missing Bearer token.' });
};

app.use(authenticate);

// Mount routes
app.use("/users", usersRoutes);
app.use("/courses", coursesRoutes);
app.use("/mentors", mentorsRoutes);
app.use("/jobs", jobsRoutes);
app.use("/community", communityRoutes);
app.use("/skill-gap", skillGapRoutes);
app.use("/interview", interviewsRoutes);
app.use("/search", searchRoutes);
app.use("/finance", financeRoutes);

// Export the express app as a Firebase HTTP Cloud Function
exports.api = onRequest({ maxInstances: 10, cors: true }, app);
