const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { remote, returnship } = req.query;
    let query = admin.firestore().collection('jobs');
    
    if (remote === 'true') {
      query = query.where('is_remote', '==', true);
    }
    if (returnship === 'true') {
      query = query.where('is_returnship_friendly', '==', true);
    }
    
    const snapshot = await query.get();
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

router.post('/:jobId/save', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    await admin.firestore().collection('saved_jobs').add({
      user_id: req.user.uid,
      job_id: jobId,
      saved_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ success: true, message: "Job saved successfully" });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ error: "Failed to save job" });
  }
});

module.exports = router;
