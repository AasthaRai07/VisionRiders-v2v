const express = require('express');
const admin = require('firebase-admin');
const { checkJobEligibility, parseResume, chatWithJobCoach } = require('../ai/jobsAi');
const { aggregateAllJobs } = require('../services/jobAggregator');

const router = express.Router();

// Helper to seed jobs if none exist
async function ensureJobsSeeded() {
  const db = admin.firestore();
  const snapshot = await db.collection('jobs').get();
  if (snapshot.empty) {
    console.log("No jobs in database. Fetching and seeding aggregated jobs...");
    const aggregated = await aggregateAllJobs();
    const batch = db.batch();
    aggregated.forEach(job => {
      const docRef = db.collection('jobs').doc();
      batch.set(docRef, job);
    });
    await batch.commit();
    console.log(`Seeded ${aggregated.length} jobs.`);
  }
}

// 1. GET / - Fetch and filter jobs
router.get('/', async (req, res) => {
  try {
    await ensureJobsSeeded();
    const db = admin.firestore();
    
    const { q, category, mode, type, experience, womenFriendly, returnshipOnly, location } = req.query;
    
    let snapshot = await db.collection('jobs').get();
    let jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Global text search (fuzzy)
    if (q) {
      const queryText = q.toLowerCase().trim();
      jobs = jobs.filter(job => {
        const title = (job.title || '').toLowerCase();
        const company = (job.company || '').toLowerCase();
        const desc = (job.description || '').toLowerCase();
        const loc = (job.location || '').toLowerCase();
        const skills = Array.isArray(job.required_skills) 
          ? job.required_skills.join(' ').toLowerCase() 
          : (job.required_skills || '').toLowerCase();
          
        return title.includes(queryText) || 
               company.includes(queryText) || 
               desc.includes(queryText) || 
               loc.includes(queryText) || 
               skills.includes(queryText);
      });
    }

    // Advanced Filters
    if (category) {
      jobs = jobs.filter(j => j.category === category);
    }
    if (mode) {
      jobs = jobs.filter(j => (j.work_mode || '').toLowerCase() === mode.toLowerCase());
    }
    if (type) {
      jobs = jobs.filter(j => (j.job_type || '').toLowerCase() === type.toLowerCase());
    }
    if (experience) {
      jobs = jobs.filter(j => (j.experience || '').toLowerCase() === experience.toLowerCase());
    }
    if (womenFriendly === 'true') {
      jobs = jobs.filter(j => j.women_friendly_score >= 90);
    }
    if (returnshipOnly === 'true') {
      jobs = jobs.filter(j => (j.job_type || '').toLowerCase() === 'returnship');
    }
    if (location) {
      const locText = location.toLowerCase();
      jobs = jobs.filter(j => (j.location || '').toLowerCase().includes(locText) || (j.state || '').toLowerCase().includes(locText));
    }

    // Sort: Returnships and high women friendly scores first, then newest
    jobs.sort((a, b) => {
      const aRet = (a.job_type === 'Returnship') ? 1 : 0;
      const bRet = (b.job_type === 'Returnship') ? 1 : 0;
      if (aRet !== bRet) return bRet - aRet;
      
      const aScore = a.women_friendly_score || 0;
      const bScore = b.women_friendly_score || 0;
      if (aScore !== bScore) return bScore - aScore;
      
      return new Date(b.posted_date) - new Date(a.posted_date);
    });

    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// Manual Sync/Refresh Jobs (for Admin)
router.post('/sync', async (req, res) => {
  try {
    const db = admin.firestore();
    const snapshot = await db.collection('jobs').get();
    
    // Clear old jobs
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    
    // Re-aggregate and save
    const aggregated = await aggregateAllJobs();
    const saveBatch = db.batch();
    aggregated.forEach(job => {
      const docRef = db.collection('jobs').doc();
      saveBatch.set(docRef, job);
    });
    await saveBatch.commit();
    
    res.json({ success: true, message: `Synced and updated ${aggregated.length} jobs.` });
  } catch (error) {
    console.error("Failed to sync jobs:", error);
    res.status(500).json({ error: "Sync failed" });
  }
});

// GET /analytics - User applications rates and technological reskilling stats
router.get('/analytics', async (req, res) => {
  try {
    const userId = req.user?.uid || 'demo-user-123';
    const db = admin.firestore();
    
    // Fetch apps
    const appsSnap = await db.collection('applications').where('user_id', '==', userId).get();
    const apps = appsSnap.docs.map(doc => doc.data());
    
    const sent = apps.length;
    const interviews = apps.filter(a => ['interviewing', 'interview scheduled', 'interview'].includes(a.status?.toLowerCase())).length;
    const offers = apps.filter(a => ['offered', 'offer received', 'accepted'].includes(a.status?.toLowerCase())).length;
    
    const interviewRate = sent > 0 ? Math.round((interviews / sent) * 100) : 0;
    const offerRate = sent > 0 ? Math.round((offers / sent) * 100) : 0;
    
    // Mock analytics details
    res.json({
      success: true,
      sentCount: sent || 5,
      interviewRate: interviewRate || 40,
      offerRate: offerRate || 20,
      completionScore: 85,
      trendingCareers: [
        { title: 'Full Stack Engineer', growth: '+24%' },
        { title: 'Data Scientist', growth: '+18%' },
        { title: 'DevOps Returner', growth: '+15%' }
      ],
      skillsScore: 78
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load analytics" });
  }
});

// GET /insights - Dynamic tech & career trends
router.get('/insights', async (req, res) => {
  res.json({
    success: true,
    trendingTech: ['React', 'Next.js Router', 'AWS Basics', 'Python Data Cleaning', 'Kubernetes'],
    highestPayingSkills: ['Machine Learning', 'AWS Solutions Architect', 'Docker Orchestration', 'PostgreSQL Admin'],
    hiringCities: ['Bengaluru', 'Pune', 'Mumbai', 'Hyderabad', 'Remote'],
    fastestGrowing: 'AI Application Engineering'
  });
});

// 2. GET /:id - Fetch job details
router.get('/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const db = admin.firestore();
    const doc = await db.collection('jobs').doc(jobId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: "Job not found" });
    }
    
    res.json({ success: true, job: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ error: "Failed to fetch job details" });
  }
});

// 3. POST /:id/check-eligibility - Gemini eligibility check
router.post('/:jobId/check-eligibility', async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.uid || 'demo-user-123';
    const db = admin.firestore();
    
    // Fetch job details
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    if (!jobDoc.exists) return res.status(404).json({ error: "Job not found" });
    const jobDetails = { id: jobDoc.id, ...jobDoc.data() };
    
    // Fetch user profile & skills
    const profileDoc = await db.collection('profiles').doc(userId).get();
    let profileData = {};
    if (profileDoc.exists) {
      profileData = profileDoc.data();
    }
    
    // Get user skills
    const skillsSnap = await db.collection('skills').where('user_id', '==', userId).get();
    const userSkills = skillsSnap.docs.map(d => d.data().name);
    
    // Merge user profile details
    const userProfile = {
      skills: userSkills.length > 0 ? userSkills : ['React', 'JavaScript', 'HTML', 'CSS', 'TailwindCSS'],
      target_role: profileData.target_role || 'Software Engineer',
      break_duration: profileData.break_duration || '2 Years'
    };
    
    const analysis = await checkJobEligibility(userProfile, jobDetails);
    
    // Find matching courses from database based on recommendedCourseTerms
    const coursesSnap = await db.collection('courses').get();
    const allCourses = coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const recommendedCourses = allCourses.filter(course => {
      const text = (course.title + ' ' + course.description + ' ' + course.category).toLowerCase();
      return (analysis.recommendedCourseTerms || []).some(term => text.includes(term.toLowerCase()));
    }).slice(0, 2);
    
    // Find matching mentors from database
    const mentorsSnap = await db.collection('mentors').get();
    const allMentors = mentorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const recommendedMentors = allMentors.slice(0, 1);
    
    res.json({
      success: true,
      analysis,
      courses: recommendedCourses.length > 0 ? recommendedCourses : allCourses.slice(0, 2),
      mentors: recommendedMentors
    });
  } catch (error) {
    console.error("Eligibility checker error:", error);
    res.status(500).json({ error: "Failed to evaluate eligibility" });
  }
});

// 4. POST /:id/coach - Chat with AI Coach
router.post('/:jobId/coach', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { message, chatHistory } = req.body;
    const db = admin.firestore();
    
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    if (!jobDoc.exists) return res.status(404).json({ error: "Job not found" });
    const jobDetails = { id: jobDoc.id, ...jobDoc.data() };
    
    const reply = await chatWithJobCoach(jobDetails, chatHistory, message);
    res.json({ success: true, reply });
  } catch (error) {
    console.error("AI Coach error:", error);
    res.status(500).json({ error: "AI Coach failed to respond" });
  }
});

// 5. POST /parse-resume - Upload/Parse resume text to profile
router.post('/parse-resume', async (req, res) => {
  try {
    const { resumeText } = req.body;
    const userId = req.user?.uid || 'demo-user-123';
    const db = admin.firestore();
    
    const parsed = await parseResume(resumeText);
    
    // Save extracted skills to user skills collection
    if (parsed.skills && Array.isArray(parsed.skills)) {
      const batch = db.batch();
      for (const skill of parsed.skills) {
        const skillDocRef = db.collection('skills').doc(`${userId}_${skill.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
        batch.set(skillDocRef, {
          user_id: userId,
          name: skill,
          proficiency: 'Intermediate'
        }, { merge: true });
      }
      await batch.commit();
    }
    
    res.json({ success: true, parsed });
  } catch (error) {
    console.error("Resume parsing error:", error);
    res.status(500).json({ error: "Failed to parse resume" });
  }
});

// 6. POST /:id/apply - Apply/track application
router.post('/:jobId/apply', async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.uid || 'demo-user-123';
    const { status } = req.body; // Applied | Interviewing | Offer | etc.
    const db = admin.firestore();
    
    const appRef = db.collection('applications').doc(`${userId}_${jobId}`);
    await appRef.set({
      user_id: userId,
      job_id: jobId,
      status: status || 'Applied',
      applied_date: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    res.json({ success: true, message: "Application tracked successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to track application" });
  }
});

module.exports = router;
