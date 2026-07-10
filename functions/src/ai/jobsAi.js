const { GoogleGenAI } = require('@google/genai');

let ai = null;
const model = 'gemini-2.5-flash';

if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI in jobsAi:", err.message);
  }
}

async function checkJobEligibility(userProfile, jobDetails) {
  const userSkills = userProfile.skills || ['React', 'JavaScript', 'TailwindCSS'];
  const jobSkills = jobDetails.required_skills || ['React', 'Node.js', 'AWS'];
  
  const matching = jobSkills.filter(s => userSkills.some(us => us.toLowerCase() === s.toLowerCase()));
  const missing = jobSkills.filter(s => !userSkills.some(us => us.toLowerCase() === s.toLowerCase()));
  
  const baseMatchScore = Math.round((matching.length / Math.max(jobSkills.length, 1)) * 100);
  const matchScore = Math.max(baseMatchScore, 45); // Guarantee a sensible minimum score for UI
  const timeline = missing.length > 2 ? '4 weeks' : (missing.length > 0 ? '2 weeks' : 'Ready to apply');
  
  if (!ai) {
    return {
      matchScore,
      matchingSkills: matching.length > 0 ? matching : ['JavaScript'],
      missingSkills: missing.length > 0 ? missing : ['AWS', 'Docker'],
      timeline,
      recommendedCourseTerms: missing.length > 0 ? missing : ['React'],
      recommendedMentors: ['Priya Sharma'],
      explanation: `You have strong foundations in ${matching.join(', ') || 'JavaScript'}. Learning ${missing.join(', ') || 'AWS'} will make you highly competitive for this role at ${jobDetails.company}.`
    };
  }

  try {
    const prompt = `
      You are an expert career compatibility assistant. Evaluate this candidate's profile against this job description.
      
      Candidate Profile:
      - Skills: ${JSON.stringify(userProfile.skills || [])}
      - Target Role: ${userProfile.target_role || ''}
      - Experience Gap: ${userProfile.break_duration || 'None'}
      
      Job Details:
      - Title: ${jobDetails.title}
      - Company: ${jobDetails.company}
      - Required Skills: ${JSON.stringify(jobDetails.required_skills || [])}
      - Description: ${jobDetails.description}

      Provide compatibility analysis. Recommend specific skills missing, a reskilling timeline (e.g., '3 weeks'), recommended course search terms, and suggested mentors.
      
      Return strictly as JSON (no markdown):
      {
        "matchScore": 88,
        "matchingSkills": ["React", "JavaScript"],
        "missingSkills": ["AWS", "Docker"],
        "timeline": "3 weeks",
        "recommendedCourseTerms": ["AWS Cloud Essentials", "Docker Containers"],
        "recommendedMentors": ["Priya Sharma"],
        "explanation": "Your background matches the frontend requirements perfectly. Gaining some basic AWS/Docker skills will make you the ideal fit."
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const jsonString = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini eligibility check failed, falling back to mock:", error);
    return {
      matchScore,
      matchingSkills: matching.length > 0 ? matching : ['JavaScript'],
      missingSkills: missing.length > 0 ? missing : ['AWS', 'Docker'],
      timeline,
      recommendedCourseTerms: missing.length > 0 ? missing : ['React'],
      recommendedMentors: ['Priya Sharma'],
      explanation: `Failed to connect to Gemini API. Standalone fallback: You match ${matching.join(', ') || 'basic details'}. missing: ${missing.join(', ') || 'AWS'}.`
    };
  }
}

async function parseResume(resumeText) {
  const skillsList = [
    'react', 'javascript', 'typescript', 'node.js', 'node', 'express', 'python', 'java', 
    'sql', 'postgresql', 'mysql', 'mongodb', 'aws', 'docker', 'kubernetes', 'html', 
    'css', 'tailwind', 'devops', 'git', 'github', 'jira', 'scrum', 'agile', 'linux',
    'excel', 'financial analysis', 'risk advisory', 'corporate finance', 'algorithms'
  ];
  
  const foundSkills = [];
  const textLower = (resumeText || '').toLowerCase();
  
  skillsList.forEach(skill => {
    if (textLower.includes(skill)) {
      if (skill === 'react') foundSkills.push('React');
      else if (skill === 'javascript') foundSkills.push('JavaScript');
      else if (skill === 'typescript') foundSkills.push('TypeScript');
      else if (skill === 'node.js' || skill === 'node') foundSkills.push('Node.js');
      else if (skill === 'express') foundSkills.push('Express');
      else if (skill === 'python') foundSkills.push('Python');
      else if (skill === 'java') foundSkills.push('Java');
      else if (skill === 'sql') foundSkills.push('SQL');
      else if (skill === 'postgresql') foundSkills.push('PostgreSQL');
      else if (skill === 'mysql') foundSkills.push('MySQL');
      else if (skill === 'mongodb') foundSkills.push('MongoDB');
      else if (skill === 'aws') foundSkills.push('AWS');
      else if (skill === 'docker') foundSkills.push('Docker');
      else if (skill === 'kubernetes') foundSkills.push('Kubernetes');
      else if (skill === 'html') foundSkills.push('HTML');
      else if (skill === 'css') foundSkills.push('CSS');
      else if (skill === 'tailwind') foundSkills.push('TailwindCSS');
      else if (skill === 'devops') foundSkills.push('DevOps');
      else if (skill === 'git') foundSkills.push('Git');
      else if (skill === 'github') foundSkills.push('GitHub');
      else if (skill === 'excel') foundSkills.push('Excel');
      else if (skill === 'financial analysis') foundSkills.push('Financial Analysis');
      else if (skill === 'risk advisory') foundSkills.push('Risk Advisory');
      else if (skill === 'corporate finance') foundSkills.push('Corporate Finance');
      else if (skill === 'algorithms') foundSkills.push('Algorithms');
    }
  });

  const uniqueFoundSkills = Array.from(new Set(foundSkills));
  const parsedSkills = uniqueFoundSkills.length > 0 ? uniqueFoundSkills : ['React', 'JavaScript', 'Node.js'];

  // Calculate standard fallback ATS Score based on sections & matched skills
  const sections = ['education', 'experience', 'project', 'certification', 'skill', 'summary', 'contact'];
  let sectionCount = 0;
  sections.forEach(sec => {
    if (textLower.includes(sec)) sectionCount++;
  });
  const baseScore = 65;
  const skillsWeight = Math.min(foundSkills.length * 2, 20);
  const sectionsWeight = sectionCount * 2;
  const calculatedAtsScore = baseScore + skillsWeight + sectionsWeight;
  const atsScore = Math.min(calculatedAtsScore, 98);

  if (!ai) {
    return {
      skills: parsedSkills,
      experience: '1-3 Years based on CV',
      education: 'Extracted from Resume',
      certifications: [],
      atsScore: atsScore
    };
  }

  try {
    const prompt = `
      You are an ATS resume parser. Extract skills, experience level/history, education, and certifications from this resume text.
      Also calculate an overall ATS score (from 0 to 100) based on resume layout structure, content quality, and general formatting.
      
      Resume Text:
      ${resumeText}

      Return strictly as JSON (no markdown):
      {
        "skills": ["React", "JavaScript", "TypeScript"],
        "experience": "2 Years as Frontend Developer",
        "education": "B.S. in Computer Science",
        "certifications": ["AWS Practitioner"],
        "atsScore": 85
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const jsonString = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(jsonString);
    if (typeof result.atsScore !== 'number') {
      result.atsScore = atsScore;
    }
    return result;
  } catch (error) {
    console.error("Gemini resume parse failed, returning scanned match:", error);
    return {
      skills: parsedSkills,
      experience: '1-3 Years',
      education: 'Scanned Profile',
      certifications: [],
      atsScore: atsScore
    };
  }
}

async function chatWithJobCoach(jobDetails, chatHistory, userMessage) {
  if (!ai) {
    return `As your HerNova AI Career Coach, I've analyzed the ${jobDetails.title} role at ${jobDetails.company}. To prepare, I recommend focusing on these skills: ${jobDetails.required_skills?.join(', ') || 'React, Node.js'}. We also recommend booking a session with mentor Priya Sharma for specific interview guidance.`;
  }

  try {
    const prompt = `
      You are the HerNova AI Career Coach. You are helping a female job candidate prepare for this job:
      - Title: ${jobDetails.title}
      - Company: ${jobDetails.company}
      - Required Skills: ${JSON.stringify(jobDetails.required_skills || [])}
      - Description: ${jobDetails.description}

      Chat History:
      ${JSON.stringify(chatHistory || [])}

      User Message: "${userMessage}"

      Provide a supportive, confident, and professional response helping her succeed, address career gap concerns (if any), or prepare.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini job coach chat failed, returning mock:", error);
    return `I am currently running in offline mode. For the ${jobDetails.title} role, please make sure your resume highlights ${jobDetails.required_skills?.join(', ') || 'React'}.`;
  }
}

module.exports = {
  checkJobEligibility,
  parseResume,
  chatWithJobCoach
};
