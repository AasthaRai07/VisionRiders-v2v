const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = 'gemini-2.0-flash';

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
      return `This user is a STUDENT currently studying. 
Focus on coursework, personal projects, certifications, and academic history. 
Do NOT assume prior work experience. Prioritize academic achievements and learning trajectory.`;

    case 'fresher':
      return `This user is a FRESHER — recently graduated with no/minimal full-time work experience, seeking their first job. 
Treat this as job-readiness for a FULL-TIME entry-level role (not an internship). 
Weight final-year projects, capstone work, any completed internship, and certifications more heavily than pure coursework. 
Expectations are slightly higher than for students — expect some project depth, possibly one internship already, but no multi-year experience.`;

    case 'returnship':
      return `This user is RETURNING TO WORK after a career break. 
Frame gaps as skills that have decayed or evolved since their last working period. 
Identify what was once strong but may need refreshing, and what is entirely new in the industry since they left.`;

    case 'professional':
    default:
      return `This user is a WORKING PROFESSIONAL looking for career growth or a lateral move. 
Frame this as a career-growth/lateral-move gap analysis. 
They have current work experience — focus on what they need to grow into their target role.`;
  }
}

function getSkillGapPromptAndKeys(userType) {
  switch (userType) {
    case 'student':
      return {
        bucket1Key: 'have',
        bucket2Key: 'should_learn_soon',
        bucket3Key: 'must_have_for_internship',
        bucket1Label: 'Have',
        bucket2Label: 'Should Learn Soon',
        bucket3Label: 'Must-Have for Internship',
        planTitle: '7-Day Internship Prep Plan',
        classifyInstruction: `Classify skills for a STUDENT preparing for an internship:
1. "have": Skills the student already possesses from coursework/projects.
2. "should_learn_soon": Skills that would strengthen their profile but aren't critical yet.
3. "must_have_for_internship": Skills they MUST learn to land an internship in this role.
Prioritize "must_have_for_internship" skills first in the 7-day plan since the student is building from scratch.`
      };

    case 'fresher':
      return {
        bucket1Key: 'have',
        bucket2Key: 'should_strengthen',
        bucket3Key: 'must_have_for_role',
        bucket1Label: 'Have',
        bucket2Label: 'Should Strengthen',
        bucket3Label: 'Must-Have for This Role',
        planTitle: '7-Day Job-Ready Sprint',
        classifyInstruction: `Classify skills for a FRESHER seeking their first full-time entry-level job (NOT an internship):
1. "have": Skills the fresher already has from projects, capstone, or an internship.
2. "should_strengthen": Skills they have at a basic level but need to deepen for job-readiness.
3. "must_have_for_role": Critical skills they're missing for this entry-level role.
Prioritize closing "must_have_for_role" gaps fastest in the 7-day plan since they may be actively applying now.`
      };

    case 'returnship':
      return {
        bucket1Key: 'still_solid',
        bucket2Key: 'decayed',
        bucket3Key: 'new_since_left',
        bucket1Label: 'Still Solid',
        bucket2Label: 'Needs Refresh',
        bucket3Label: 'New Since You Left',
        planTitle: '7-Day Recovery Plan',
        classifyInstruction: `Classify skills for someone RETURNING after a career break:
1. "still_solid": Core competencies they still maintain well.
2. "decayed": Skills they once had but likely need refreshing after time away.
3. "new_since_left": Skills that are new in the industry since they left — critical gaps to fill.
Balance the 7-day plan between refreshing decayed skills and learning new ones.`
      };

    case 'professional':
    default:
      return {
        bucket1Key: 'strong_fit',
        bucket2Key: 'growth_area',
        bucket3Key: 'skill_gap_for_target',
        bucket1Label: 'Strong Fit',
        bucket2Label: 'Growth Area',
        bucket3Label: 'Skill Gap for Target Role',
        planTitle: '7-Day Growth Plan',
        classifyInstruction: `Classify skills for a WORKING PROFESSIONAL pursuing career growth:
1. "strong_fit": Skills where the user is already strong for the target role.
2. "growth_area": Skills that exist but need deepening to reach the target level.
3. "skill_gap_for_target": Skills entirely missing that the target role requires.
Focus the 7-day plan on the most impactful growth areas and gaps.`
      };
  }
}

// ─── AI Functions ───────────────────────────────────────────────────────────

async function parseResumeAndExtractProfile(resumeText, targetRole, userType = 'professional', industry = 'Tech') {
  try {
    const userContext = getResumePromptContext(userType);
    
    const prompt = `
      You are an expert technical recruiter analyzing a resume for a ${targetRole} role in the ${industry} industry.
      
      ${userContext}
      
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

async function generateSkillGapAnalysis(extractedSkills, targetRole, userType = 'professional', industry = 'Tech') {
  try {
    const baseline = BASELINE_SKILLS[targetRole] || BASELINE_SKILLS['Software Developer'];
    const config = getSkillGapPromptAndKeys(userType);
    
    const prompt = `
      You are a career coach. Compare these extracted skills against this baseline for a ${targetRole} in the ${industry} industry.
      Extracted Skills: ${extractedSkills.join(', ')}
      Baseline Skills: ${baseline.join(', ')}

      ${config.classifyInstruction}

      Also create a structured 7-day study plan titled "${config.planTitle}" focused on the priority skills.

      Return strictly as JSON (no markdown):
      {
        "${config.bucket1Key}": ["skill1", "skill2"],
        "${config.bucket2Key}": ["skill3"],
        "${config.bucket3Key}": ["skill4", "skill5"],
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
    const parsed = JSON.parse(jsonString);
    
    // Normalize the response to always include the bucket keys the frontend expects
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
  rewriteGapExplanation,
  getSkillGapPromptAndKeys
};
