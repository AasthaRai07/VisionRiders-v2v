const admin = require('firebase-admin');

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
}

admin.initializeApp({ projectId: 'hernova-13f01' });
const db = admin.firestore();

// Default images for categories
const techImg = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=60";
const financeImg = "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=500&q=60";
const careerImg = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=60";
const wellnessImg = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&q=60";
const leadershipImg = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&q=60";

const courses = [
  // CATEGORY: Tech & Data
  { category: "Tech & Data", courseName: "CS50: Introduction to Computer Science", platform: "Harvard/edX", pricing: "Free", goodFor: "Absolute beginners", thumbnailUrl: techImg, courseUrl: "https://www.edx.org/cs50" },
  { category: "Tech & Data", courseName: "Python for Everybody", platform: "Coursera (Michigan)", pricing: "Free to audit", goodFor: "Career-break returners refreshing basics", thumbnailUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=500&q=60", courseUrl: "https://www.coursera.org/specializations/python" },
  { category: "Tech & Data", courseName: "Responsive Web Design Certification", platform: "freeCodeCamp", pricing: "Free", goodFor: "Frontend fundamentals", thumbnailUrl: techImg, courseUrl: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" },
  { category: "Tech & Data", courseName: "Data Analytics with Python", platform: "NPTEL", pricing: "Free", goodFor: "Matches your Introduction to Data Visualisation card", thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=60", courseUrl: "https://nptel.ac.in/" },
  { category: "Tech & Data", courseName: "SQL for Data Science", platform: "Coursera (UC Davis)", pricing: "Free to audit", goodFor: "Foundational for Data Analyst role", thumbnailUrl: techImg, courseUrl: "https://www.coursera.org/learn/sql-for-data-science" },
  { category: "Tech & Data", courseName: "Machine Learning Specialization", platform: "Coursera (Andrew Ng)", pricing: "Free to audit", goodFor: "For ML/Data Scientist track", thumbnailUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=500&q=60", courseUrl: "https://www.coursera.org/specializations/machine-learning-introduction" },
  { category: "Tech & Data", courseName: "The Complete Web Developer Course", platform: "The Odin Project", pricing: "Free", goodFor: "Full-stack refresher", thumbnailUrl: techImg, courseUrl: "https://www.theodinproject.com/" },

  // CATEGORY: Financial Literacy
  { category: "Financial Literacy", courseName: "Financial Markets", platform: "Coursera (Yale)", pricing: "Free to audit", goodFor: "Investing for Beginners", thumbnailUrl: financeImg, courseUrl: "https://www.coursera.org/learn/financial-markets-global" },
  { category: "Financial Literacy", courseName: "Personal & Family Financial Planning", platform: "Coursera (Univ. of Florida)", pricing: "Free to audit", goodFor: "Budgeting fundamentals", thumbnailUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=60", courseUrl: "https://www.coursera.org/learn/family-planning" },
  { category: "Financial Literacy", courseName: "Khan Academy — Personal Finance", platform: "Khan Academy", pricing: "Free", goodFor: "Beginner-friendly", thumbnailUrl: financeImg, courseUrl: "https://www.khanacademy.org/college-careers-more/personal-finance" },
  { category: "Financial Literacy", courseName: "Mudra Yojana / Stand-Up India — Official Scheme Guides", platform: "Govt. of India portals", pricing: "Free", goodFor: "India-specific scheme literacy", thumbnailUrl: financeImg, courseUrl: "https://www.standupmitra.in/" },
  { category: "Financial Literacy", courseName: "Negotiation, Mediation and Conflict Resolution", platform: "Coursera (ESSEC)", pricing: "Free to audit", goodFor: "Negotiating Tech Salary", thumbnailUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=500&q=60", courseUrl: "https://www.coursera.org/learn/negotiation-mediation" },

  // CATEGORY: Career Skills
  { category: "Career Skills", courseName: "Resume Writing & LinkedIn Profile Optimization", platform: "Coursera", pricing: "Free to audit", goodFor: "Direct fit for return-to-work", thumbnailUrl: careerImg, courseUrl: "https://www.coursera.org/" },
  { category: "Career Skills", courseName: "Successful Career Development", platform: "Coursera", pricing: "Free to audit", goodFor: "Broad career-planning", thumbnailUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=60", courseUrl: "https://www.coursera.org/learn/career-development-planning" },
  { category: "Career Skills", courseName: "Overcoming Imposter Syndrome", platform: "TEDx", pricing: "Free", goodFor: "Imposter Syndrome & You", thumbnailUrl: careerImg, courseUrl: "https://www.youtube.com/" },
  { category: "Career Skills", courseName: "Interview Skills: Master the Interview", platform: "Coursera", pricing: "Free to audit", goodFor: "Mock Interview Coach feature", thumbnailUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=500&q=60", courseUrl: "https://www.coursera.org/learn/interview-preparation" },

  // CATEGORY: Wellness
  { category: "Wellness", courseName: "The Science of Well-Being", platform: "Coursera (Yale)", pricing: "Free to audit", goodFor: "Extremely well-reviewed", thumbnailUrl: wellnessImg, courseUrl: "https://www.coursera.org/learn/the-science-of-well-being" },
  { category: "Wellness", courseName: "Mindfulness and Well-being", platform: "Coursera", pricing: "Free to audit", goodFor: "Stress/burnout management", thumbnailUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=500&q=60", courseUrl: "https://www.coursera.org/learn/mindfulness" },
  { category: "Wellness", courseName: "Managing Your Mental Health", platform: "edX", pricing: "Free to audit", goodFor: "General wellness support", thumbnailUrl: wellnessImg, courseUrl: "https://www.edx.org/course/managing-your-mental-health-during-covid-19" },

  // CATEGORY: Leadership
  { category: "Leadership", courseName: "Women in Leadership: Inspiring Positive Change", platform: "Coursera (Case Western)", pricing: "Free to audit", goodFor: "Directly on-brand", thumbnailUrl: leadershipImg, courseUrl: "https://www.coursera.org/learn/women-in-leadership" },
  { category: "Leadership", courseName: "Leading People and Teams", platform: "Coursera (Michigan)", pricing: "Free to audit", goodFor: "Mid-career leadership", thumbnailUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=500&q=60", courseUrl: "https://www.coursera.org/specializations/leading-people-teams" },
  { category: "Leadership", courseName: "Introduction to Negotiation", platform: "Coursera (Yale)", pricing: "Free to audit", goodFor: "Overlaps with Financial Literacy", thumbnailUrl: leadershipImg, courseUrl: "https://www.coursera.org/learn/negotiation" }
];

async function seedCourses() {
  console.log("Starting full wipe and re-seed of courses collection...");
  
  try {
    const snap = await db.collection('courses').get();
    const batch = db.batch();
    
    snap.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log("Deleted all old courses.");
    
    const insertBatch = db.batch();
    courses.forEach(course => {
      const docRef = db.collection('courses').doc();
      insertBatch.set(docRef, course);
    });
    
    await insertBatch.commit();
    console.log(`Successfully re-seeded ${courses.length} courses with thumbnails and URLs.`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error during wipe and re-seed:", error);
    process.exit(1);
  }
}

seedCourses();
