const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = admin.firestore().collection('courses');
    
    if (category) {
      query = query.where('category', '==', category);
    }
    
    const snapshot = await query.get();
    let courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    if (search) {
      const searchLower = search.toLowerCase();
      courses = courses.filter(c => c.title.toLowerCase().includes(searchLower) || c.description.toLowerCase().includes(searchLower));
    }
    
    res.json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

router.get('/:courseId', async (req, res) => {
  try {
    const doc = await admin.firestore().collection('courses').doc(req.params.courseId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ error: "Failed to fetch course details" });
  }
});

module.exports = router;
