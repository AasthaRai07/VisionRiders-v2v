const express = require('express');
const admin = require('firebase-admin');
const { 
  generateInterviewQuestions, 
  generateInterviewFeedback, 
  rewriteGapExplanation 
} = require('../ai/gemini');

const router = express.Router();

router.post('/start', async (req, res) => {
  try {
    const { target_role } = req.body;
    
    // Fetch user gap duration
    const userDoc = await admin.firestore().collection('users').doc(req.user.uid).get();
    const gapDuration = userDoc.exists ? userDoc.data().career_gap_duration_years || 2 : 2;
    
    const questions = await generateInterviewQuestions(target_role, gapDuration);
    
    const sessionData = {
      user_id: req.user.uid,
      target_role,
      questions_asked: questions,
      user_answers: new Array(questions.length).fill(""),
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      status: 'in_progress'
    };
    
    const docRef = await admin.firestore().collection('interview_sessions').add(sessionData);
    
    res.json({ session_id: docRef.id, questions });
  } catch (error) {
    console.error("Error starting interview:", error);
    res.status(500).json({ error: "Failed to start interview" });
  }
});

router.post('/answer', async (req, res) => {
  try {
    const { session_id, question_index, answer_text } = req.body;
    
    const sessionRef = admin.firestore().collection('interview_sessions').doc(session_id);
    const sessionDoc = await sessionRef.get();
    
    if (!sessionDoc.exists || sessionDoc.data().user_id !== req.user.uid) {
      return res.status(404).json({ error: "Session not found or access denied" });
    }
    
    const answers = [...sessionDoc.data().user_answers];
    answers[question_index] = answer_text;
    
    await sessionRef.update({ user_answers: answers });
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ error: "Failed to submit answer" });
  }
});

router.post('/complete', async (req, res) => {
  try {
    const { session_id } = req.body;
    
    const sessionRef = admin.firestore().collection('interview_sessions').doc(session_id);
    const sessionDoc = await sessionRef.get();
    
    if (!sessionDoc.exists || sessionDoc.data().user_id !== req.user.uid) {
      return res.status(404).json({ error: "Session not found or access denied" });
    }
    
    const data = sessionDoc.data();
    
    // Map questions and answers for feedback
    const qaPair = data.questions_asked.map((q, i) => ({
      question: q,
      answer: data.user_answers[i] || ""
    }));
    
    // Generate Feedback
    const feedback = await generateInterviewFeedback(qaPair);
    
    // Identify gap explanation answer (assuming it's one of the questions that explicitly asks about the gap)
    // For simplicity, let's find the question containing "gap" or "time off"
    let gapIndex = data.questions_asked.findIndex(q => q.toLowerCase().includes('gap') || q.toLowerCase().includes('time off') || q.toLowerCase().includes('break'));
    if (gapIndex === -1) gapIndex = data.questions_asked.length - 1; // Fallback
    
    const originalGapAnswer = data.user_answers[gapIndex];
    let rewrite = null;
    if (originalGapAnswer && originalGapAnswer.trim().length > 10) {
      rewrite = await rewriteGapExplanation(originalGapAnswer);
    }
    
    await sessionRef.update({
      status: 'completed',
      feedback: feedback,
      gap_explanation_original: originalGapAnswer,
      gap_explanation_rewritten: rewrite ? rewrite.rewritten_answer : null,
      highlighted_changes: rewrite ? rewrite.highlighted_changes : []
    });
    
    res.json({
      success: true,
      feedback,
      rewrite
    });
  } catch (error) {
    console.error("Error completing interview:", error);
    res.status(500).json({ error: "Failed to complete interview" });
  }
});

module.exports = router;
