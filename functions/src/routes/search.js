const express = require('express');
const admin = require('firebase-admin');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const query = req.query.q || '';
    if (!query.trim()) {
      return res.json({ results: [] });
    }

    const qLower = query.toLowerCase();
    
    // 1. Fetch local courses
    const snapshot = await admin.firestore().collection('courses').get();
    const allCourses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // 2. Filter locally (partial match)
    const localMatches = allCourses.filter(course => {
      return (course.courseName && course.courseName.toLowerCase().includes(qLower)) ||
             (course.category && course.category.toLowerCase().includes(qLower)) ||
             (course.goodFor && course.goodFor.toLowerCase().includes(qLower));
    }).map(c => ({ ...c, source: 'local' }));
    
    // If we have 5 or more local matches, just return them
    if (localMatches.length >= 5) {
      return res.json({ results: localMatches });
    }

    // 3. Fallback to AI Generation if less than 5 matches
    let aiMatches = [];
    try {
      if (process.env.GEMINI_API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const prompt = `You are a learning platform assistant. The user searched for "${query}". 
We only found ${localMatches.length} local courses. Please generate ${5 - localMatches.length} highly relevant, realistic course suggestions from platforms like NPTEL, YouTube, Udemy, Coursera, or edX.
Return the result strictly as a JSON array of objects with the following keys:
- courseName (string)
- platform (string)
- pricing (string, e.g. "Free", "Paid", "Free to audit")
- goodFor (string, short description of who it's for)
- courseUrl (string, a plausible URL for the course)
Do not use markdown formatting like \`\`\`json. Return raw JSON array only.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });

        const rawText = response.text.trim();
        let parsedData = [];
        try {
            // Clean up possible markdown if the model still returns it
            const cleanedText = rawText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
            parsedData = JSON.parse(cleanedText);
            
            if (Array.isArray(parsedData)) {
                aiMatches = parsedData.map((item, i) => ({
                    id: `ai-${Date.now()}-${i}`,
                    ...item,
                    category: 'Suggested',
                    source: 'ai'
                }));
            }
        } catch (parseErr) {
            console.error("Failed to parse Gemini response as JSON:", rawText);
        }
      } else {
        console.warn("No GEMINI_API_KEY found, skipping AI fallback.");
      }
    } catch (aiErr) {
      console.error("AI Generation failed:", aiErr);
    }
    
    // Combine and return
    const combinedResults = [...localMatches, ...aiMatches];
    res.json({ results: combinedResults });

  } catch (error) {
    console.error("Error in search:", error);
    res.status(500).json({ error: "Failed to perform search" });
  }
});

module.exports = router;
