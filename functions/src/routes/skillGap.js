const express = require('express');
const admin = require('firebase-admin');
const { 
  parseResumeAndExtractProfile, 
  generateSkillGapAnalysis 
} = require('../ai/gemini');

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { resume_text, target_role } = req.body;
    
    if (!resume_text || !target_role) {
      return res.status(400).json({ error: "Missing resume_text or target_role" });
    }
    
    // 1. Extract Profile
    const extractedData = await parseResumeAndExtractProfile(resume_text, target_role);
    
    // 2. Generate Skill Gap Analysis
    const gapAnalysis = await generateSkillGapAnalysis(extractedData.extracted_skills, target_role);
    
    // 3. Store in Firestore
    const reportData = {
      user_id: req.user.uid,
      target_role,
      extracted_skills: extractedData.extracted_skills,
      still_solid_skills: gapAnalysis.still_solid,
      decayed_skills: gapAnalysis.decayed,
      new_skills: gapAnalysis.new_since_left,
      seven_day_plan: gapAnalysis.seven_day_plan,
      ats_keyword_flags: extractedData.ats_keyword_flags,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await admin.firestore().collection('skill_gap_reports').add(reportData);
    
    res.json({ id: docRef.id, ...reportData });
  } catch (error) {
    console.error("Error analyzing skill gap:", error);
    res.status(500).json({ error: "Failed to analyze skill gap", details: error.message });
  }
});

router.get('/:userId/latest', async (req, res) => {
  try {
    if (req.user.uid !== req.params.userId) {
      return res.status(403).json({ error: "Access denied to this user's data" });
    }
    
    const snapshot = await admin.firestore().collection('skill_gap_reports')
      .where('user_id', '==', req.params.userId)
      .orderBy('created_at', 'desc')
      .limit(1)
      .get();
      
    if (snapshot.empty) {
      return res.json({ report: null });
    }
    
    res.json({ report: { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } });
  } catch (error) {
    console.error("Error fetching latest skill gap:", error);
    res.status(500).json({ error: "Failed to fetch latest skill gap" });
  }
});

module.exports = router;
