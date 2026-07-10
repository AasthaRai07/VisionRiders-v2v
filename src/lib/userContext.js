/**
 * Returns the user's stored context data without creating any new database tables.
 * Reads from existing localStorage data (`hernova_user_profile` / `user_session`).
 *
 * @param {string} [userId] - Optional user email/ID to look up specific profile.
 * @returns {Object} { resumeText, skills, careerGoal, fullName, domain, persona }
 */
export function getUserContext(userId) {
  if (typeof window === 'undefined') {
    return {
      fullName: 'Aditi Sharma',
      resumeText: 'Aditi Sharma. Education: B.Tech in Computer Science, IIT Delhi (2020-2024), GPA 9.1/10. Experience: Product Management Intern at FinTech Labs (Summer 2023), where I led the UX redesign of the merchant onboarding portal, conducted 25+ qualitative user interviews, and increased activation rate by 18%. Projects: AI-powered Expense Tracker using React and Python with 1,200 active users. Leadership: Vice President of Entrepreneurship Cell, managed $15,000 budget and organized annual hackathon for 500+ participants.',
      skills: ['Product Strategy', 'User Interviews', 'Roadmapping', 'Data Analysis', 'React', 'Python', 'UX Research', 'Agile/Scrum'],
      careerGoal: 'Product Manager in FinTech or Consumer Tech',
      domain: 'FinTech & Consumer Tech',
      persona: 'fresher'
    };
  }

  let profile = null;

  try {
    // 1. Try specific user ID/email first
    if (userId) {
      const storedSpecific = localStorage.getItem(`hernova_user_profile_${userId.toLowerCase()}`);
      if (storedSpecific) {
        profile = JSON.parse(storedSpecific);
      }
    }

    // 2. If not found, check current user_session to get current user's email
    if (!profile) {
      const sessionStr = localStorage.getItem('user_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session.email) {
          const storedBySession = localStorage.getItem(`hernova_user_profile_${session.email.toLowerCase()}`);
          if (storedBySession) {
            profile = JSON.parse(storedBySession);
          }
        }
      }
    }

    // 3. Fallback to general hernova_user_profile
    if (!profile) {
      const storedGeneral = localStorage.getItem('hernova_user_profile');
      if (storedGeneral) {
        profile = JSON.parse(storedGeneral);
      }
    }
  } catch (err) {
    console.error('Error reading user context from localStorage:', err);
  }

  // If still no profile found, provide realistic default structure for testing
  if (!profile) {
    profile = {
      fullName: 'Aditi Sharma',
      resumeText: 'Aditi Sharma. Education: B.Tech in Computer Science, IIT Delhi (2020-2024), GPA 9.1/10. Experience: Product Management Intern at FinTech Labs (Summer 2023), where I led the UX redesign of the merchant onboarding portal, conducted 25+ qualitative user interviews, and increased activation rate by 18%. Projects: AI-powered Expense Tracker using React and Python with 1,200 active users. Leadership: Vice President of Entrepreneurship Cell, managed $15,000 budget and organized annual hackathon for 500+ participants.',
      targetRole: 'Product Manager',
      domain: 'FinTech & Consumer Tech',
      persona: 'fresher',
      specificData: {
        fresherSkills: ['Product Strategy', 'User Interviews', 'Roadmapping', 'Data Analysis', 'React', 'Python', 'UX Research', 'Agile/Scrum'],
      }
    };
  }

  // Extract skills array depending on persona or general specificData
  let skills = [];
  if (profile.specificData) {
    if (Array.isArray(profile.specificData.fresherSkills)) {
      skills = profile.specificData.fresherSkills;
    } else if (Array.isArray(profile.specificData.professionalSkills)) {
      skills = profile.specificData.professionalSkills;
    } else if (Array.isArray(profile.specificData.studentCourses)) {
      skills = profile.specificData.studentCourses;
    } else if (profile.specificData.skills) {
      skills = profile.specificData.skills;
    }
  }
  if (skills.length === 0 && Array.isArray(profile.skills)) {
    skills = profile.skills;
  }
  if (skills.length === 0) {
    skills = ['Product Strategy', 'User Interviews', 'Roadmapping', 'Data Analysis', 'React', 'Python', 'UX Research'];
  }

  // Extract careerGoal
  let careerGoal = profile.targetRole || profile.careerGoal || '';
  if (!careerGoal && profile.specificData) {
    careerGoal = profile.specificData.professionalReason || profile.specificData.currentRole || 'Product & Technology Career Growth';
  }
  if (!careerGoal) {
    careerGoal = 'Product Manager in FinTech & Consumer Tech';
  }

  const resumeText = profile.resumeText || '';
  const fullName = profile.fullName || 'Aditi Sharma';
  const domain = profile.domain || 'Technology & Innovation';
  const persona = profile.persona || 'fresher';

  return {
    fullName,
    resumeText,
    skills,
    careerGoal,
    domain,
    persona
  };
}
