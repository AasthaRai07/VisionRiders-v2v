const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = 'gemini-2.5-flash';

const BASELINE_SKILLS = {
  'Software Developer': [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Git', 'REST APIs', 
    'SQL', 'NoSQL', 'Agile Methodologies', 'System Design', 'CI/CD'
  ],
  'Data Analyst': [
    'SQL', 'Python', 'Excel', 'Tableau', 'PowerBI', 'Data Visualization', 
    'Statistical Analysis', 'A/B Testing', 'Data Cleaning', 'Pandas'
  ],
  'Mechanical Design Engineer': [
    'CAD', 'SolidWorks', 'AutoCAD', 'Thermodynamics', 'Fluid Mechanics', 
    'FEA', 'Manufacturing Processes', 'GD&T', 'Material Science', 'Prototyping'
  ],
  'Electrical/Embedded Engineer': [
    'C', 'C++', 'Microcontrollers', 'PCB Design', 'Circuit Analysis', 
    'RTOS', 'Oscilloscopes', 'VHDL/Verilog', 'Signal Processing', 'I2C/SPI/UART'
  ],
  'Data Scientist/ML Engineer': [
    'Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 
    'NLP', 'Computer Vision', 'SQL', 'Data Modeling', 'Cloud Platforms (AWS/GCP)'
  ]
};

async function parseResumeAndExtractProfile(resumeText, targetRole) {
  try {
    const prompt = `
      You are an expert technical recruiter analyzing a resume for a ${targetRole} role.
      Extract the following information and return it strictly as JSON. No markdown formatting, just raw JSON.
      
      {
        "extracted_skills": ["skill1", "skill2"],
        "past_roles": ["role1", "role2"],
        "years_of_experience": 5.5,
        "gap_duration_years": 2.0,
        "ats_keyword_flags": ["missing keyword 1", "missing keyword 2"]
      }

      Resume Text:
      ${resumeText}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    // Clean up potential markdown formatting in the response
    const jsonString = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing resume with Gemini:", error);
    throw new Error("Failed to parse resume.");
  }
}

async function generateSkillGapAnalysis(extractedSkills, targetRole) {
  try {
    const baseline = BASELINE_SKILLS[targetRole] || BASELINE_SKILLS['Software Developer'];
    
    const prompt = `
      You are a career coach. Compare these extracted skills against this baseline for a ${targetRole}.
      Extracted Skills: ${extractedSkills.join(', ')}
      Baseline Skills: ${baseline.join(', ')}

      Categorize the skills into:
      1. still_solid: Skills the user has that are in the baseline.
      2. decayed: Skills the user has but likely need refreshing.
      3. new_since_left: Skills in the baseline that the user is missing entirely.

      Also create a structured 7-day study plan focused on the new_since_left and decayed skills.

      Return strictly as JSON (no markdown):
      {
        "still_solid": ["skill1", "skill2"],
        "decayed": ["skill3"],
        "new_since_left": ["skill4", "skill5"],
        "seven_day_plan": [
          { "day": 1, "skill": "skill3", "resource_link": "search_term_for_course" }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const jsonString = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating skill gap analysis with Gemini:", error);
    throw new Error("Failed to generate skill gap analysis.");
  }
}

async function generateInterviewQuestions(targetRole, gapDuration) {
  try {
    const prompt = `
      You are a technical interviewer for a ${targetRole} role. The candidate has a career gap of ${gapDuration} years.
      Generate 4-5 interview questions. Include a mix of technical questions relevant to the role, and exactly one question asking them to explain their career gap.

      Return strictly as JSON (no markdown):
      {
        "questions": [
          "Question 1?",
          "Question 2?",
          "Question 3?"
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const jsonString = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonString);
    return data.questions;
  } catch (error) {
    console.error("Error generating interview questions with Gemini:", error);
    throw new Error("Failed to generate interview questions.");
  }
}

async function generateInterviewFeedback(questionsAndAnswers) {
  try {
    const prompt = `
      You are an interview coach analyzing a transcript of an interview.
      Transcript: ${JSON.stringify(questionsAndAnswers)}

      Provide a score from 0-100 for clarity, confidence, and technical accuracy based on the answers provided.

      Return strictly as JSON (no markdown):
      {
        "clarity_score": 85,
        "confidence_score": 75,
        "technical_accuracy_score": 90
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const jsonString = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating interview feedback with Gemini:", error);
    throw new Error("Failed to generate interview feedback.");
  }
}

async function rewriteGapExplanation(originalAnswer) {
  try {
    const prompt = `
      You are a career coach helping a woman returning to the workforce explain her career gap.
      Original Answer: "${originalAnswer}"

      Rewrite this answer to sound more confident and professional, focusing on the value of her experiences during the gap (if mentioned) and her readiness to return.
      Also provide an array of specific phrase changes so she can see exactly what improved.

      Return strictly as JSON (no markdown):
      {
        "rewritten_answer": "The confident, polished version.",
        "highlighted_changes": [
          { "original_phrase": "I just took time off", "rewritten_phrase": "I took an intentional career pause" }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const jsonString = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error rewriting gap explanation with Gemini:", error);
    throw new Error("Failed to rewrite gap explanation.");
  }
}

module.exports = {
  parseResumeAndExtractProfile,
  generateSkillGapAnalysis,
  generateInterviewQuestions,
  generateInterviewFeedback,
  rewriteGapExplanation
};
