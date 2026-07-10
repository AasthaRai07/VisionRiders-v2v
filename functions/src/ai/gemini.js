const { GoogleGenAI } = require('@google/genai');
const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'missing' });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'missing' });

const GEMINI_MODEL = 'gemini-1.5-flash';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

let fallbackResponses = {};
try {
  const fallbackPath = path.join(__dirname, '../../../../fallback_demo_responses.json');
  fallbackResponses = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
} catch (err) {
  console.warn("Failed to load fallback_demo_responses.json", err.message);
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function callGeminiWithTimeout(prompt, timeoutMs) {
  const req = ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });
  
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error("Timeout")), timeoutMs)
  );

  const response = await Promise.race([req, timeout]);
  return response.text;
}

async function callGroqWithTimeout(prompt, timeoutMs) {
  const req = groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
  });
  
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error("Timeout")), timeoutMs)
  );

  const response = await Promise.race([req, timeout]);
  return response.choices[0].message.content;
}

function parseAIResponse(rawText) {
  const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

async function callAIWithFallback(prompt, fallbackData = null) {
  const maxTimeoutMs = 8000;
  
  // ensure the prompt explicitly asks for valid JSON, no markdown
  const finalPrompt = prompt + "\n\nIMPORTANT: Return ONLY valid JSON, no markdown formatting, no code fences, no preamble.";

  try {
    const result = await callGeminiWithTimeout(finalPrompt, maxTimeoutMs);
    console.log("provider: gemini");
    return { data: parseAIResponse(result), provider: "gemini" };
  } catch (geminiError) {
    console.error("Gemini failed, falling back to Groq:", geminiError);
    
    try {
      const result = await callGroqWithTimeout(finalPrompt, maxTimeoutMs);
      console.log("provider: groq");
      return { data: parseAIResponse(result), provider: "groq" };
    } catch (groqError) {
      console.error("Groq also failed, retrying Gemini once:", groqError);
      
      await sleep(1000);
      try {
        const result = await callGeminiWithTimeout(finalPrompt, maxTimeoutMs);
        console.log("provider: gemini-retry");
        return { data: parseAIResponse(result), provider: "gemini-retry" };
      } catch (finalError) {
        if (fallbackData) {
          console.warn("All AI providers failed. Returning mock fallback data.");
          console.log("provider: mock-fallback");
          return { data: fallbackData, provider: "mock-fallback" };
        }
        throw new Error("AI_SERVICE_UNAVAILABLE");
      }
    }
  }
}

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
  ],
  'UX Designer': [
    'Figma', 'User Research', 'Prototyping', 'Wireframing', 'Design Systems',
    'Usability Testing', 'Information Architecture', 'Interaction Design',
    'Accessibility (WCAG)', 'Visual Design'
  ],
  'Product Manager': [
    'Product Strategy', 'User Stories', 'Roadmapping', 'A/B Testing',
    'Stakeholder Management', 'SQL', 'Agile/Scrum', 'Market Research',
    'Data-Driven Decision Making', 'Competitive Analysis'
  ],
  'Software Engineer': [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Git', 'REST APIs',
    'SQL', 'NoSQL', 'Agile Methodologies', 'System Design', 'CI/CD',
    'Data Structures & Algorithms', 'Docker', 'Cloud Platforms'
  ]
};

// ─── userType-specific prompt context ───────────────────────────────────────

function getResumePromptContext(userType) {
  switch (userType) {
    case 'student':
      return `This user is a STUDENT currently studying. Focus on coursework, personal projects, certifications, and academic history. Do NOT assume prior work experience. Prioritize academic achievements and learning trajectory.`;
    case 'fresher':
      return `This user is a FRESHER — recently graduated with no/minimal full-time work experience, seeking their first job. Treat this as job-readiness for a FULL-TIME entry-level role (not an internship). Weight final-year projects, capstone work, any completed internship, and certifications more heavily than pure coursework.`;
    case 'returnship':
      return `This user is RETURNING TO WORK after a career break. Frame gaps as skills that have decayed or evolved since their last working period. Identify what was once strong but may need refreshing, and what is entirely new in the industry since they left.`;
    case 'professional':
    default:
      return `This user is a WORKING PROFESSIONAL looking for career growth or a lateral move. Frame this as a career-growth/lateral-move gap analysis. They have current work experience — focus on what they need to grow into their target role.`;
  }
}

function getSkillGapPromptAndKeys(userType) {
  switch (userType) {
    case 'student':
      return {
        bucket1Key: 'have', bucket2Key: 'should_learn_soon', bucket3Key: 'must_have_for_internship',
        bucket1Label: 'Have', bucket2Label: 'Should Learn Soon', bucket3Label: 'Must-Have for Internship',
        planTitle: '7-Day Internship Prep Plan',
        classifyInstruction: `1. "have": Skills already possessed.\n2. "should_learn_soon": Skills that would strengthen profile.\n3. "must_have_for_internship": MUST learn to land internship.`
      };
    case 'fresher':
      return {
        bucket1Key: 'have', bucket2Key: 'should_strengthen', bucket3Key: 'must_have_for_role',
        bucket1Label: 'Have', bucket2Label: 'Should Strengthen', bucket3Label: 'Must-Have for This Role',
        planTitle: '7-Day Job-Ready Sprint',
        classifyInstruction: `1. "have": Skills already possessed.\n2. "should_strengthen": Basic skills needing depth.\n3. "must_have_for_role": Critical missing skills.`
      };
    case 'returnship':
      return {
        bucket1Key: 'still_solid', bucket2Key: 'decayed', bucket3Key: 'new_since_left',
        bucket1Label: 'Still Solid', bucket2Label: 'Needs Refresh', bucket3Label: 'New Since You Left',
        planTitle: '7-Day Recovery Plan',
        classifyInstruction: `1. "still_solid": Core competencies.\n2. "decayed": Skills needing refresh.\n3. "new_since_left": New industry skills.`
      };
    case 'professional':
    default:
      return {
        bucket1Key: 'strong_fit', bucket2Key: 'growth_area', bucket3Key: 'skill_gap_for_target',
        bucket1Label: 'Strong Fit', bucket2Label: 'Growth Area', bucket3Label: 'Skill Gap for Target Role',
        planTitle: '7-Day Growth Plan',
        classifyInstruction: `1. "strong_fit": Strong skills.\n2. "growth_area": Skills needing deepening.\n3. "skill_gap_for_target": Missing skills.`
      };
  }
}

// ─── AI Functions ───────────────────────────────────────────────────────────

async function parseResumeAndExtractProfile(resumeText, targetRole, userType = 'professional', industry = 'Tech') {
  const userContext = getResumePromptContext(userType);
  const prompt = `You are an expert technical recruiter analyzing a resume for a ${targetRole} role in the ${industry} industry.
${userContext}
Extract the following information:
{
  "extracted_skills": ["skill1", "skill2"],
  "past_roles": ["role1", "role2"],
  "years_of_experience": 5.5,
  "gap_duration_years": 2.0,
  "ats_keyword_flags": ["missing keyword 1", "missing keyword 2"]
}
Resume Text:
${resumeText}`;

  const fallback = fallbackResponses.fallback_skill_gap_analysis?.extracted_profile || null;
  const result = await callAIWithFallback(prompt, fallback);
  return result.data;
}

async function generateSkillGapAnalysis(extractedSkills, targetRole, userType = 'professional', industry = 'Tech') {
  const baseline = BASELINE_SKILLS[targetRole] || BASELINE_SKILLS['Software Developer'];
  const config = getSkillGapPromptAndKeys(userType);
  
  const prompt = `You are a career coach. Compare these extracted skills against this baseline for a ${targetRole} in the ${industry} industry.
Extracted Skills: ${extractedSkills.join(', ')}
Baseline Skills: ${baseline.join(', ')}

${config.classifyInstruction}

Also create a structured 7-day study plan titled "${config.planTitle}" focused on the priority skills.
{
  "${config.bucket1Key}": ["skill1", "skill2"],
  "${config.bucket2Key}": ["skill3"],
  "${config.bucket3Key}": ["skill4", "skill5"],
  "seven_day_plan": [
    { "day": 1, "skill": "skill3", "resource_link": "search_term_for_course" }
  ]
}`;

  const fallbackData = fallbackResponses.fallback_skill_gap_analysis;
  // Modify fallbackData to match the expected format with dynamic keys
  let adjustedFallback = null;
  if (fallbackData) {
    adjustedFallback = {
      [config.bucket1Key]: fallbackData.still_solid_skills || [],
      [config.bucket2Key]: fallbackData.decayed_skills || [],
      [config.bucket3Key]: fallbackData.new_since_left_skills || [],
      seven_day_plan: fallbackData.seven_day_plan || []
    };
  }

  const result = await callAIWithFallback(prompt, adjustedFallback);
  const parsed = result.data;

  return {
    bucket1: parsed[config.bucket1Key] || [],
    bucket2: parsed[config.bucket2Key] || [],
    bucket3: parsed[config.bucket3Key] || [],
    seven_day_plan: parsed.seven_day_plan || [],
    labels: {
      bucket1: config.bucket1Label,
      bucket2: config.bucket2Label,
      bucket3: config.bucket3Label,
      planTitle: config.planTitle
    }
  };
}

async function generateInterviewQuestions(targetRole, gapDuration) {
  const prompt = `You are a technical interviewer for a ${targetRole} role. The candidate has a career gap of ${gapDuration} years.
Generate 4-5 interview questions. Include a mix of technical questions relevant to the role, and exactly one question asking them to explain their career gap.
{
  "questions": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ]
}`;

  const fallback = fallbackResponses.fallback_interview_questions ? { questions: fallbackResponses.fallback_interview_questions } : null;
  const result = await callAIWithFallback(prompt, fallback);
  return result.data.questions;
}

async function generateInterviewFeedback(questionsAndAnswers) {
  const prompt = `You are an interview coach analyzing a transcript of an interview.
Transcript: ${JSON.stringify(questionsAndAnswers)}
Provide a score from 0-100 for clarity, confidence, and technical accuracy based on the answers provided.
{
  "clarity_score": 85,
  "confidence_score": 75,
  "technical_accuracy_score": 90,
  "summary": "Brief summary of performance"
}`;

  const fallback = fallbackResponses.fallback_interview_feedback || null;
  const result = await callAIWithFallback(prompt, fallback);
  return result.data;
}

async function rewriteGapExplanation(originalAnswer) {
  const prompt = `You are a career coach helping a woman returning to the workforce explain her career gap.
Original Answer: "${originalAnswer}"
Rewrite this answer to sound more confident and professional, focusing on the value of her experiences during the gap (if mentioned) and her readiness to return.
Also provide an array of specific phrase changes so she can see exactly what improved.
{
  "rewritten_answer": "The confident, polished version.",
  "highlighted_changes": [
    { "original_phrase": "I just took time off", "rewritten_phrase": "I took an intentional career pause" }
  ]
}`;

  const fallback = fallbackResponses.fallback_gap_rewrite || null;
  const result = await callAIWithFallback(prompt, fallback);
  return result.data;
}

module.exports = {
  parseResumeAndExtractProfile,
  generateSkillGapAnalysis,
  generateInterviewQuestions,
  generateInterviewFeedback,
  rewriteGapExplanation,
  getSkillGapPromptAndKeys
};
