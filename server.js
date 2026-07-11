const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
try {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/(^['"]|['"]$)/g, '');
        if (key && !key.startsWith('#')) {
          process.env[key] = value;
        }
      }
    });
    console.log("Loaded root .env.local environment variables successfully in server.js");
  }
} catch (err) {
  console.warn("Failed to load .env.local file in server:", err.message);
}

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE']
  }
});

// -------------------------------------------------------------
// POSTGRESQL & FALLBACK DATA STORES
// -------------------------------------------------------------
let db = null;
const usePostgres = !!process.env.DATABASE_URL;

if (usePostgres) {
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });
  console.log('Attempting connection to PostgreSQL...');
} else {
  console.log('DATABASE_URL not found. Running with In-Memory fallback database engine.');
}

// In-Memory Data Fallback Stores
const memDb = {
  users: {
    'aditi_123': { id: 'aditi_123', email: 'aditi@hernova.com', role: 'user' }
  },
  profiles: {
    'aditi_123': {
      user_id: 'aditi_123',
      first_name: 'Aditi',
      last_name: 'Roy',
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/...',
      previous_role: 'Software Engineer',
      break_duration: '2 Years',
      target_role: 'Full Stack Engineer',
      bio: 'Returning engineer passionate about web technology.',
      xp: 420,
      level: 2,
      daily_streak: 5,
      learning_streak: 3
    }
  },
  courses: {
    "course_1": {
        "id": "course_1",
        "courseName": "CS50: Introduction to Computer Science",
        "goodFor": "Harvard's renowned intro to computer science and programming fundamentals.",
        "category": "Tech & Data",
        "platform": "edX",
        "courseUrl": "https://www.edx.org/cs50",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_2": {
        "id": "course_2",
        "courseName": "Python for Everybody",
        "goodFor": "Learn Python programming from the ground up, designed for complete beginners.",
        "category": "Tech & Data",
        "platform": "Coursera",
        "courseUrl": "https://www.coursera.org/specializations/python",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_3": {
        "id": "course_3",
        "courseName": "Responsive Web Design",
        "goodFor": "Master HTML, CSS, and modern UI principles with this beginner-friendly course.",
        "category": "Tech & Data",
        "platform": "freeCodeCamp",
        "courseUrl": "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_4": {
        "id": "course_4",
        "courseName": "Data Analytics with Python",
        "goodFor": "Introduction to data visualisation and analytics using Python.",
        "category": "Tech & Data",
        "platform": "NPTEL",
        "courseUrl": "https://nptel.ac.in/",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_5": {
        "id": "course_5",
        "courseName": "SQL for Data Science",
        "goodFor": "Foundational SQL skills for data analyst roles.",
        "category": "Tech & Data",
        "platform": "Coursera",
        "courseUrl": "https://www.coursera.org/learn/sql-for-data-science",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_6": {
        "id": "course_6",
        "courseName": "Machine Learning Specialization",
        "goodFor": "Andrew Ng's foundational ML course for data science and ML engineering tracks.",
        "category": "Tech & Data",
        "platform": "Coursera",
        "courseUrl": "https://www.coursera.org/specializations/machine-learning-introduction",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_7": {
        "id": "course_7",
        "courseName": "Financial Markets",
        "goodFor": "Demystifying stocks, bonds, and creating a portfolio that works for your goals.",
        "category": "Financial Literacy",
        "platform": "Coursera",
        "courseUrl": "https://www.coursera.org/learn/financial-markets-global",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_8": {
        "id": "course_8",
        "courseName": "Personal & Family Financial Planning",
        "goodFor": "Budgeting fundamentals and long-term financial planning basics.",
        "category": "Financial Literacy",
        "platform": "Coursera",
        "courseUrl": "https://www.coursera.org/learn/personal-family-financial-planning",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_9": {
        "id": "course_9",
        "courseName": "Khan Academy: Personal Finance",
        "goodFor": "Self-paced, beginner-friendly personal finance basics.",
        "category": "Financial Literacy",
        "platform": "Khan Academy",
        "courseUrl": "https://www.khanacademy.org/college-careers-more/personal-finance",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_10": {
        "id": "course_10",
        "courseName": "Negotiating Your First Tech Salary",
        "goodFor": "Negotiation, mediation and conflict resolution strategies for the workplace.",
        "category": "Financial Literacy",
        "platform": "Coursera",
        "courseUrl": "https://www.coursera.org/learn/negotiation-mediation-conflict-resolution",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_11": {
        "id": "course_11",
        "courseName": "Resume Writing & LinkedIn Optimization",
        "goodFor": "Craft a standout resume and LinkedIn profile for your career comeback.",
        "category": "Career Skills",
        "platform": "Coursera",
        "courseUrl": "https://www.coursera.org/",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_12": {
        "id": "course_12",
        "courseName": "Successful Career Development",
        "goodFor": "Broad career-planning strategies for navigating your professional path.",
        "category": "Career Skills",
        "platform": "Coursera",
        "courseUrl": "https://www.coursera.org/learn/career-development-planning",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_13": {
        "id": "course_13",
        "courseName": "Imposter Syndrome & You",
        "goodFor": "Strategies to overcome self-doubt and own your achievements in the workplace.",
        "category": "Career Skills",
        "platform": "YouTube (curated)",
        "courseUrl": "https://www.youtube.com/",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_14": {
        "id": "course_14",
        "courseName": "Interview Skills: Master the Interview",
        "goodFor": "Build interview fluency and confidence, ties directly into Mock Interview practice.",
        "category": "Career Skills",
        "platform": "Coursera",
        "courseUrl": "https://www.coursera.org/",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_15": {
        "id": "course_15",
        "courseName": "The Science of Well-Being",
        "goodFor": "Yale's widely-cited course on happiness and building better habits.",
        "category": "Wellness",
        "platform": "Coursera",
        "courseUrl": "https://www.coursera.org/learn/the-science-of-well-being",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_16": {
        "id": "course_16",
        "courseName": "Mindfulness and Well-being",
        "goodFor": "Practical mindfulness techniques for stress and burnout management.",
        "category": "Wellness",
        "platform": "Coursera",
        "courseUrl": "https://www.coursera.org/",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_17": {
        "id": "course_17",
        "courseName": "Women in Leadership: Inspiring Positive Change",
        "goodFor": "Leadership development designed around women's career trajectories.",
        "category": "Leadership",
        "platform": "Coursera",
        "courseUrl": "https://www.coursera.org/learn/women-in-leadership",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_18": {
        "id": "course_18",
        "courseName": "Leading People and Teams",
        "goodFor": "Michigan's specialization on team leadership and management fundamentals.",
        "category": "Leadership",
        "platform": "Coursera",
        "courseUrl": "https://www.coursera.org/specializations/leading-teams",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_19": {
        "id": "course_19",
        "courseName": "Full-Stack Web Development BootCamp",
        "goodFor": "Comprehensive guide to modern web development.",
        "category": "Tech & Data",
        "platform": "Coursera",
        "courseUrl": "#",
        "pricing": "Paid",
        "thumbnailUrl": ""
    },
    "course_20": {
        "id": "course_20",
        "courseName": "Introduction to Generative AI",
        "goodFor": "Learn the fundamentals of Generative AI.",
        "category": "Tech & Data",
        "platform": "Google Cloud",
        "courseUrl": "#",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_21": {
        "id": "course_21",
        "courseName": "Strategic Leadership in Tech",
        "goodFor": "Lead tech teams effectively.",
        "category": "Leadership",
        "platform": "NPTEL",
        "courseUrl": "#",
        "pricing": "Free",
        "thumbnailUrl": ""
    },
    "course_22": {
        "id": "course_22",
        "courseName": "Yoga and Meditation for Office Workers",
        "goodFor": "Stay healthy and focused.",
        "category": "Wellness",
        "platform": "YouTube",
        "courseUrl": "#",
        "pricing": "Free",
        "thumbnailUrl": ""
    }
},
  course_progress: {
    'aditi_123': { module3: 45 }
  },
  financial_records: {
    'aditi_123': {
      monthly_income: 45000,
      monthly_expenses: 22000,
      emergency_fund_target: 100000,
      emergency_fund_balance: 65400,
      investment_balance: 15000,
      budget_remaining: 8000
    }
  },
  expenses: [
    { id: 1, user_id: 'aditi_123', amount: 1200, category: 'Food', description: 'Weekly groceries', date: '2026-07-10' }
  ],
  budgets: {
    'aditi_123': { 'Food': 5000, 'Rent': 15000 }
  },
  career_scores: {
    'aditi_123': {
      completed_courses_score: 80,
      resume_completion_score: 95,
      skills_score: 70,
      interview_score: 85,
      certifications_score: 60,
      portfolio_score: 90,
      applications_score: 75,
      overall_score: 78
    }
  },
  skills: {
    'aditi_123': ['React', 'JavaScript', 'TailwindCSS', 'Next.js']
  },
  certificates: [
    { id: 1, user_id: 'aditi_123', title: 'React Redux Toolkit Pro', issuing_organization: 'Coursera', url: '#' }
  ],
  mentors: [
    { id: 1, name: 'Priya Sharma', title: 'VP Engineering', bio: 'Tech re-entry specialist.', email: 'priya@hernova.com', avatar_url: 'https://lh3.googleusercontent.com/aida-public/...', is_approved: true }
  ],
  mentor_sessions: {
    'aditi_123': [
      { id: 1, mentor_id: 1, meeting_time: '2026-07-15T18:00:00Z', status: 'scheduled', video_link: 'https://meet.google.com/abc-defg-hij' }
    ]
  },
  jobs: [
    { id: 1, title: 'Associate Frontend Developer (Returnship)', company: 'TechSolutions Inc', location: 'Bengaluru (Remote)', salary: '₹6-8 LPA', type: 'Remote', apply_url: '#', category: 'Engineering' }
  ],
  applications: [
    { id: 1, user_id: 'aditi_123', job_id: 1, status: 'interviewing', applied_date: '2026-07-05' }
  ],
  events: [
    { id: 1, title: 'Women Techmakers Hackathon 2026', type: 'Hackathon', location: 'Bengaluru Convention Center', date: '2026-07-20T09:00:00Z', link: '#', lat: 12.9716, lng: 77.5946 },
    { id: 2, title: 'NGO Career Restart Summit', type: 'Career Fair', location: 'Virtual', date: '2026-07-25T14:00:00Z', link: '#', lat: 12.9716, lng: 77.5946 }
  ],
  community_posts: [
    { id: 1, user_id: 'aditi_123', title: 'Passed my React Assessment!', content: 'So excited to complete the React modules. Building the returnship portal today!', image_url: '', likes_count: 5, comments_count: 1, created_at: '2026-07-10T09:00:00Z' }
  ],
  comments: {
    1: [{ id: 1, post_id: 1, user_id: 'priya_sharma', content: 'Great job Aditi! Keep up the momentum.', created_at: '2026-07-10T10:00:00Z' }]
  },
  likes: {
    1: new Set(['priya_sharma'])
  },
  notifications: [
    { id: 1, user_id: 'aditi_123', message: 'Mentor Priya Sharma accepted your connection request.', type: 'mentor_reply', is_read: false, created_at: '2026-07-10T11:00:00Z' },
    { id: 2, user_id: 'aditi_123', message: 'Upcoming meeting with Priya Sharma scheduled for July 15th.', type: 'interview_reminder', is_read: false, created_at: '2026-07-10T12:00:00Z' }
  ],
  badges: [
    { id: 1, name: 'Learning Streak', description: 'Active learner for 3 consecutive days.', image_url: 'learning_badge' },
    { id: 2, name: 'Savings Master', description: 'Saved over ₹50,000.', image_url: 'savings_badge' }
  ],
  user_badges: {
    'aditi_123': [1, 2]
  },
  ai_tasks: [
    { id: 1, user_id: 'aditi_123', task_description: 'Complete React assessment', is_completed: true, date: '2026-07-10' },
    { id: 2, user_id: 'aditi_123', task_description: 'Deposit ₹200 to Emergency Fund', is_completed: false, date: '2026-07-10' },
    { id: 3, user_id: 'aditi_123', task_description: 'Read a success story', is_completed: false, date: '2026-07-10' }
  ],
  locations: {
    'aditi_123': { lat: 12.9716, lng: 77.5946, address: 'Bengaluru, Karnataka, India' }
  },
  safety_contacts: [
    { id: 1, user_id: 'aditi_123', name: 'Ravi Roy', phone: '+91 98765 43210', relationship: 'Husband' }
  ],
  success_stories: [
    { id: 1, title: 'From 5-Year Break to Staff Engineer', content: 'Story of how Deepa returned to tech after childcare break.', image_url: '', category: 'Career Restart', author_name: 'Deepa M.', is_approved: true }
  ]
};

// -------------------------------------------------------------
// WEB SOCKET ROOMS CONFIGURATION
// -------------------------------------------------------------
io.on('connection', (socket) => {
  console.log('Socket Client connected:', socket.id);
  socket.on('register', (userId) => {
    socket.join(userId);
    console.log(`Socket client joined private room: ${userId}`);
  });
});

// -------------------------------------------------------------
// API ENDPOINTS & CONTROLLERS
// -------------------------------------------------------------

// Helper helper for sql queries or in-memory retrieval
async function fetchDashboardData(userId) {
  if (usePostgres) {
    try {
      const profileRes = await db.query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
      const financeRes = await db.query('SELECT * FROM financial_records WHERE user_id = $1', [userId]);
      const careerRes = await db.query('SELECT * FROM career_scores WHERE user_id = $1', [userId]);
      
      return {
        profile: profileRes.rows[0] || memDb.profiles[userId],
        finance: financeRes.rows[0] || memDb.financial_records[userId],
        career: careerRes.rows[0] || memDb.career_scores[userId]
      };
    } catch (err) {
      console.error('PostgreSQL Dashboard data fetch failed, using memory fallback:', err.message);
    }
  }
  return {
    profile: memDb.profiles[userId],
    finance: memDb.financial_records[userId],
    career: memDb.career_scores[userId]
  };
}

// 1. GET Dashboard Data
app.get('/api/dashboard-data/:userId', async (req, res) => {
  const { userId } = req.params;
  const data = await fetchDashboardData(userId);
  
  // Also collect notifications, progress, badges, and daily tasks
  let activeTasks = memDb.ai_tasks.filter(t => t.user_id === userId);
  let userBadgesList = memDb.user_badges[userId] || [];
  let badgesInfo = memDb.badges.filter(b => userBadgesList.includes(b.id));
  let notificationsList = memDb.notifications.filter(n => n.user_id === userId);
  let activeSessions = memDb.mentor_sessions[userId] || [];

  res.json({
    ...data,
    tasks: activeTasks,
    badges: badgesInfo,
    notifications: notificationsList,
    sessions: activeSessions
  });
});

// 2. POST Add Savings Contribution
app.post('/api/savings/:userId', async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  if (usePostgres) {
    try {
      await db.query(
        'INSERT INTO financial_records (user_id, emergency_fund_balance) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET emergency_fund_balance = financial_records.emergency_fund_balance + $2',
        [userId, amount]
      );
      const resVal = await db.query('SELECT emergency_fund_balance FROM financial_records WHERE user_id = $1', [userId]);
      return res.json({ success: true, balance: resVal.rows[0].emergency_fund_balance });
    } catch (err) {
      console.error('PostgreSQL savings POST failed, using memory:', err.message);
    }
  }

  const current = memDb.financial_records[userId]?.emergency_fund_balance || 0;
  const updated = current + Number(amount);
  if (!memDb.financial_records[userId]) memDb.financial_records[userId] = {};
  memDb.financial_records[userId].emergency_fund_balance = updated;

  res.json({ success: true, balance: updated });
});

// 3. POST Toggle AI Daily Task Completion
app.post('/api/tasks/toggle/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const idNum = Number(taskId);

  if (usePostgres) {
    try {
      await db.query('UPDATE ai_tasks SET is_completed = NOT is_completed WHERE id = $1', [idNum]);
      const taskRes = await db.query('SELECT * FROM ai_tasks WHERE id = $1', [idNum]);
      return res.json({ success: true, task: taskRes.rows[0] });
    } catch (err) {
      console.error(err.message);
    }
  }

  const task = memDb.ai_tasks.find(t => t.id === idNum);
  if (task) {
    task.is_completed = !task.is_completed;
  }
  res.json({ success: true, task });
});

// 3b. POST Create New Custom Task / Action
app.post('/api/tasks/:userId', async (req, res) => {
  const { userId } = req.params;
  const { taskDescription } = req.body;

  if (!taskDescription || !taskDescription.trim()) {
    return res.status(400).json({ error: 'Task description is required' });
  }

  const newTask = {
    id: Date.now(),
    user_id: userId,
    task_description: taskDescription,
    is_completed: false,
    date: new Date().toISOString().split('T')[0]
  };

  if (usePostgres) {
    try {
      const dbRes = await db.query(
        'INSERT INTO ai_tasks (user_id, task_description, is_completed, date) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, taskDescription, false, newTask.date]
      );
      return res.json({ success: true, task: dbRes.rows[0] });
    } catch (err) {
      console.error('PostgreSQL task insert failed, using memory:', err.message);
    }
  }

  memDb.ai_tasks.push(newTask);
  res.json({ success: true, task: newTask });
});

// 4. POST Connect with Mentor
app.post('/api/mentors/connect/:userId', (req, res) => {
  const { userId } = req.params;
  const { mentorName } = req.body;

  if (!mentorConnections[userId]) {
    mentorConnections[userId] = new Set();
  }
  mentorConnections[userId].add(mentorName);

  // Generate notification alert
  memDb.notifications.unshift({
    id: Date.now(),
    user_id: userId,
    message: `You requested connection with mentor ${mentorName}.`,
    type: 'mentor_reply',
    is_read: false,
    created_at: new Date().toISOString()
  });

  res.json({ success: true, connectedMentors: Array.from(mentorConnections[userId]) });
});

// 5. POST/DELETE Geolocation Live Tracking (SafeSphere)
app.post('/api/location/:userId', async (req, res) => {
  const { userId } = req.params;
  const { lat, lng } = req.body;

  let address = `Lat: ${Number(lat).toFixed(4)}, Lng: ${Number(lng).toFixed(4)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'HerNovaFullStackApp/1.0' }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.display_name) {
        address = data.display_name;
      }
    }
  } catch (err) {
    clearTimeout(timeoutId);
  }

  memDb.locations[userId] = { lat, lng, address, updated_at: new Date().toISOString() };
  res.json({ success: true, lat, lng, address, timestamp: new Date().toISOString() });
});

app.delete('/api/location/:userId', (req, res) => {
  const { userId } = req.params;
  delete memDb.locations[userId];
  res.json({ success: true });
});

// 6. GET Nearby Events & Hackathons (Unstop & Maps links)
app.get('/api/events/nearby', (req, res) => {
  const { lat, lng } = req.query;
  const userLat = parseFloat(lat) || 12.9716;
  const userLng = parseFloat(lng) || 77.5946;

  const nearby = [
    { 
      id: 1, 
      title: 'Women in Tech Hackathon 2026', 
      type: 'Hackathon', 
      location: 'Community Tech Center, Bengaluru (1.2 km away)', 
      date: '2026-07-20T09:00:00Z', 
      lat: userLat + 0.008, 
      lng: userLng - 0.005, 
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=Community+Tech+Center+Bengaluru`,
      applyUrl: 'https://unstop.com/hackathons?page=1&status=open'
    },
    { 
      id: 2, 
      title: 'NGO Career Restart Summit & Workshop', 
      type: 'Workshop', 
      location: 'Women Empowerment Cell, Bengaluru (2.5 km away)', 
      date: '2026-07-28T10:00:00Z', 
      lat: userLat - 0.012, 
      lng: userLng + 0.015, 
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=Women+Empowerment+Cell+Bengaluru`,
      applyUrl: 'https://www.jobsforher.com/events'
    }
  ];

  res.json({ success: true, events: nearby });
});

// 7. GET AI Recommended Opportunities (Authenticated Local Bengaluru Programs First)
app.get('/api/opportunities/recommendations', (req, res) => {
  const { skills, location } = req.query;
  const loc = location || 'Bengaluru';
  
  const recommendations = [
    { 
      title: 'Amazon WoW - Software Development Engineer (Bengaluru)', 
      company: 'Amazon India', 
      location: `${loc}, India (Hybrid)`, 
      salary: '₹15-20 LPA', 
      type: 'Full-Time / Returnship', 
      link: 'https://www.amazon.jobs/en/teams/amazonwow' 
    },
    { 
      title: 'IBM Tech Re-Entry Program - Frontend Developer (Bengaluru)', 
      company: 'IBM India', 
      location: `${loc}, India`, 
      salary: '₹12-18 LPA', 
      type: 'Returnship', 
      link: 'https://www.ibm.com/careers/in-en/tech-reentry' 
    },
    { 
      title: 'Google Women Techmakers Program 2026', 
      company: 'Google', 
      location: 'Bengaluru / Online', 
      salary: 'Dev Support & Mentorship', 
      type: 'Scholarship', 
      link: 'https://buildyourfuture.withgoogle.com/programs/women-techmakers' 
    },
    { 
      title: 'Target Ignite Returnship - Product Analyst (Bengaluru)', 
      company: 'Target India', 
      location: `${loc}, India`, 
      salary: '₹10-14 LPA', 
      type: 'Returnship', 
      link: 'https://india.target.com/careers' 
    }
  ];

  res.json({ success: true, opportunities: recommendations });
});

// -------------------------------------------------------------
// OUTSTANDING FEATURE: FLOATING AI COMPANION ASSISTANT
// -------------------------------------------------------------

app.post('/api/ai-companion', async (req, res) => {
  const { userId, prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const query = prompt.toLowerCase();
  let reply = '';
  
  // Warning: AI placeholder ready for Gemini API key configuration
  // Replace with real google AI helper in production
  
  if (query.includes('scholarship')) {
    reply = "Here are the top scholarships for women right now:\n1. Google Women Techmakers Scholarship 2026 ($1,000)\n2. Adobe India Women-in-Tech Scholarship (Tuition + Internship)\n3. L'Oréal-UNESCO For Women in Science Fellowships.\nYou can apply via the Opportunities tab!";
  } else if (query.includes('ready') || query.includes('internship')) {
    const score = memDb.career_scores[userId]?.overall_score || 78;
    reply = `Your current Career Readiness Score is ${score}/100. You have an intermediate proficiency in React & Next.js. We recommend completing the "System Design Patterns" learning module and taking 1 more Mock Interview to be fully ready for a Frontend Developer Internship!`;
  } else if (query.includes('savings') || query.includes('plan')) {
    reply = "To create a savings plan for ₹5,000/month, we recommend:\n1. Set up auto-deposit of ₹1,250 weekly.\n2. Review food/groceries budget (limit monthly to ₹4,000).\n3. Funnel this into your Emergency Fund (target: ₹1,00,000).\nI've unlocked the savings buffer goals inside your Emergency widget.";
  } else if (query.includes('career break') || query.includes('recommend courses')) {
    const profile = memDb.profiles[userId] || {};
    reply = `Since you have a previous background as a ${profile.previous_role || 'engineer'} and a break of ${profile.break_duration || '2 years'}, I recommend these courses to bridge the gap:\n1. Next.js App Router (Modern Reskilling)\n2. System Architecture Refresher\n3. Git Collaborations and Agile Methods.`;
  } else if (query.includes('event') || query.includes('networking')) {
    reply = "Here are events happening near you this weekend:\n1. Women in Tech Summit at Bengaluru Convention Center (Saturday 10 AM)\n2. NGO Career Restart Meetup (Virtual - Sunday 2 PM).\nYou can use the Emergency / Geolocation Safety Widget to navigate directly.";
  } else {
    reply = `I've received your query about "${prompt}". I am checking HerNova's PostgreSQL learning catalogs and community circles to find matching resources. Currently, you can improve your FinHer score by completing your profile and logging daily tasks!`;
  }

  res.json({ success: true, reply });
});

// -------------------------------------------------------------
// CAREER RE-ENTRY PATHMAKER ROUTE
// -------------------------------------------------------------
app.post('/api/reentry-plan/:userId', (req, res) => {
  const { userId } = req.params;
  const { previousRole, breakDuration, targetRole } = req.body;
  const yearsBreak = parseFloat(breakDuration) || 0;
  
  const learningTracks = [
    { id: 'track_1', title: 'React & Next.js Returnship Accelerator', duration: '4 weeks' },
    { id: 'track_2', title: 'System Design Patterns', duration: '2 weeks' }
  ];

  const advice = yearsBreak >= 3 
    ? `Recommend increasing emergency cushion by 6 months of expenses (₹25,000 target adjustment) to handle the returnship onboarding phase.`
    : `Recommend 3-month expense cushion (₹15,000 target adjustment) during interview stages.`;

  const steps = [
    { phase: '1. Skill Patching', description: 'Complete modernization track', items: learningTracks.map(t => `${t.title} (${t.duration})`) },
    { phase: '2. Mentorship matching', description: 'Schedule with a mentor', items: ['Priya Sharma (VP Engineering)'] },
    { phase: '3. Financial adjustments', description: advice, items: [`Cushion target: ₹${yearsBreak >= 3 ? 25000 : 15000}`] },
    { phase: '4. Support group', description: 'Join returnees circle', items: ['Tech Moms Returnship Circle'] }
  ];

  res.json({
    success: true,
    previousRole,
    breakDuration: `${yearsBreak} Years`,
    targetRole,
    plan: { steps }
  });
});

// Seed placeholders for connect matching
const mentorConnections = {};

// -------------------------------------------------------------
// OGD DATA.GOV.IN WOMEN SCHEMES CACHE ENGINE (Requirements 1-5)
// -------------------------------------------------------------
const DEFAULT_SCHEMES = [
  {
    id: 'msc_mssc',
    name: 'Mahila Samman Savings Certificate',
    ministry: 'Ministry of Finance',
    description: 'Guaranteed 7.5% per annum fixed interest rate on 2-year savings deposits up to ₹2 Lakhs.',
    eligibility: 'Open to all Indian women and girl children.',
    benefits: 'High 7.5% secure interest rate, partial withdrawal facility after 1 year.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/mssc',
    category: 'financial inclusion',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'msc_mudra',
    name: 'Pradhan Mantri Mudra Yojana for Women',
    ministry: 'Ministry of Finance',
    description: 'Collateral-free business loans up to ₹10 Lakhs with low interest rates for women micro-enterprises.',
    eligibility: 'Women entrepreneurs over 18 years starting or running proprietary concerns.',
    benefits: 'Access to business funding without collaterals or guarantees.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/pmmy',
    category: 'entrepreneurship',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'msc_standup',
    name: 'Stand-Up India Scheme for Women',
    ministry: 'Ministry of Finance',
    description: 'Composite bank loans between ₹10 Lakhs and ₹1 Crore for setting up greenfield manufacturing or service units.',
    eligibility: 'SC/ST and/or women entrepreneurs above 18 years of age.',
    benefits: 'Loan coverage of up to 75% of project cost, flexible repayment schedule.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/suis',
    category: 'entrepreneurship',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'msc_ssy',
    name: 'Sukanya Samriddhi Yojana (Girl Child Savings)',
    ministry: 'Ministry of Women and Child Development',
    description: 'Secure, high-yield sovereign savings scheme for education and wedding funds of girl children.',
    eligibility: 'Parents or legal guardians of a girl child under the age of 10 years.',
    benefits: 'Currently offering 8.2% tax-free interest under Section 80C exemptions.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/ssy',
    category: 'financial inclusion',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'msc_lakhpati',
    name: 'Lakhpati Didi Skill and Livelihood Program',
    ministry: 'Ministry of Rural Development',
    description: 'Livelihood reskilling and micro-credit access for rural women to earn at least ₹1 Lakh annually.',
    eligibility: 'Active members of Rural Self-Help Groups (SHGs).',
    benefits: 'Technical training (LED bulb assembly, drone operations, tailoring) and zero-interest micro-credits.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/lds',
    category: 'employment',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'msc_pmmvvy',
    name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    ministry: 'Ministry of Women and Child Development',
    description: 'Direct cash benefit transfers of ₹5,000 to improve health and nutrition of pregnant women.',
    eligibility: 'Pregnant and lactating mothers for their first child birth.',
    benefits: '₹5,000 cash transfer directly deposited into bank accounts in 3 installments.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/pmmvyo',
    category: 'maternity/health',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'msc_kanya_ed',
    name: 'Beti Bachao Beti Padhao Higher Education Grants',
    ministry: 'Ministry of Education',
    description: 'Merit-linked scholarships and admission aids for girl students pursuing professional degrees.',
    eligibility: 'Indian girl students who completed secondary education with first-class grades.',
    benefits: '100% tuition fee reimbursement and free residential hostel facilities.',
    applyUrl: 'https://www.myscheme.gov.in/schemes/bbbp',
    category: 'education',
    lastUpdated: new Date().toISOString()
  }
];

let schemesCache = {
  data: [...DEFAULT_SCHEMES],
  lastUpdated: new Date().toISOString(),
  isRefreshing: false
};

function determineCategory(r) {
  const text = `${r.scheme_name || r.name || ''} ${r.description || r.scheme_details || ''} ${r.benefits || ''}`.toLowerCase();
  if (text.includes('maternity') || text.includes('health') || text.includes('pregnant') || text.includes('mother') || text.includes('nutrition')) {
    return 'maternity/health';
  }
  if (text.includes('education') || text.includes('scholarship') || text.includes('student') || text.includes('school') || text.includes('college')) {
    return 'education';
  }
  if (text.includes('employ') || text.includes('skill') || text.includes('job') || text.includes('career') || text.includes('reskill')) {
    return 'employment';
  }
  if (text.includes('save') || text.includes('deposit') || text.includes('interest') || text.includes('provident') || text.includes('insurance') || text.includes('financial')) {
    return 'financial inclusion';
  }
  if (text.includes('entrepreneur') || text.includes('business') || text.includes('loan') || text.includes('startup') || text.includes('mudra') || text.includes('credit')) {
    return 'entrepreneurship';
  }
  return 'financial inclusion';
}

async function refreshSchemesCache() {
  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey) {
    console.log('[OGD Schemes Cache] No DATA_GOV_API_KEY found in process.env. Serving high-quality local cache.');
    schemesCache.lastUpdated = new Date().toISOString();
    return;
  }

  try {
    console.log('[OGD Schemes Cache] Contacting official data.gov.in API...');
    // Real OGD catalog resource ID for government welfare schemes
    const resourceId = '3067c29e-2dc8-444c-9f8d-bd1ea60a0f8b';
    const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=50`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`data.gov.in responded with HTTP ${response.status}`);
    }

    const json = await response.json();
    if (!json || !json.records || !Array.isArray(json.records)) {
      throw new Error('data.gov.in returned malformed JSON or empty records catalog list.');
    }

    const normalized = json.records.map((r, idx) => ({
      id: r.id || `ogd_scheme_${idx}`,
      name: r.scheme_name || r.name || 'Pradhan Mantri Welfare Scheme',
      ministry: r.ministry || r.department_name || 'Ministry of Women and Child Development',
      description: r.description || r.scheme_details || 'Government welfare initiative assisting women across India.',
      eligibility: r.eligibility || r.eligibility_criteria || 'Women citizens matching standard income thresholds.',
      benefits: r.benefits || r.financial_assistance || 'Subsidies, grants, or soft-term bank loans.',
      applyUrl: r.apply_url || r.official_link || 'https://www.myscheme.gov.in',
      category: determineCategory(r),
      lastUpdated: new Date().toISOString()
    }));

    if (normalized.length > 0) {
      schemesCache.data = normalized;
      schemesCache.lastUpdated = new Date().toISOString();
      console.log(`[OGD Schemes Cache] Successfully updated ${normalized.length} records from data.gov.in API.`);
    }
  } catch (err) {
    console.error('[OGD Schemes Cache] Background refresh failed. Serving cached data fallback. Error:', err.message);
  }
}

// Trigger initial refresh on start
refreshSchemesCache();

// Scheduled refresh catalog task running every 24 hours
setInterval(() => {
  if (!schemesCache.isRefreshing) {
    schemesCache.isRefreshing = true;
    refreshSchemesCache().finally(() => {
      schemesCache.isRefreshing = false;
    });
  }
}, 24 * 60 * 60 * 1000);

// Endpoint route GET /api/courses
app.get('/api/courses', (req, res) => {
  const category = req.query.category;
  let courses = Object.values(memDb.courses || {});
  if (category) {
    courses = courses.filter(c => c.category === category);
  }
  res.json({ courses });
});

// Endpoint route GET /api/schemes/women
app.get('/api/schemes/women', (req, res) => {
  const now = new Date();
  const lastUpdatedDate = new Date(schemesCache.lastUpdated);
  const diffHours = (now - lastUpdatedDate) / (1000 * 60 * 60);

  // If cache is stale (> 24 hours) and not already refreshing, trigger background update
  if (diffHours >= 24 && !schemesCache.isRefreshing) {
    schemesCache.isRefreshing = true;
    console.log('[OGD Schemes Cache] Cache age exceeded 24 hours. Refreshing in background...');
    refreshSchemesCache().finally(() => {
      schemesCache.isRefreshing = false;
    });
  }

  res.json({
    schemes: schemesCache.data,
    lastUpdated: schemesCache.lastUpdated
  });
});

// Start Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`HerNova Live Backend Server running on port ${PORT}`);
});
