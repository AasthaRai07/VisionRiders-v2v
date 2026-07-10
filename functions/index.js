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

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Authentication middleware
const authenticate = async (req, res, next) => {
  // Allow unauthenticated access to specific paths if needed, e.g., GET /courses, GET /mentors, GET /jobs, GET /community, GET /search
  const publicPaths = ['/courses', '/mentors', '/jobs', '/community/posts', '/search', '/skill-gap/labels', '/skill-gap/roles'];
  if (req.method === 'GET' && publicPaths.some(p => req.path.startsWith(p))) {
    return next();
  }
  
  // Whitelist demo user for development
  if (req.path.includes('/demo-user-123/')) {
    req.user = { uid: 'demo-user-123' };
    return next();
  }

  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Unauthorized. Missing Bearer token.' });
  }

  const idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).json({ error: 'Unauthorized. Invalid token.' });
  }
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

// Export the express app as a Firebase HTTP Cloud Function
exports.api = onRequest({ maxInstances: 10, cors: true }, app);
