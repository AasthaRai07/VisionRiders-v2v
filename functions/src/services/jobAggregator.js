const fs = require('fs');
const path = require('path');

// Standarize experience level based on job description/title
function estimateExperience(title, description = '') {
  const text = (title + ' ' + description).toLowerCase();
  if (text.includes('senior') || text.includes('lead') || text.includes('architect') || text.includes('sr.')) {
    return '5+ Years';
  }
  if (text.includes('mid') || text.includes('intermediate') || text.includes('associate') || text.includes('3+ years')) {
    return '1-3 Years';
  }
  if (text.includes('junior') || text.includes('entry') || text.includes('fresher') || text.includes('intern')) {
    return 'Fresher';
  }
  return '1-3 Years'; // Default
}

// Clean HTML tags from greenhouse descriptions
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function fetchJobsFromRemotive() {
  try {
    const res = await fetch('https://remotive.com/api/remote-jobs?limit=5');
    if (!res.ok) throw new Error(`Remotive fetch error: ${res.status}`);
    const data = await res.json();
    
    return (data.jobs || []).map(job => {
      const skills = job.tags || ['Javascript', 'Remote'];
      const isReturnship = job.title.toLowerCase().includes('return') || job.description.toLowerCase().includes('returnship');
      
      return {
        title: job.title,
        company: job.company_name,
        company_logo: job.company_logo || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=150&q=60',
        description: stripHtml(job.description).substring(0, 1000) + '...',
        salary: job.salary || 'Competitive',
        location: 'Remote',
        state: 'Remote',
        country: 'Global',
        experience: estimateExperience(job.title, job.description),
        job_type: isReturnship ? 'Returnship' : (job.job_type === 'full_time' ? 'Full Time' : 'Contract'),
        work_mode: 'Remote',
        required_skills: skills,
        posted_date: job.publication_date || new Date().toISOString(),
        apply_url: job.url,
        company_website: `https://${job.company_name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        women_friendly_score: 85 + Math.floor(Math.random() * 15),
        women_friendly_badges: ['Remote Work', 'Flexible Hours', 'Safe Workplace'],
        returnship_details: isReturnship ? {
          duration: '6 Months',
          eligibility: 'Minimum 2 years career break',
          gapAllowed: '2+ Years',
          flexibleSchedule: true,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        } : null
      };
    });
  } catch (error) {
    console.error('Error fetching from Remotive:', error.message);
    return [];
  }
}

async function fetchJobsFromGreenhouse() {
  try {
    const res = await fetch('https://boards-api.greenhouse.io/v1/boards/google/jobs?content=true');
    if (!res.ok) throw new Error(`Greenhouse fetch error: ${res.status}`);
    const data = await res.json();
    
    return (data.jobs || []).slice(0, 5).map(job => {
      return {
        title: job.title,
        company: 'Google',
        company_logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=150&q=60',
        description: stripHtml(job.content).substring(0, 1000) + '...',
        salary: 'Competitive',
        location: job.location?.name || 'Bengaluru, India',
        state: 'Karnataka',
        country: 'India',
        experience: estimateExperience(job.title, job.content),
        job_type: 'Full Time',
        work_mode: job.title.toLowerCase().includes('remote') ? 'Remote' : 'Hybrid',
        required_skills: ['Go', 'Kubernetes', 'Python', 'Systems Engineering', 'Java'],
        posted_date: job.updated_at || new Date().toISOString(),
        apply_url: job.absolute_url,
        company_website: 'https://careers.google.com',
        women_friendly_score: 92,
        women_friendly_badges: ['Equal Opportunity Employer', 'Maternity Benefits', 'Women Leadership', 'Diversity Hiring'],
        returnship_details: null
      };
    });
  } catch (error) {
    console.error('Error fetching from Greenhouse:', error.message);
    return [];
  }
}

function generateIndianMockJobs() {
  return [
    {
      title: 'Amazon WoW - Software Development Engineer (Returnship)',
      company: 'Amazon India',
      company_logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=150&q=60',
      description: 'Amazon WoW is an initiative to help women reskill and rejoin the technical workforce. You will be building services on AWS, managing API architectures, and writing production React components. Supported by intensive mentoring and flexible schedules during transition.',
      salary: '₹18-24 LPA',
      location: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      experience: '1-3 Years',
      job_type: 'Returnship',
      work_mode: 'Hybrid',
      required_skills: ['React', 'Node.js', 'AWS', 'Docker', 'REST APIs', 'TypeScript'],
      posted_date: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      apply_url: 'https://www.amazon.jobs/content/en/teams/amazonwow',
      company_website: 'https://amazon.jobs',
      women_friendly_score: 96,
      women_friendly_badges: ['Women Friendly', 'Returnship Available', 'Maternity Benefits', 'Diversity Hiring'],
      returnship_details: {
        duration: '6 Months (Convertible)',
        eligibility: 'Women returning after 1+ years break',
        gapAllowed: '1+ Years',
        flexibleSchedule: true,
        deadline: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString()
      }
    },
    {
      title: 'IBM Tech Re-Entry - Senior DevOps Consultant',
      company: 'IBM India',
      company_logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&q=60',
      description: 'The IBM Tech Re-Entry program is a fully paid reskilling cohort for tech returners. As a Senior DevOps Consultant, you will design automated deployment pipelines, maintain Kubernetes nodes, and work closely with client engineering teams.',
      salary: '₹22-28 LPA',
      location: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      experience: '5+ Years',
      job_type: 'Returnship',
      work_mode: 'Remote',
      required_skills: ['Kubernetes', 'Docker', 'CI/CD', 'Jenkins', 'Terraform', 'Git'],
      posted_date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      apply_url: 'https://www.ibm.com/careers/in-en/tech-reentry',
      company_website: 'https://ibm.com',
      women_friendly_score: 94,
      women_friendly_badges: ['Returnship Available', 'Flexible Hours', 'Child Care Support', 'Diversity Hiring'],
      returnship_details: {
        duration: '4 Months (Paid)',
        eligibility: 'Women returning after 2+ years break',
        gapAllowed: '2+ Years',
        flexibleSchedule: true,
        deadline: new Date(Date.now() + 45 * 24 * 3600 * 1000).toISOString()
      }
    },
    {
      title: 'Associate Consultant - Financial Advisory',
      company: 'Deloitte India',
      company_logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=60',
      description: 'Deloitte Career Comeback program is recruiting associates for the financial risk advisory vertical. Analyze balance sheets, model investment emergency reserves, and review client compliance profiles. Full support for transition back to corporate environment.',
      salary: '₹12-15 LPA',
      location: 'Delhi NCR',
      state: 'Delhi',
      country: 'India',
      experience: '1-3 Years',
      job_type: 'Returnship',
      work_mode: 'Hybrid',
      required_skills: ['Financial Analysis', 'Excel', 'Corporate Finance', 'Risk Advisory'],
      posted_date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      apply_url: 'https://www2.deloitte.com/in/en/pages/careers/articles/deloitte-career-comeback.html',
      company_website: 'https://deloitte.com',
      women_friendly_score: 91,
      women_friendly_badges: ['Returnship Available', 'Women Leadership', 'Equal Opportunity Employer'],
      returnship_details: {
        duration: '3 Months (Convertible)',
        eligibility: 'Women returning after 1+ years break',
        gapAllowed: '1-5 Years',
        flexibleSchedule: false,
        deadline: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()
      }
    },
    {
      title: 'Graduate Analyst (Fresher Hiring)',
      company: 'Accenture India',
      company_logo: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=150&q=60',
      description: 'Accenture is hiring fresh graduates for analyst tracks. You will receive extensive reskilling in core technologies (React, Java, cloud basics) and be assigned to major enterprise application teams. Excellent gender diversity targets.',
      salary: '₹5-7 LPA',
      location: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      experience: 'Fresher',
      job_type: 'Full Time',
      work_mode: 'Onsite',
      required_skills: ['Java', 'SQL', 'React', 'HTML', 'CSS', 'Algorithms'],
      posted_date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      apply_url: 'https://www.accenture.com/in-en/careers',
      company_website: 'https://accenture.com',
      women_friendly_score: 89,
      women_friendly_badges: ['Safe Workplace', 'Equal Opportunity Employer', 'Diversity Hiring'],
      returnship_details: null
    },
    {
      title: 'React & Node.js Developer (Part Time / Freelance)',
      company: 'TechMoms Returnship Circle',
      company_logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=60',
      description: 'Looking for a developer to help build community-centric tools. This is a highly flexible part-time role designed specifically for working mothers or mothers re-entering the workforce who want a gradual workload.',
      salary: '₹3-5 LPA',
      location: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      experience: '1-3 Years',
      job_type: 'Part Time',
      work_mode: 'Remote',
      required_skills: ['React', 'Node.js', 'CSS', 'JavaScript'],
      posted_date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      apply_url: 'https://github.com/AasthaRai07/VisionRiders-v2v',
      company_website: 'https://hernova.com',
      women_friendly_score: 99,
      women_friendly_badges: ['Flexible Hours', 'Safe Workplace', 'Child Care Support', 'Women Leadership'],
      returnship_details: null
    }
  ];
}

async function aggregateAllJobs() {
  const remotiveJobs = await fetchJobsFromRemotive();
  const greenhouseJobs = await fetchJobsFromGreenhouse();
  const mockJobs = generateIndianMockJobs();
  
  return [...mockJobs, ...greenhouseJobs, ...remotiveJobs];
}

module.exports = {
  aggregateAllJobs
};
