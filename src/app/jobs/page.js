'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect, useState, useRef } from 'react';

const JOBS_API_URL = 'http://127.0.0.1:5001/hernova-13f01/us-central1/api/jobs';

export default function JobsBoard() {
  const [activeTab, setActiveTab] = useState('analytics'); // 'feed' | 'returnships' | 'tracker' | 'analytics'
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // User Profile from login/onboarding session
  const [userPersona, setUserPersona] = useState('returnship');
  const [userSkills, setUserSkills] = useState(['React', 'JavaScript', 'Node.js']);

  // Resume state
  const [resumeText, setResumeText] = useState('');
  const [atsScore, setAtsScore] = useState(null);
  const [showResumeEditor, setShowResumeEditor] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    
    // Read txt files directly
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target.result);
      };
      reader.readAsText(file);
    } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        const chunkSize = 65536;
        for (let i = 0; i < bytes.byteLength; i += chunkSize) {
          const chunk = bytes.subarray(i, i + chunkSize);
          binary += String.fromCharCode.apply(null, chunk);
        }
        
        // Scan PDF binary content for text streams inside parentheses
        const regex = /\(([^)]+)\)/g;
        const matches = [];
        let match;
        // Limit scanner length for safety
        const maxScan = Math.min(binary.length, 1200000);
        const searchStr = binary.substring(0, maxScan);
        
        while ((match = regex.exec(searchStr)) !== null) {
          const val = match[1];
          if (val.length > 2 && /^[a-zA-Z0-9\s.,@_:\-\/]+$/.test(val) && !val.includes('\\')) {
            matches.push(val);
          }
        }
        
        const extracted = matches.join(' ').replace(/\s+/g, ' ').trim();
        if (extracted.length > 40) {
          setResumeText(extracted);
        } else {
          // Fallback if compressed/scanned image PDF
          // We can also extract metadata like filename words to avoid completely empty textbox
          const fileWords = file.name.replace(/[^a-zA-Z]/g, ' ').replace(/\s+/g, ' ').trim();
          setResumeText(`[Scanned or Compressed PDF: ${file.name}]\nKeywords detected from filename: ${fileWords}\n\nUnable to extract raw text streams because this PDF is compressed/scanned. Please paste your plain text resume content here directly to run AI matching.`);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setResumeText(`[Uploaded File: ${file.name}]\nAutomatic parsing is supported for PDF and TXT. Please paste your plain text resume content here.`);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setResumeText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Modal / Detail state
  const [selectedJob, setSelectedJob] = useState(null);
  const [bookmarks, setBookmarks] = useState({});
  const [isEligibleChecked, setIsEligibleChecked] = useState(false);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState(null);

  // AI Coach Chat state
  const [coachMessage, setCoachMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [coachLoading, setCoachLoading] = useState(false);

  // Analytics & tracker state
  const [trackerJobs, setTrackerJobs] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [insightsData, setInsightsData] = useState(null);

  // Load user session on mount
  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.persona) setUserPersona(parsed.persona);
        if (parsed.skills) setUserSkills(parsed.skills);
        if (parsed.resumeText) setResumeText(parsed.resumeText);
        if (parsed.atsScore) setAtsScore(parsed.atsScore);
      } catch (err) {
        console.error("Failed to parse user session in jobs page:", err);
      }
    }
  }, []);

  // Fetch jobs list (all jobs, then we filter/recommend on the client based on user profile)
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (activeTab === 'returnships') params.append('returnshipOnly', 'true');

      const url = `${JOBS_API_URL}?${params.toString()}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, activeTab]);

  // Load tracker and analytics
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const resAnalytics = await fetch(`${JOBS_API_URL}/analytics`);
        if (resAnalytics.ok) {
          const data = await resAnalytics.json();
          setAnalyticsData(data);
        }
        const resInsights = await fetch(`${JOBS_API_URL}/insights`);
        if (resInsights.ok) {
          const data = await resInsights.json();
          setInsightsData(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadMetadata();
  }, []);

  // Fetch applications for Tracker Tab
  const fetchTrackerData = async () => {
    try {
      const res = await fetch(JOBS_API_URL);
      if (res.ok) {
        const data = await res.json();
        const allJobs = data.jobs || [];
        
        const states = ['Saved', 'Applied', 'Interview Scheduled', 'Offer Received', 'Rejected'];
        const mapped = allJobs.map((job, idx) => ({
          ...job,
          status: states[idx % states.length]
        }));
        setTrackerJobs(mapped);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'tracker') {
      fetchTrackerData();
    }
  }, [activeTab]);

  const toggleBookmark = async (e, jobId) => {
    e.stopPropagation();
    setBookmarks(prev => ({ ...prev, [jobId]: !prev[jobId] }));
    try {
      await fetch(`${JOBS_API_URL}/${jobId}/save`, { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
  };

  // Check Eligibility
  const handleCheckEligibility = async () => {
    if (!selectedJob) return;
    try {
      setEligibilityLoading(true);
      setIsEligibleChecked(true);
      const res = await fetch(`${JOBS_API_URL}/${selectedJob.id}/check-eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setEligibilityResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEligibilityLoading(false);
    }
  };

  // AI Coach Message Send
  const handleSendCoachMessage = async (e) => {
    e.preventDefault();
    if (!coachMessage.trim() || !selectedJob) return;

    const userMsg = { sender: 'user', text: coachMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setCoachMessage('');
    setCoachLoading(true);

    try {
      const res = await fetch(`${JOBS_API_URL}/${selectedJob.id}/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: coachMessage, chatHistory })
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory(prev => [...prev, { sender: 'ai', text: data.reply }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCoachLoading(false);
    }
  };

  // Resume Parse Action
  const handleResumeParse = async () => {
    if (!resumeText.trim()) return;
    try {
      setIsParsingResume(true);
      const res = await fetch(`${JOBS_API_URL}/parse-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.parsed && data.parsed.skills) {
          setUserSkills(data.parsed.skills);
          if (data.parsed.atsScore) {
            setAtsScore(data.parsed.atsScore);
          }
          
          // Update user session in localStorage
          const session = localStorage.getItem('user_session');
          if (session) {
            const parsed = JSON.parse(session);
            parsed.skills = data.parsed.skills;
            parsed.resumeText = resumeText;
            parsed.atsScore = data.parsed.atsScore || parsed.atsScore;
            localStorage.setItem('user_session', JSON.stringify(parsed));
          }
          
          alert(`Resume Parsed! Extracted skills: ${data.parsed.skills.join(', ')}. ATS Score: ${data.parsed.atsScore || 'N/A'}. Job recommendations have been updated.`);
          fetchJobs();
          setShowResumeEditor(false); // Hide the upload panel after successful parse
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsingResume(false);
    }
  };

  // Update Tracker status manually
  const updateTrackerStatus = async (jobId, newStatus) => {
    setTrackerJobs(prev => prev.map(job => job.id === jobId ? { ...job, status: newStatus } : job));
    try {
      await fetch(`${JOBS_API_URL}/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const openJobDetails = (job) => {
    setSelectedJob(job);
    setIsEligibleChecked(false);
    setEligibilityResult(null);
    setChatHistory([{ sender: 'ai', text: `Hi! I am your HerNova AI Career Coach. Ask me anything about preparing for this ${job.title} position at ${job.company}!` }]);
  };

  // Calculate recommendation metrics and order jobs automatically
  const recommendedJobs = jobs.map(job => {
    // 1. Skill compatibility score
    const required = job.required_skills || [];
    const matches = required.filter(skill => userSkills.some(us => us.toLowerCase() === skill.toLowerCase()));
    const skillScore = required.length > 0 ? (matches.length / required.length) * 100 : 50;

    // 2. Profile role / Experience level alignment
    let personaAlignment = 0;
    if (userPersona === 'returnship' && job.job_type === 'Returnship') {
      personaAlignment = 30; // Strong returnship boost
    } else if ((userPersona === 'student' || userPersona === 'fresher') && (job.experience === 'Fresher' || job.job_type === 'Internship')) {
      personaAlignment = 30;
    } else if (userPersona === 'professional' && job.experience === '5+ Years') {
      personaAlignment = 20;
    }

    const totalScore = Math.min(Math.round(skillScore + personaAlignment), 100);

    return {
      ...job,
      matchPercentage: Math.max(totalScore, 40) // minimum score threshold
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen bg-[#FFF7F9]">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes drift {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        @keyframes fadeUp {
            to { opacity: 1; transform: translateY(0); }
        }
        .job-card {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeUp 0.5s ease forwards;
        }
        .search-glow:focus-within {
            box-shadow: 0 0 15px rgba(194, 24, 91, 0.25);
            border-color: rgba(194, 24, 91, 0.4);
        }
        .glass-panel-hover:hover {
            box-shadow: 0 8px 32px rgba(194, 24, 91, 0.08);
            transform: translateY(-2px);
            border: 1px solid rgba(194, 24, 91, 0.3);
        }
      `}} />
      
      <Sidebar activeItem="jobs" />
      <Header />
      
      <main className="flex-1 ml-0 md:ml-64 mt-16 md:mt-24 p-margin-mobile md:p-margin-desktop min-h-screen pb-32 w-auto overflow-x-hidden relative z-10">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-glass-border mb-8 gap-6 text-sm font-semibold">
          <button 
            onClick={() => setActiveTab('analytics')} 
            className={`pb-3 px-1 transition-all border-b-2 ${activeTab === 'analytics' ? 'border-[#C2185B] text-primary' : 'border-transparent text-on-surface-variant'}`}
          >
            Career Analytics &amp; Insights 📊
          </button>
          <button 
            onClick={() => setActiveTab('feed')} 
            className={`pb-3 px-1 transition-all border-b-2 ${activeTab === 'feed' ? 'border-[#C2185B] text-primary' : 'border-transparent text-on-surface-variant'}`}
          >
            Recommended Jobs
          </button>
          <button 
            onClick={() => setActiveTab('returnships')} 
            className={`pb-3 px-1 transition-all border-b-2 ${activeTab === 'returnships' ? 'border-[#C2185B] text-primary' : 'border-transparent text-on-surface-variant'}`}
          >
            Returnship Hub 🔄
          </button>
          <button 
            onClick={() => setActiveTab('tracker')} 
            className={`pb-3 px-1 transition-all border-b-2 ${activeTab === 'tracker' ? 'border-[#C2185B] text-primary' : 'border-transparent text-on-surface-variant'}`}
          >
            Application Tracker 📋
          </button>
        </div>

        {activeTab !== 'analytics' && activeTab !== 'tracker' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar User Info Card (Filter sidebar replaced) */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5 border border-primary/10 bg-white/50">
                <h3 className="font-headline-md text-lg font-bold text-on-background flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">account_circle</span>
                  Your Profile Summary
                </h3>

                <div className="space-y-3">
                  <div className="p-3.5 bg-primary/10 rounded-xl">
                    <p className="text-[10px] font-bold text-[#C2185B] uppercase">Current Stage</p>
                    <p className="text-xs font-bold text-on-surface mt-1 capitalize">
                      {userPersona === 'returnship' ? '🔄 Career Returner' : 
                       userPersona === 'student' ? '🎓 Student' : 
                       userPersona === 'fresher' ? '✨ Graduate Fresher' : '💼 Working Professional'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-surface-container rounded-xl">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">Extracted Resume Skills</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {userSkills.map((s, idx) => (
                        <span key={idx} className="bg-white px-2 py-0.5 rounded text-[10px] font-bold border border-primary/10">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-3 border-t border-glass-border/30 text-center">
                  <p className="text-[10px] text-on-surface-variant mb-2">Want to change recommended listings?</p>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className="text-xs font-bold text-[#C2185B] hover:underline flex items-center justify-center gap-1.5 w-full"
                  >
                    Update Resume Parser ↗
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Job Board Feed */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Search Bar */}
              <div className="relative group max-w-2xl">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">search_spark</span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Fuzzy search recommended jobs..."
                  className="w-full pl-12 pr-4 py-4 rounded-full glass-panel search-glow font-body-md text-sm text-on-surface placeholder:text-outline outline-none transition-all duration-300"
                />
              </div>

              {loading ? (
                // Skeleton Loader
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                  {[1, 2, 4].map(idx => (
                    <div key={idx} className="h-64 rounded-2xl bg-white/50 border border-glass-border p-6 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-full bg-white/70"></div>
                        <div className="w-8 h-8 rounded-full bg-white/70"></div>
                      </div>
                      <div className="w-2/3 h-5 bg-white/70 rounded"></div>
                      <div className="w-1/2 h-4 bg-white/70 rounded"></div>
                      <div className="w-full h-12 bg-white/70 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : recommendedJobs.length === 0 ? (
                <div className="glass-panel p-12 rounded-2xl text-center">
                  <span className="material-symbols-outlined text-4xl text-outline-variant mb-3">search_off</span>
                  <p className="font-headline-md text-lg font-semibold text-on-surface-variant">No recommended jobs found</p>
                  <p className="text-sm text-outline">Try searching or adding more skills in the resume tab.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendedJobs.map(job => (
                    <article 
                      key={job.id} 
                      onClick={() => openJobDetails(job)}
                      className="job-card glass-panel rounded-2xl p-6 flex flex-col gap-4 cursor-pointer glass-panel-hover border border-glass-border transition-all duration-300 relative"
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border border-surface-variant shadow-sm">
                          <img className="w-full h-full object-cover" src={job.company_logo || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=150&q=60'} alt={job.company} />
                        </div>
                        <button 
                          className={`transition-colors p-1 ${bookmarks[job.id] ? 'text-[#FFB300]' : 'text-outline hover:text-[#FFB300]'}`} 
                          onClick={(e) => toggleBookmark(e, job.id)}
                        >
                          <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: bookmarks[job.id] ? "'FILL' 1" : "'FILL' 0"}}>star</span>
                        </button>
                      </div>

                      <div>
                        <h3 className="font-headline-md text-lg font-bold text-on-surface mb-1 leading-tight">{job.title}</h3>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/50 border border-white/80 text-[12px] text-on-surface-variant font-medium">
                          🏢 {job.company} · 📍 {job.location}
                        </div>
                      </div>

                      {/* AI Matching Percentage Badge */}
                      <div className="flex gap-2">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-primary/10 to-[#FFB300]/10 border border-primary/20 w-max shadow-sm">
                          <span className="material-symbols-outlined text-[13px] text-primary">auto_awesome</span>
                          <span className="text-[10px] font-bold text-[#C2185B]">{job.matchPercentage}% Match for you</span>
                        </div>

                        {job.women_friendly_score >= 90 && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF7F9] border border-primary/15 w-max">
                            <span className="material-symbols-outlined text-[13px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>stars</span>
                            <span className="text-[10px] font-bold text-[#C2185B]">{job.women_friendly_score}% Women-Friendly</span>
                          </div>
                        )}
                      </div>

                      {/* Info Chips */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-[#FFF7F9] border border-primary/10 text-[11px] text-primary font-bold">{job.job_type}</span>
                        <span className="px-2.5 py-1 rounded-md bg-surface-container/50 text-[11px] text-on-surface-variant font-medium">{job.work_mode}</span>
                        <span className="px-2.5 py-1 rounded-md bg-surface-container/50 text-[11px] text-on-surface-variant font-medium">{job.experience}</span>
                      </div>

                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                        {job.description}
                      </p>

                      <div className="mt-auto pt-3 border-t border-glass-border/30 flex justify-between items-center text-[10px] text-outline font-medium">
                        <span>Posted on: {new Date(job.posted_date).toLocaleDateString()}</span>
                        {job.salary && <span className="font-bold text-success-emerald bg-emerald-50 px-2 py-0.5 rounded">{job.salary}</span>}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Tracker Dashboard */}
        {activeTab === 'tracker' && (
          <div className="flex gap-6 overflow-x-auto pb-8 items-start min-h-[75vh]">
            {['Saved', 'Applied', 'Interview Scheduled', 'Offer Received', 'Rejected'].map(col => {
              const colJobs = trackerJobs.filter(j => j.status === col);
              
              // Custom colors & styles for each board column
              const colStyles = {
                'Saved': { bg: 'bg-slate-50/60', border: 'border-slate-200', text: 'text-slate-800', badge: 'bg-slate-200/80 text-slate-800' },
                'Applied': { bg: 'bg-indigo-50/60', border: 'border-indigo-150', text: 'text-indigo-900', badge: 'bg-indigo-200/80 text-indigo-900' },
                'Interview Scheduled': { bg: 'bg-rose-50/60', border: 'border-rose-150', text: 'text-[#C2185B]', badge: 'bg-[#C2185B]/10 text-[#C2185B]' },
                'Offer Received': { bg: 'bg-emerald-50/60', border: 'border-emerald-150', text: 'text-emerald-950', badge: 'bg-emerald-200/80 text-emerald-950' },
                'Rejected': { bg: 'bg-stone-50/40', border: 'border-stone-200', text: 'text-stone-700', badge: 'bg-stone-200 text-stone-700' }
              }[col] || { bg: 'bg-white/40', border: 'border-glass-border', text: 'text-on-surface', badge: 'bg-primary/10 text-primary' };

              return (
                <div 
                  key={col} 
                  className={`glass-panel p-5 rounded-2xl border ${colStyles.border} w-[290px] md:w-[330px] shrink-0 ${colStyles.bg} flex flex-col gap-4 shadow-sm min-h-[480px]`}
                >
                  <div className="flex justify-between items-center pb-3 border-b border-glass-border/30">
                    <h4 className={`font-black text-xs uppercase tracking-wider ${colStyles.text} flex items-center gap-1.5`}>
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      {col}
                    </h4>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold ${colStyles.badge}`}>{colJobs.length}</span>
                  </div>
                  
                  <div className="flex-1 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    {colJobs.length === 0 ? (
                      <div className="h-32 rounded-xl border border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center p-4">
                        <span className="material-symbols-outlined text-outline-variant text-[20px]">inbox</span>
                        <p className="text-[10px] text-outline mt-1 font-bold">Empty column</p>
                      </div>
                    ) : (
                      colJobs.map(job => (
                        <div 
                          key={job.id} 
                          className="p-4 bg-white hover:shadow-md border border-[#F0DCE3]/50 hover:border-primary/30 rounded-2xl transition-all duration-200 text-xs flex flex-col gap-3 relative group"
                        >
                          <div>
                            <div className="font-bold text-on-surface leading-snug hover:text-primary transition-colors text-sm">{job.title}</div>
                            <div className="text-[11px] text-on-surface-variant font-semibold mt-1">🏢 {job.company}</div>
                          </div>
                          
                          {job.location && (
                            <div className="text-[10px] text-outline flex items-center gap-1 font-medium">
                              <span className="material-symbols-outlined text-[12px] text-outline">location_on</span>
                              {job.location}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-1 pt-3 border-t border-glass-border/30 gap-2">
                            <button 
                              onClick={() => window.open(job.apply_url, '_blank')}
                              className="text-[#C2185B] font-bold hover:underline flex items-center gap-0.5 text-[10px] bg-[#FFF7F9] hover:bg-[#FBEAF0] px-2.5 py-1.5 rounded-lg border border-[#FBEAF0]"
                            >
                              Apply Link
                              <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                            </button>
                            
                            <select 
                              value={job.status} 
                              onChange={(e) => updateTrackerStatus(job.id, e.target.value)}
                              className="border border-[#F0DCE3] text-[10px] font-bold rounded-lg px-2 py-1.5 bg-[#FFF7F9] text-on-surface hover:border-primary transition-all focus:outline-none"
                            >
                              <option value="Saved">Saved</option>
                              <option value="Applied">Applied</option>
                              <option value="Interview Scheduled">Interview</option>
                              <option value="Offer Received">Offer</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 4: Career Analytics & Insights */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* Stats widgets */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-panel p-6 rounded-2xl text-center border border-primary/10">
                <span className="material-symbols-outlined text-3xl text-[#C2185B] mb-2">send</span>
                <p className="text-2xl font-bold text-on-surface">{analyticsData?.sentCount || 5}</p>
                <p className="text-xs text-on-surface-variant">Applications Sent</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl text-center border border-primary/10">
                <span className="material-symbols-outlined text-3xl text-primary mb-2">chat</span>
                <p className="text-2xl font-bold text-on-surface">{analyticsData?.interviewRate || 40}%</p>
                <p className="text-xs text-on-surface-variant">Interview Conversion Rate</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl text-center border border-primary/10">
                <span className="material-symbols-outlined text-3xl text-[#FFB300] mb-2">award_star</span>
                <p className="text-2xl font-bold text-on-surface">{analyticsData?.offerRate || 20}%</p>
                <p className="text-xs text-on-surface-variant">Offer Conversion Rate</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl text-center border border-primary/10">
                <span className="material-symbols-outlined text-3xl text-emerald-600 mb-2">trending_up</span>
                <p className="text-2xl font-bold text-on-surface">{analyticsData?.completionScore || 85}%</p>
                <p className="text-xs text-on-surface-variant">AI Profile Score</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Resume Intelligence / ATS Score Section */}
              <section className="glass-panel p-6 rounded-2xl border border-glass-border">
                <h3 className="font-headline-md text-lg font-bold text-on-background flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">description_spark</span>
                  ATS Resume Score & Analysis
                </h3>

                {resumeText.trim() && !showResumeEditor ? (
                  /* Premium ATS Score Dashboard */
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                      {/* Circular Gauge */}
                      <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-white shadow-md border-2 border-primary/20">
                        <div className="text-center">
                          <span className="text-2xl font-black text-[#C2185B]">{atsScore || 75}</span>
                          <span className="text-[10px] block text-outline font-bold">/ 100</span>
                        </div>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-sm font-bold text-on-surface">ATS Compatibility Score</h4>
                        <p className="text-xs text-on-surface-variant mt-1">
                          {atsScore >= 85 ? '🌟 Excellent! Your resume is highly optimized for applicant tracking systems.' :
                           atsScore >= 70 ? '👍 Strong alignment! Minor keyword optimization will make it perfect.' :
                           '⚠️ Needs optimization. Add more matching core skills and verify formatting.'}
                        </p>
                      </div>
                    </div>

                    {/* Detailed Analysis / Feedback Checklist */}
                    <div className="space-y-3 bg-white/40 p-4 rounded-xl border border-glass-border">
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">ATS Optimization Audit</p>
                      <ul className="space-y-2 text-xs">
                        <li className="flex items-center gap-2 text-emerald-700">
                          <span className="material-symbols-outlined text-[16px] font-bold">check_circle</span>
                          Standard section headings (Education, Experience, Skills) detected.
                        </li>
                        <li className="flex items-center gap-2 text-emerald-700">
                          <span className="material-symbols-outlined text-[16px] font-bold">check_circle</span>
                          Machine-readable format & clear hierarchical layout.
                        </li>
                        <li className="flex items-center gap-2 text-amber-700">
                          <span className="material-symbols-outlined text-[16px] font-bold">info</span>
                          Keyword density: {userSkills.length} core skills detected. Add missing target keywords to increase compatibility.
                        </li>
                      </ul>
                    </div>

                    {/* Extracted Skills */}
                    <div>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Extracted Resume Skills:</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {userSkills.map((s, idx) => (
                          <span key={idx} className="bg-white px-2.5 py-1 rounded text-[10px] font-bold border border-primary/20 shadow-sm">{s}</span>
                        ))}
                      </div>
                    </div>
                    {/* Low ATS Score Recommendations */}
                    {(atsScore || 75) < 85 && (
                      <div className="space-y-3 bg-[#FFF7F9] p-4 rounded-xl border border-primary/10">
                        <p className="text-[10px] font-bold text-[#C2185B] uppercase tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
                          How to Increase Your Score
                        </p>
                        
                        <div className="space-y-2 text-xs">
                          {/* Missing Keywords list */}
                          <div>
                            <span className="font-bold text-on-surface">Target Industry Keywords to Add:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {['React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'SQL', 'AWS', 'Python']
                                .filter(kw => !userSkills.some(s => s.toLowerCase() === kw.toLowerCase()))
                                .slice(0, 5)
                                .map((kw, idx) => (
                                  <span key={idx} className="bg-white/80 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold">
                                    + {kw}
                                  </span>
                                ))}
                            </div>
                            <p className="text-[10px] text-on-surface-variant mt-1 font-medium">
                              Including these missing high-demand skills from current market trends will significantly boost your ATS compatibility.
                            </p>
                          </div>

                          {/* Actionable changes */}
                          <div className="pt-2 border-t border-[#FBEAF0] space-y-1">
                            <span className="font-bold text-on-surface">Recommended Resume changes:</span>
                            <ul className="list-disc pl-4 space-y-1 text-on-surface-variant text-[11px] font-medium">
                              <li>Quantify achievements (e.g., <i>"Improved query response by 30%"</i> instead of <i>"Worked on queries"</i>).</li>
                              <li>Add a concise, keyword-rich <b>Professional Summary</b> at the top.</li>
                              <li>Use a clean, single-column standard format. Avoid multi-column text containers or charts that scramble standard parser sequence.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setShowResumeEditor(true)}
                      className="w-full bg-[#C2185B]/10 hover:bg-[#C2185B]/20 text-[#C2185B] font-bold h-10 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      Update / Re-upload Resume
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  </div>
                ) : (
                  /* File Dropzone & Editor Panel */
                  <div>
                    <p className="text-xs text-on-surface-variant mb-4">
                      Upload your resume file (.pdf, .docx, .txt) or paste your CV text below to parse and calculate your ATS score.
                    </p>

                    {/* File Dropzone */}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-primary/20 hover:border-primary/40 rounded-xl p-5 mb-4 text-center cursor-pointer transition-all bg-white/30 flex flex-col items-center justify-center gap-2"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept=".pdf,.doc,.docx,.txt" 
                        className="hidden" 
                      />
                      {!selectedFile ? (
                        <>
                          <span className="material-symbols-outlined text-3xl text-primary animate-pulse">cloud_upload</span>
                          <p className="text-xs font-bold text-on-surface">Click to upload your Resume file</p>
                          <p className="text-[10px] text-outline">Supports PDF, DOCX, TXT</p>
                        </>
                      ) : (
                        <div className="flex items-center gap-3 w-full bg-white p-2.5 rounded-lg border border-primary/10 relative">
                          <span className="material-symbols-outlined text-2xl text-primary">description</span>
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-xs font-bold text-on-surface truncate">{selectedFile.name}</p>
                            <p className="text-[9px] text-outline">{(selectedFile.size / 1024).toFixed(1)} KB · File Uploaded</p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSelectedFile();
                            }}
                            className="text-outline-variant hover:text-primary p-1 bg-transparent border-none"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <textarea 
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Or paste your plain-text resume here..."
                      className="w-full h-24 p-3 rounded-xl border border-glass-border bg-white/50 text-[11px] font-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary mb-4"
                    />

                    <div className="flex gap-3">
                      {resumeText.trim() && (
                        <button
                          onClick={() => setShowResumeEditor(false)}
                          className="flex-1 bg-outline/10 text-on-surface-variant font-bold h-10 rounded-xl text-xs flex items-center justify-center transition-all hover:bg-outline/20"
                        >
                          Cancel
                        </button>
                      )}
                      <button 
                        onClick={handleResumeParse}
                        disabled={isParsingResume || !resumeText.trim()}
                        className="flex-1 btn-primary h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                      >
                        {isParsingResume ? 'Analyzing Resume...' : 'Parse and Extract CV Skills'}
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      </button>
                    </div>
                  </div>
                )}
              </section>

              {/* Market Insights Dashboard */}
              <section className="glass-panel p-6 rounded-2xl border border-glass-border flex flex-col justify-between">
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-on-background flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-[#FFB300]">insights</span>
                    Live Market Insights
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-glass-border">
                      <span className="text-outline">Trending Technologies</span>
                      <span className="font-bold">{insightsData?.trendingTech?.slice(0, 3).join(', ') || 'React, AWS, Node'}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-glass-border">
                      <span className="text-outline">Highest Paying Skills</span>
                      <span className="font-bold">{insightsData?.highestPayingSkills?.slice(0, 2).join(', ') || 'AWS, Docker'}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-glass-border">
                      <span className="text-outline">Top Hiring Cities</span>
                      <span className="font-bold">{insightsData?.hiringCities?.slice(0, 3).join(', ') || 'Bengaluru, Pune'}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-outline">Fastest Growing Track</span>
                      <span className="font-bold text-[#C2185B]">{insightsData?.fastestGrowing || 'AI App Dev'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                  <p className="font-bold text-amber-800 flex items-center gap-1.5 mb-1">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    Diversity Reskilling Tip
                  </p>
                  <p className="text-amber-900 leading-relaxed text-[11px]">
                    Employers offering Returnships in Bengaluru are actively screening candidates with AWS Cloud Practitioner and Node.js backend credentials. Check your Eligibility check results to learn missing skills instantly.
                  </p>
                </div>
              </section>

            </div>
          </div>
        )}

      </main>

      {/* Main Interactive Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedJob(null)}>
          <div 
            className="bg-[#FFF7F9] border border-glass-border rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col" 
            onClick={e => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <header className="p-6 border-b border-glass-border flex justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden border border-surface-variant shadow-sm">
                  <img className="w-full h-full object-cover" src={selectedJob.company_logo || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=150&q=60'} alt={selectedJob.company} />
                </div>
                <div>
                  <h2 className="font-headline-md text-xl font-bold text-on-surface leading-snug">{selectedJob.title}</h2>
                  <p className="text-xs text-on-surface-variant font-medium">🏢 {selectedJob.company} · 📍 {selectedJob.location} · ⏱ Posted on {new Date(selectedJob.posted_date).toLocaleDateString()}</p>
                </div>
              </div>
              <button className="text-outline-variant hover:text-primary p-1 rounded-full hover:bg-glass-overlay" onClick={() => setSelectedJob(null)}>
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </header>

            {/* Modal Body */}
            <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Job Description (Left Column) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Salary/Type Chips */}
                <div className="flex flex-wrap gap-2.5">
                  {selectedJob.salary && <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs">{selectedJob.salary}</span>}
                  <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-xs">{selectedJob.job_type}</span>
                  <span className="bg-surface-container text-on-surface-variant font-medium px-3 py-1 rounded-full text-xs">{selectedJob.work_mode}</span>
                  <span className="bg-surface-container text-on-surface-variant font-medium px-3 py-1 rounded-full text-xs">Exp: {selectedJob.experience}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-headline-md text-sm font-bold text-outline-variant uppercase tracking-wider">Job Description</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-body-md whitespace-pre-line">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Returnship Details Widget */}
                {selectedJob.returnship_details && (
                  <div className="p-4 bg-[#FFB300]/10 border border-[#FFB300]/30 rounded-2xl space-y-2">
                    <h4 className="font-bold text-xs text-amber-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">change_circle</span>
                      Returnship Program Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-[11px] text-amber-900 leading-normal">
                      <div>
                        <strong>Program Duration:</strong> {selectedJob.returnship_details.duration || '6 Months'}
                      </div>
                      <div>
                        <strong>Eligibility Gap:</strong> {selectedJob.returnship_details.gapAllowed || '1+ Years'}
                      </div>
                      <div>
                        <strong>Work Schedule:</strong> {selectedJob.returnship_details.flexibleSchedule ? 'Flexible Hours' : 'Standard'}
                      </div>
                      <div>
                        <strong>Application Deadline:</strong> {selectedJob.returnship_details.deadline ? new Date(selectedJob.returnship_details.deadline).toLocaleDateString() : 'Rolling'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Required Skills list */}
                <div className="space-y-2">
                  <h3 className="font-headline-md text-sm font-bold text-outline-variant uppercase tracking-wider">Required Technical Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.required_skills && selectedJob.required_skills.map((skill, idx) => (
                      <span key={idx} className="bg-white border border-glass-border px-3 py-1 rounded-lg text-xs font-semibold">{skill}</span>
                    ))}
                  </div>
                </div>

                {/* AI Opportunity Checker Section */}
                <section className="border border-primary/20 bg-white/40 backdrop-blur-xl p-5 rounded-2xl space-y-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-[#C2185B] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                      AI Opportunity Eligibility Checker
                    </h4>
                    {!isEligibleChecked && (
                      <button 
                        onClick={handleCheckEligibility}
                        disabled={eligibilityLoading}
                        className="bg-primary hover:bg-[#9b0044] text-on-primary text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 shadow-[0_0_10px_rgba(194,24,91,0.2)]"
                      >
                        Am I Eligible?
                      </button>
                    )}
                  </div>

                  {eligibilityLoading && (
                    <div className="flex flex-col items-center justify-center py-6 gap-3">
                      <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
                      <p className="text-xs text-outline font-medium animate-pulse">Gemini AI is analyzing your compatibility score...</p>
                    </div>
                  )}

                  {isEligibleChecked && eligibilityResult && (
                    <div className="space-y-4 animate-fade-up text-xs">
                      
                      {/* Match Score Gauge */}
                      <div className="flex items-center gap-4 py-2 bg-gradient-to-r from-primary/10 to-[#FFB300]/10 rounded-xl px-4 border border-primary/10">
                        <div className="relative flex items-center justify-center w-16 h-16 rounded-full border-4 border-[#FFB300] bg-white">
                          <span className="font-headline-lg text-base font-bold text-[#C2185B]">{eligibilityResult.analysis.matchScore}%</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-on-surface">Overall Match Score</p>
                          <p className="text-[10px] text-on-surface-variant mt-0.5">{eligibilityResult.analysis.explanation}</p>
                        </div>
                      </div>

                      {/* Matching vs Missing Skills */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                          <p className="font-bold text-emerald-800 text-[10px] uppercase">✅ Matching Skills</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {eligibilityResult.analysis.matchingSkills.map((s, idx) => (
                              <span key={idx} className="bg-white px-2 py-0.5 rounded text-[10px] text-emerald-900 border border-emerald-300 font-medium">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                          <p className="font-bold text-rose-800 text-[10px] uppercase">❌ Skills to Learn</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {eligibilityResult.analysis.missingSkills.map((s, idx) => (
                              <span key={idx} className="bg-white px-2 py-0.5 rounded text-[10px] text-rose-900 border border-rose-300 font-medium">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Learning roadmap */}
                      <div className="p-3.5 bg-white border border-glass-border rounded-xl space-y-2">
                        <p className="font-bold text-outline-variant text-[10px] uppercase">📚 Recommended Study Roadmap</p>
                        <p className="text-[11px] text-on-surface"><strong>Estimated Reskilling Timeline:</strong> {eligibilityResult.analysis.timeline}</p>
                        
                        {/* Course Recommendations */}
                        {eligibilityResult.courses && eligibilityResult.courses.length > 0 && (
                          <div className="mt-2.5 space-y-2">
                            <p className="text-[10px] font-bold text-primary">Suggested reskilling courses from your Learn module:</p>
                            {eligibilityResult.courses.map(course => (
                              <div key={course.id} className="flex justify-between items-center bg-[#FFF7F9] p-2 rounded border border-primary/10">
                                <div>
                                  <span className="font-bold text-[11px] block">{course.title}</span>
                                  <span className="text-[9px] text-on-surface-variant font-medium">{course.category} · {course.total_lessons || 5} Lessons</span>
                                </div>
                                <a 
                                  href={`/learning?category=${course.category}`}
                                  className="bg-primary hover:bg-[#9b0044] text-on-primary font-bold px-3 py-1 rounded text-[10px] transition-colors"
                                >
                                  Learn missing skills
                                </a>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Mentor recommendations */}
                        {eligibilityResult.mentors && eligibilityResult.mentors.length > 0 && (
                          <div className="mt-3">
                            <p className="text-[10px] font-bold text-[#FFB300]-dark uppercase flex items-center gap-1">
                              👩‍🏫 Recommended Mentorship
                            </p>
                            {eligibilityResult.mentors.map(mentor => (
                              <div key={mentor.id} className="flex justify-between items-center bg-amber-50/50 p-2 rounded border border-amber-200 mt-1">
                                <span className="font-bold text-[11px] text-amber-900">{mentor.name} ({mentor.title})</span>
                                <a 
                                  href={`/mentorship`}
                                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1 rounded text-[10px] transition-colors"
                                >
                                  Schedule Mentor
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </section>

              </div>

              {/* AI Career Coach Chat Panel */}
              <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-glass-border pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-between min-h-[350px]">
                <div className="space-y-4 flex-1 flex flex-col">
                  <h4 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                    AI Career Coach
                  </h4>
                  
                  <div className="flex-1 max-h-[250px] overflow-y-auto space-y-2 p-2 bg-white/50 border border-glass-border rounded-xl text-[11px] leading-relaxed">
                    {chatHistory.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2.5 rounded-xl ${msg.sender === 'user' ? 'bg-primary/10 text-right ml-8 text-primary font-medium' : 'bg-surface-container mr-8 text-on-surface'}`}
                      >
                        {msg.text}
                      </div>
                    ))}
                    {coachLoading && (
                      <div className="bg-surface-container text-on-surface p-2.5 rounded-xl mr-8 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200"></span>
                      </div>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSendCoachMessage} className="mt-4 flex gap-2">
                  <input 
                    type="text" 
                    value={coachMessage}
                    onChange={(e) => setCoachMessage(e.target.value)}
                    placeholder="Ask prep tip, details..."
                    className="flex-1 px-3 py-2 rounded-xl border border-glass-border text-xs bg-white/70 outline-none"
                    disabled={coachLoading}
                  />
                  <button 
                    type="submit" 
                    className="bg-primary hover:bg-[#9b0044] text-on-primary p-2 rounded-xl flex items-center justify-center transition-colors"
                    disabled={coachLoading || !coachMessage.trim()}
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </form>
              </div>

            </div>

            {/* Modal Footer */}
            <footer className="p-6 border-t border-glass-border flex gap-4 bg-white/40">
              <button 
                onClick={() => {
                  window.open(selectedJob.apply_url, '_blank');
                  updateTrackerStatus(selectedJob.id, 'Applied');
                }}
                className="flex-1 bg-primary hover:bg-[#9b0044] text-on-primary py-3 rounded-2xl font-bold transition-all duration-300 text-sm shadow-[0_0_15px_rgba(194,24,91,0.25)] flex items-center justify-center gap-2"
              >
                Apply Now (External Link)
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
              {selectedJob.company_website && (
                <button 
                  onClick={() => window.open(selectedJob.company_website, '_blank')}
                  className="px-6 border border-glass-border text-on-surface-variant hover:text-primary font-bold py-3 rounded-2xl transition-all text-xs"
                >
                  Visit Company Website
                </button>
              )}
            </footer>

          </div>
        </div>
      )}

    </div>
  );
}
