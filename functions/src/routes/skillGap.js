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
    const { resume_text, target_role, user_type, industry, is_pdf } = req.body;
    
    if (!resume_text || !target_role) {
      return res.status(400).json({ error: "Missing resume_text or target_role" });
    }

    let parsedText = resume_text;
    if (is_pdf) {
      try {
        const pdfParse = require('pdf-parse');
        const buffer = Buffer.from(resume_text, 'base64');
        const pdfData = await pdfParse(buffer);
        parsedText = pdfData.text;
      } catch (err) {
        console.error("Failed to parse PDF:", err);
        return res.status(400).json({ error: "Failed to parse PDF file. Ensure it is a valid PDF." });
      }
    }
    
    const effectiveUserType = user_type || 'professional';
    const effectiveIndustry = industry || 'Tech';
    
    // 1. Extract Profile (userType-aware and industry-aware)
    const extractedData = await parseResumeAndExtractProfile(parsedText, target_role, effectiveUserType, effectiveIndustry);
    
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
      created_at: new Date()
    };
    
    // Mock saving to Firestore since it's hanging
    // const docRef = await admin.firestore().collection('skill_gap_reports').add(reportData);
    
    res.json({ id: "mock_report_123", ...reportData });
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
    
    // Mock latest report to avoid firestore hang
    const mockDb = require('../../mock-db.json');
    const mockReports = Object.values(mockDb.skill_gap_reports || {});
    const userReports = mockReports.filter(r => r.user_id === req.params.userId);
    
    if (userReports.length === 0) {
      return res.json({ report: null });
    }
    
    // Just return the first one as a mock
    res.json({ report: { id: "mock_report_123", ...userReports[0] } });
  } catch (error) {
    console.error("Error fetching latest skill gap:", error);
    res.status(500).json({ error: "Failed to fetch latest skill gap" });
  }
});

router.post('/:reportId/toggle-day', async (req, res) => {
  try {
    const { day, completed } = req.body;
    if (day === undefined || completed === undefined) {
      return res.status(400).json({ error: "Missing day or completed status" });
    }

    const docRef = admin.firestore().collection('skill_gap_reports').doc(req.params.reportId);
    
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Report not found" });
    }
    if (doc.data().user_id !== req.user.uid) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (completed) {
      await docRef.update({
        completed_days: admin.firestore.FieldValue.arrayUnion(day)
      });
    } else {
      await docRef.update({
        completed_days: admin.firestore.FieldValue.arrayRemove(day)
      });
    }

    res.json({ success: true, day, completed });
  } catch (error) {
    console.error("Error toggling day completion:", error);
    res.status(500).json({ error: "Failed to toggle day completion" });
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
    const mockDb = require('../../mock-db.json');
    const roles = Object.keys(mockDb.targetRoles || {}).map(key => ({ id: key, ...mockDb.targetRoles[key] }));
    res.json({ roles });
  } catch (error) {
    console.error("Error fetching target roles:", error);
    res.status(500).json({ error: "Failed to fetch target roles" });
  }
});

module.exports = router;
