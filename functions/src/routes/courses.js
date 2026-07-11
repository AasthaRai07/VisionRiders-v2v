const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    // Fallback to mock data
    const mockDb = require('../../mock-db.json');
    let courses = Object.values(mockDb.courses || {});
    
    if (category) {
      courses = courses.filter(c => c.category === category);
    }
    
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
    const mockDb = require('../../mock-db.json');
    const course = mockDb.courses[req.params.courseId];
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ error: "Failed to fetch course details" });
  }
});

module.exports = router;
