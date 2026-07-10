const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { industry, availability } = req.query;
    let query = admin.firestore().collection('mentors');
    
    // Simplistic filtering, usually requires complex indexes if combining filters
    if (industry) {
      // Assuming skill_tags represents industry for simplicity
      query = query.where('skill_tags', 'array-contains', industry);
    }
    
    const snapshot = await query.get();
    let mentors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    if (availability) {
      mentors = mentors.filter(m => m.availability_status === availability);
    }
    
    res.json({ mentors });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    res.status(500).json({ error: "Failed to fetch mentors" });
  }
});

router.post('/:mentorId/connect', async (req, res) => {
  try {
    // Requires Authentication (middleware runs before this)
    const { mentorId } = req.params;
    
    await admin.firestore().collection('mentor_connections').add({
      user_id: req.user.uid,
      mentor_id: mentorId,
      status: 'requested',
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ success: true, message: "Connection request sent" });
  } catch (error) {
    console.error("Error connecting to mentor:", error);
    res.status(500).json({ error: "Failed to send connection request" });
  }
});

module.exports = router;
