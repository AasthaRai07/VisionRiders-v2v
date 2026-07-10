const express = require('express');
const admin = require('firebase-admin');
const { 
  parseResumeAndExtractProfile, 
  generateSkillGapAnalysis,
  getSkillGapPromptAndKeys
} = require('../ai/gemini');

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { resume_text, target_role, user_type, industry } = req.body;
    
    if (!resume_text || !target_role) {
      return res.status(400).json({ error: "Missing resume_text or target_role" });
    }
    
    const effectiveUserType = user_type || 'professional';
    const effectiveIndustry = industry || 'Tech';
    
    // 1. Extract Profile (userType-aware and industry-aware)
    const extractedData = await parseResumeAndExtractProfile(resume_text, target_role, effectiveUserType, effectiveIndustry);
    
    // 2. Generate Skill Gap Analysis (userType-aware and industry-aware)
    const gapAnalysis = await generateSkillGapAnalysis(extractedData.extracted_skills, target_role, effectiveUserType, effectiveIndustry);
    
    // 3. Store in Firestore
    const reportData = {
      user_id: req.user.uid,
      user_type: effectiveUserType,
      target_role,
      extracted_skills: extractedData.extracted_skills,
      bucket1: gapAnalysis.bucket1,
      bucket2: gapAnalysis.bucket2,
      bucket3: gapAnalysis.bucket3,
      labels: gapAnalysis.labels,
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

// Get labels config for a given userType (no AI call needed)
router.get('/labels/:userType', (req, res) => {
  const config = getSkillGapPromptAndKeys(req.params.userType);
  res.json({
    bucket1Label: config.bucket1Label,
    bucket2Label: config.bucket2Label,
    bucket3Label: config.bucket3Label,
    planTitle: config.planTitle
  });
});

// Get all target roles for autocomplete
router.get('/roles', async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('targetRoles').get();
    const roles = [];
    snapshot.forEach(doc => {
      roles.push({ id: doc.id, ...doc.data() });
    });
    res.json({ roles });
  } catch (error) {
    console.error("Error fetching target roles:", error);
    res.status(500).json({ error: "Failed to fetch target roles" });
  }
});

module.exports = router;
