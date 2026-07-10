const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Middleware to ensure user is accessing their own data
const verifyUserAccess = (req, res, next) => {
  if (req.user.uid !== req.params.userId) {
    return res.status(403).json({ error: "Access denied to this user's data" });
  }
  next();
};

// Get user profile (includes persona for Skill Gap page)
router.get('/:userId/profile', verifyUserAccess, async (req, res) => {
  try {
    const doc = await admin.firestore().collection('users').doc(req.params.userId).get();
    if (!doc.exists) {
      return res.json({ profile: null });
    }
    res.json({ profile: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

router.post('/:userId/userProgress', verifyUserAccess, async (req, res) => {
  try {
    const { courseId, currentModule, totalModules } = req.body;
    const percentComplete = Math.round((currentModule / totalModules) * 100);
    
    const docRef = admin.firestore().collection('userProgress').doc(`${req.params.userId}_${courseId}`);
    
    await docRef.set({
      userId: req.params.userId,
      courseId,
      currentModule,
      totalModules,
      percentComplete,
      lastAccessedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    res.json({ success: true, percentComplete });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

router.get('/:userId/userProgress', verifyUserAccess, async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('userProgress')
      .where('userId', '==', req.params.userId)
      .orderBy('lastAccessedAt', 'desc')
      .limit(4)
      .get();
      
    const progressList = [];
    
    // Fetch course details for each progress item
    for (const doc of snapshot.docs) {
      const data = doc.data();
      let courseDetails = null;
      if (data.courseId) {
        const courseDoc = await admin.firestore().collection('courses').doc(data.courseId).get();
        if (courseDoc.exists) {
          courseDetails = courseDoc.data();
        }
      }
      progressList.push({
        ...data,
        courseDetails
      });
    }
    
    res.json({ progress: progressList });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ error: "Failed to fetch user progress" });
  }
});

router.get('/:userId/recommendations', verifyUserAccess, async (req, res) => {
  try {
    // 1. Get latest skill gap report
    const snapshot = await admin.firestore().collection('skill_gap_reports')
      .where('user_id', '==', req.params.userId)
      .orderBy('created_at', 'desc')
      .limit(1)
      .get();
      
    let recommendations = [];
    
    if (snapshot.empty) {
      // Return default top courses if no skill gap report
      const coursesSnap = await admin.firestore().collection('courses').limit(3).get();
      recommendations = coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      const report = snapshot.docs[0].data();
      const needsHelp = [...(report.decayed_skills || []), ...(report.new_skills || [])];
      
      // A simplistic recommendation logic: pull courses and filter by keyword match
      const coursesSnap = await admin.firestore().collection('courses').get();
      const allCourses = coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      recommendations = allCourses.filter(course => {
        const text = (course.title + " " + course.description + " " + course.category).toLowerCase();
        return needsHelp.some(skill => text.includes(skill.toLowerCase()));
      }).slice(0, 3);
      
      if (recommendations.length === 0) {
         recommendations = allCourses.slice(0, 3);
      }
    }
    
    res.json({ recommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

router.post('/:userId/bookmarks', verifyUserAccess, async (req, res) => {
  try {
    const { course_id } = req.body;
    await admin.firestore().collection('bookmarks').add({
      user_id: req.params.userId,
      course_id,
      saved_at: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(500).json({ error: "Failed to add bookmark" });
  }
});

router.get('/:userId/finher-score', verifyUserAccess, async (req, res) => {
  try {
    const doc = await admin.firestore().collection('finher_scores').doc(req.params.userId).get();
    if (!doc.exists) {
      return res.json({ score: 0, history: [] });
    }
    res.json(doc.data());
  } catch (error) {
    console.error("Error fetching FinHer score:", error);
    res.status(500).json({ error: "Failed to fetch FinHer score" });
  }
});

module.exports = router;
