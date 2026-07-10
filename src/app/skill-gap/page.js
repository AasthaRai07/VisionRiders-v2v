'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect, useState, useRef } from 'react';

// ─── Config map driven by persona ──────────────────────────────────────────

const PERSONA_CONFIG = {
  student: {
    bucket1Label: 'Have',
    bucket2Label: 'Should Learn Soon',
    bucket3Label: 'Must-Have for Internship',
    bucket1Desc: 'Skills you already have from coursework & projects.',
    bucket2Desc: 'Skills that would strengthen your internship profile.',
    bucket3Desc: 'Critical skills you must learn for an internship.',
    planTitle: '7-Day Internship Prep Plan',
    roles: ['UX Design Intern', 'Data Science Intern', 'Software Engineering Intern', 'PM Intern'],
    bucket1Icon: 'check_circle',
    bucket2Icon: 'trending_up',
    bucket3Icon: 'priority_high',
  },
  fresher: {
    bucket1Label: 'Have',
    bucket2Label: 'Should Strengthen',
    bucket3Label: 'Must-Have for This Role',
    bucket1Desc: 'Skills you already have from projects & internships.',
    bucket2Desc: 'Skills to deepen for full-time job-readiness.',
    bucket3Desc: 'Critical missing skills for this entry-level role.',
    planTitle: '7-Day Job-Ready Sprint',
    roles: ['Junior UX Designer', 'Associate Data Scientist', 'Junior Software Engineer', 'Associate PM'],
    bucket1Icon: 'check_circle',
    bucket2Icon: 'build',
    bucket3Icon: 'star',
  },
  professional: {
    bucket1Label: 'Strong Fit',
    bucket2Label: 'Growth Area',
    bucket3Label: 'Skill Gap for Target Role',
    bucket1Desc: 'Skills where you\'re already strong for the target role.',
    bucket2Desc: 'Skills that exist but need deepening.',
    bucket3Desc: 'Skills entirely missing that the target role requires.',
    planTitle: '7-Day Growth Plan',
    roles: ['Data Scientist', 'UX Designer', 'Product Manager', 'Software Engineer'],
    bucket1Icon: 'verified',
    bucket2Icon: 'trending_up',
    bucket3Icon: 'lightbulb',
  },
  returnship: {
    bucket1Label: 'Still Solid',
    bucket2Label: 'Needs Refresh',
    bucket3Label: 'New Since You Left',
    bucket1Desc: 'Core competencies you maintain well.',
    bucket2Desc: 'Skills that need a quick update.',
    bucket3Desc: 'Critical gaps to fill for this role.',
    planTitle: '7-Day Recovery Plan',
    roles: ['Data Scientist', 'UX Designer', 'Product Manager', 'Software Engineer'],
    bucket1Icon: 'check_circle',
    bucket2Icon: 'update',
    bucket3Icon: 'star',
  },
};

const API_BASE = 'http://127.0.0.1:5001/hernova-13f01/us-central1/api';

export default function SkillGapAnalyzer() {
  // ─── State ─────────────────────────────────────────────────────────────
  const [persona, setPersona] = useState(null);      // from profile
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const fileInputRef = useRef(null);
  
  // Autocomplete state
  const [allRoles, setAllRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const config = PERSONA_CONFIG[persona] || PERSONA_CONFIG.professional;

  // Placeholder for missing updateFinHerScore function
  const updateFinHerScore = (increment) => {
    console.log(`[Mock] FinHer Score increased by ${increment}`);
  };

  const toggleDayCompletion = async (dayNumber) => {
    if (!analysisResult || !analysisResult.id) return;
    
    const completedDays = analysisResult.completed_days || [];
    const isCompleted = completedDays.includes(dayNumber);
    const newCompleted = !isCompleted;
    
    // Optimistic UI Update
    setAnalysisResult(prev => {
      const newCompletedDays = newCompleted 
        ? [...(prev.completed_days || []), dayNumber]
        : (prev.completed_days || []).filter(d => d !== dayNumber);
        
      return { ...prev, completed_days: newCompletedDays };
    });
    
    if (newCompleted) {
      updateFinHerScore(5); // Increment score by 5
    }
    
    try {
      const res = await fetch(`${API_BASE}/skill-gap/${analysisResult.id}/toggle-day`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day: dayNumber, completed: newCompleted })
      });
      
      if (!res.ok) {
        throw new Error('Failed to update completion status');
      }
    } catch (err) {
      console.error("Toggle error:", err);
      // Revert on failure (simplified)
      setAnalysisResult(prev => {
        const newCompletedDays = !newCompleted 
          ? [...(prev.completed_days || []), dayNumber]
          : (prev.completed_days || []).filter(d => d !== dayNumber);
        return { ...prev, completed_days: newCompletedDays };
      });
    }
  };

  // ─── Fetch user profile on mount ───────────────────────────────────────
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_BASE}/users/demo-user-123/profile`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.profile && data.profile.persona) {
            setPersona(data.profile.persona);
          } else {
            setPersona(null); // will default to professional
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, []);

  // ─── Fetch latest report on mount ──────────────────────────────────────
  useEffect(() => {
    async function fetchLatestReport() {
      try {
        const res = await fetch(`${API_BASE}/skill-gap/demo-user-123/latest`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.report) {
            setAnalysisResult(data.report);
            setSelectedRole(data.report.target_role || '');
          }
        }
      } catch (err) {
        console.error("Failed to fetch latest report:", err);
      }
    }
    fetchLatestReport();
  }, []);

  // ─── Fetch target roles on mount ───────────────────────────────────────
  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch(`${API_BASE}/skill-gap/roles`);
        if (res.ok) {
          const data = await res.json();
          setAllRoles(data.roles || []);
        }
      } catch (err) {
        console.error("Failed to fetch roles:", err);
      }
    }
    fetchRoles();
  }, []);

  // ─── Autocomplete logic ────────────────────────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRoles([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = allRoles.filter(role => {
      const matchName = role.roleName.toLowerCase().includes(query);
      const matchAlias = (role.aliases || []).some(alias => alias.toLowerCase().includes(query));
      return matchName || matchAlias;
    }).slice(0, 8); // limit results
    
    setFilteredRoles(results);
  }, [searchQuery, allRoles]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // No default role, let the user choose or type

  // ─── File handling ─────────────────────────────────────────────────────
  const handleFileSelect = (file) => {
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.txt'))) {
      setResumeFile(file);
      setError(null);
    } else if (file) {
      setError('Please upload a PDF, DOCX, or TXT file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // ─── Analyze resume ────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!resumeFile || !selectedRole) return;
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const isPdf = resumeFile.type === 'application/pdf';
      let resumeData = '';
      
      if (isPdf) {
        resumeData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result;
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(resumeFile);
        });
      } else {
        resumeData = await resumeFile.text();
      }
      
      const matchedRole = allRoles.find(r => r.roleName.toLowerCase() === selectedRole.toLowerCase());
      const derivedIndustry = matchedRole ? matchedRole.industry : 'Tech';
      
      const res = await fetch(`${API_BASE}/skill-gap/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeData,
          is_pdf: isPdf,
          target_role: selectedRole,
          user_type: persona || 'professional',
          industry: derivedIndustry
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || 'Analysis failed');
      }

      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      if (err.message !== 'AI_SERVICE_UNAVAILABLE') {
        console.error("Analysis failed:", err);
      }
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-amber {
            0% { box-shadow: 0 0 0 0 rgba(255, 179, 0, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(255, 179, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 179, 0, 0); }
        }
        .animate-pulse-amber {
            animation: pulse-amber 2s infinite;
        }
        
        @keyframes slide-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
            animation: slide-up 0.5s ease-out forwards;
        }
        
        .stagger-1 { animation-delay: 100ms; opacity: 0; }
        .stagger-2 { animation-delay: 200ms; opacity: 0; }
        .stagger-3 { animation-delay: 300ms; opacity: 0; }
        .stagger-4 { animation-delay: 400ms; opacity: 0; }
        .stagger-5 { animation-delay: 500ms; opacity: 0; }
        
        .dropzone-container:hover .dropzone-border {
            border-color: #FFB300;
            box-shadow: 0 0 15px rgba(255, 179, 0, 0.2) inset;
        }
        
        .chip-radio:checked + label {
            background-color: #C2185B;
            color: white;
            border-color: #C2185B;
            box-shadow: 0 0 15px rgba(194, 24, 91, 0.3);
        }
      `}} />
      
      <Sidebar activeItem="learn" />
      <Header />
      
      <main className="md:ml-64 pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop pb-32 max-w-container-max mx-auto relative z-10 w-full flex-grow flex flex-col gap-10">
        
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-primary flex items-center gap-3">
              Find Your Path <span className="text-tertiary-fixed-dim text-2xl">✦</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Upload your resume, we'll map the gap.</p>
          
          {/* Profile missing banner */}
          {!loadingProfile && !persona && (
            <div className="mt-2 glass-panel rounded-xl px-4 py-3 flex items-center gap-3 border border-[#FFB300]/30">
              <span className="material-symbols-outlined text-[#FFB300]">info</span>
              <p className="text-sm text-on-surface-variant">
                <a href="/profile" className="text-primary hover:underline font-medium">Update your profile</a> to personalize this analysis.
              </p>
            </div>
          )}
        </div>

        {/* STEP 1: Upload Card */}
        <section className="glass-panel rounded-2xl p-8 flex flex-col gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary to-transparent rounded-full blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
          <h3 className="font-headline-md text-headline-md font-medium flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary-container/20 text-primary flex items-center justify-center text-sm font-bold border border-primary/30">1</span>
            Resume Analysis
          </h3>
          
          {/* Dropzone */}
          <div 
            className="dropzone-container cursor-pointer group"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
            <div className={`dropzone-border border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-all duration-300 bg-white/5 relative ${
              isDragging ? 'border-[#FFB300] bg-[#FFB300]/5' : 'border-[#FFB300]/50'
            } ${resumeFile ? 'border-success-emerald/50' : ''}`}>
              {resumeFile ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-success-emerald/10 flex items-center justify-center text-success-emerald">
                    <span className="material-symbols-outlined text-4xl">task_alt</span>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg mb-1 text-success-emerald">{resumeFile.name}</p>
                    <p className="text-sm text-on-surface-variant">{(resumeFile.size / 1024).toFixed(1)} KB • Click to change</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary animate-bounce">
                    <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg mb-1">Drag and drop your resume here</p>
                    <p className="text-sm text-on-surface-variant">PDF, DOCX, TXT up to 5MB</p>
                  </div>
                  <button className="mt-4 px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-[#320047] transition-colors font-semibold">
                      Browse Files
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Target Role Autocomplete */}
          <div className="flex flex-col gap-3 mt-4" ref={dropdownRef}>
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Target Role</label>
            <div className="relative">
              <div className="flex items-center bg-white/5 border border-[#FFB300]/50 rounded-xl px-4 py-3 focus-within:border-[#FFB300] focus-within:bg-[#FFB300]/5 transition-all">
                <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
                <input
                  type="text"
                  placeholder="Search for a role (e.g. Data Scientist, SWE, Quant...)"
                  className="bg-transparent border-none outline-none w-full text-on-surface placeholder:text-on-surface-variant/50"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                    setSelectedRole(e.target.value); // keep it synced if they just type and don't click
                  }}
                  onFocus={() => setShowDropdown(true)}
                />
              </div>
              
              {showDropdown && filteredRoles.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#2d1b36] border border-glass-border rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                  {filteredRoles.map(role => (
                    <div 
                      key={role.id || role.roleName} 
                      className="px-4 py-3 hover:bg-white/10 cursor-pointer flex justify-between items-center border-b border-white/5 last:border-0"
                      onClick={() => {
                        setSelectedRole(role.roleName);
                        setSearchQuery(role.roleName);
                        setShowDropdown(false);
                      }}
                    >
                      <div>
                        <p className="font-medium text-on-surface">{role.roleName}</p>
                        {role.aliases && role.aliases.length > 0 && (
                          <p className="text-xs text-on-surface-variant">Also known as: {role.aliases.join(', ')}</p>
                        )}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider bg-primary/20 text-primary px-2 py-1 rounded-full border border-primary/30 whitespace-nowrap">
                        {role.industry}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Suggested Roles (Quick Select) */}
            <div className="mt-2">
              <p className="text-xs text-on-surface-variant mb-2">Suggested for you:</p>
              <div className="flex flex-wrap gap-2">
                {config.roles.map((role) => (
                  <div key={role}>
                    <input 
                      className="peer sr-only chip-radio" 
                      id={`role-${role.replace(/\s+/g, '-')}`} 
                      name="role" 
                      type="radio" 
                      checked={selectedRole === role}
                      onChange={() => {
                        setSelectedRole(role);
                        setSearchQuery(role);
                      }}
                    />
                    <label 
                      className="cursor-pointer px-3 py-1.5 rounded-full border border-glass-border bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md inline-flex items-center gap-2 text-xs text-on-surface" 
                      htmlFor={`role-${role.replace(/\s+/g, '-')}`}
                    >
                      {role}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          {resumeFile && selectedRole && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={`mt-2 px-8 py-3 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                isAnalyzing 
                  ? 'bg-primary/50 text-white/50 cursor-wait' 
                  : 'bg-gradient-to-r from-primary to-[#FFB300] text-[#320047] hover:shadow-[0_0_20px_rgba(194,24,91,0.3)] hover:scale-[1.02]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></div>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">auto_awesome</span>
                  Analyze My Skills
                </>
              )}
            </button>
          )}
          
          {error && error === 'AI_SERVICE_UNAVAILABLE' ? (
            <div className="mt-4 p-6 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-2 border-primary/50 border-t-primary rounded-full animate-spin"></div>
              <p className="text-on-surface-variant text-sm">
                This is taking longer than usual — please try again in a moment.
              </p>
              <button
                onClick={handleAnalyze}
                className="px-6 py-2 rounded-full border border-glass-border bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
              >
                Retry
              </button>
            </div>
          ) : error && (
            <div className="mt-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}
        </section>

        {/* STEP 2: Results — only show when we have analysis */}
        {analysisResult && (
          <section className="flex flex-col gap-6 animate-slide-up">
            <h3 className="font-headline-md text-headline-md font-medium flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary-container/20 text-primary flex items-center justify-center text-sm font-bold border border-primary/30">2</span>
              Skill Mapping
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1: Bucket 1 (green) */}
              <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border-t-4 border-t-success-emerald">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-success-emerald">{config.bucket1Icon}</span>
                  <h4 className="font-bold text-success-emerald">{analysisResult.labels?.bucket1 || config.bucket1Label}</h4>
                </div>
                <p className="text-sm text-on-surface-variant">{config.bucket1Desc}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(analysisResult.bucket1 || []).map((skill, i) => (
                    <span key={skill} className={`px-3 py-1.5 bg-success-emerald/10 text-success-emerald border border-success-emerald/20 rounded-lg text-sm animate-slide-up stagger-${(i % 5) + 1}`}>{skill}</span>
                  ))}
                  {(analysisResult.bucket1 || []).length === 0 && (
                    <span className="text-sm text-on-surface-variant/50 italic">None identified</span>
                  )}
                </div>
              </div>
              
              {/* Column 2: Bucket 2 (amber) */}
              <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border-t-4 border-t-[#FFB300]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#FFB300]">{config.bucket2Icon}</span>
                  <h4 className="font-bold text-[#FFB300]">{analysisResult.labels?.bucket2 || config.bucket2Label}</h4>
                </div>
                <p className="text-sm text-on-surface-variant">{config.bucket2Desc}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(analysisResult.bucket2 || []).map((skill, i) => (
                    <span key={skill} className={`px-3 py-1.5 bg-[#FFB300]/10 text-[#FFB300] border border-[#FFB300]/30 rounded-lg text-sm animate-slide-up stagger-${(i % 5) + 1}`}>{skill}</span>
                  ))}
                  {(analysisResult.bucket2 || []).length === 0 && (
                    <span className="text-sm text-on-surface-variant/50 italic">None identified</span>
                  )}
                </div>
              </div>
              
              {/* Column 3: Bucket 3 (pink/primary) */}
              <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border-t-4 border-t-primary">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">{config.bucket3Icon}</span>
                  <h4 className="font-bold text-primary">{analysisResult.labels?.bucket3 || config.bucket3Label}</h4>
                </div>
                <p className="text-sm text-on-surface-variant">{config.bucket3Desc}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(analysisResult.bucket3 || []).map((skill, i) => (
                    <span key={skill} className={`px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm animate-slide-up stagger-${(i % 5) + 1}`}>{skill}</span>
                  ))}
                  {(analysisResult.bucket3 || []).length === 0 && (
                    <span className="text-sm text-on-surface-variant/50 italic">None identified</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Timeline — only show when we have analysis */}
        {analysisResult && analysisResult.seven_day_plan && analysisResult.seven_day_plan.length > 0 && (
          <section className="glass-panel rounded-2xl p-8 mb-10 animate-slide-up">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline-md text-headline-md font-medium">{analysisResult.labels?.planTitle || config.planTitle}</h3>
              <button className="text-primary font-medium flex items-center gap-1 hover:underline text-sm">
                  View Full Path <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <div className="relative pt-8 pb-4 overflow-x-auto">
              {/* Connector Line */}
              <div className="absolute top-[42px] left-8 right-8 h-[2px] border-t-2 border-dotted border-white/20 -z-10 min-w-[600px]"></div>
              
              <div className="flex justify-between min-w-[600px] relative">
                {analysisResult.seven_day_plan.slice(0, 7).map((dayItem) => {
                  const dayNum = dayItem.day;
                  const completedDays = analysisResult.completed_days || [];
                  const isCompleted = completedDays.includes(dayNum);
                  
                  // "Current" is the first day that is not completed
                  const isCurrent = !isCompleted && (
                    dayNum === 1 || 
                    analysisResult.seven_day_plan.slice(0, dayNum - 1).every(d => completedDays.includes(d.day))
                  );
                  
                  const isFuture = !isCompleted && !isCurrent;
                  
                  const isExpanded = expandedDay === dayNum;
                  
                  return (
                    <div key={dayNum} className={`flex flex-col items-center gap-3 relative cursor-pointer group ${isCurrent ? 'w-32' : 'w-24'}`} onClick={() => setExpandedDay(isExpanded ? null : dayNum)}>
                      {isCompleted ? (
                        <>
                          <div className={`w-10 h-10 rounded-full bg-success-emerald/20 text-success-emerald flex items-center justify-center relative z-10 border ${isExpanded ? 'border-success-emerald ring-2 ring-success-emerald/50' : 'border-success-emerald/30'} group-hover:bg-success-emerald/30 transition-all`}>
                            <span className="material-symbols-outlined text-xl">check_circle</span>
                          </div>
                          <div className="text-center">
                            <p className="font-label-sm text-label-sm text-success-emerald font-bold">DAY {dayNum}</p>
                            <p className="text-sm font-medium mt-1 max-w-[100px] truncate text-on-surface-variant line-through">{dayItem.skill}</p>
                          </div>
                        </>
                      ) : isCurrent ? (
                        <>
                          <div className={`w-10 h-10 rounded-full bg-[#FFB300] text-[#320047] flex items-center justify-center animate-pulse-amber relative z-10 font-bold group-hover:scale-110 transition-transform ${isExpanded ? 'ring-4 ring-[#FFB300]/30' : ''}`}>
                            <span className="text-xl">✦</span>
                          </div>
                          <div className="text-center">
                            <p className="font-label-sm text-label-sm text-[#FFB300] font-bold">DAY {dayNum} (TODAY)</p>
                            <p className="text-sm font-medium mt-1 max-w-[120px] truncate">{dayItem.skill}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={`w-8 h-8 rounded-full bg-white/5 border text-on-surface-variant flex items-center justify-center relative z-10 group-hover:bg-white/10 transition-all mt-1 ${isExpanded ? 'border-primary ring-2 ring-primary/50 text-primary' : 'border-white/20'}`}>
                            <span className="text-lg opacity-50 group-hover:opacity-100">✦</span>
                          </div>
                          <div className={`text-center transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                            <p className={`font-label-sm text-label-sm ${isExpanded ? 'text-primary font-bold' : ''}`}>DAY {dayNum}</p>
                            <p className="text-sm mt-1 max-w-[96px] truncate">{dayItem.skill}</p>
                          </div>
                        </>
                      )}
                      
                      {/* Selection Indicator Arrow */}
                      {isExpanded && (
                        <div className="absolute -bottom-4 w-4 h-4 bg-glass-overlay border-t border-l border-glass-border rotate-45 z-0"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Inline Detail Card for Expanded Day */}
            {expandedDay && (() => {
              const dayItem = analysisResult.seven_day_plan.find(d => d.day === expandedDay);
              if (!dayItem) return null;
              
              const isCompleted = (analysisResult.completed_days || []).includes(expandedDay);
              
              return (
                <div className="mt-2 p-6 bg-glass-overlay border border-glass-border rounded-xl animate-slide-up flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative z-10">
                  <div>
                    <h4 className="font-bold text-lg text-on-surface mb-1">Day {expandedDay}: <span className="text-primary">{dayItem.skill}</span></h4>
                    <p className="text-sm text-on-surface-variant mb-4 max-w-2xl">
                      {dayItem.description || `Focus on learning ${dayItem.skill} today. Click the resource link to get started.`}
                    </p>
                    {dayItem.resource_link && (
                      <a href={dayItem.resource_link.startsWith('http') ? dayItem.resource_link : `https://www.google.com/search?q=${encodeURIComponent(dayItem.resource_link)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-[#FFB300] hover:underline">
                        <span className="material-symbols-outlined text-sm">menu_book</span> Open Resource
                      </a>
                    )}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleDayCompletion(expandedDay); }}
                    className={`px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${isCompleted ? 'bg-white/10 text-on-surface hover:bg-white/20' : 'bg-success-emerald text-background hover:bg-success-emerald/90'}`}
                  >
                    <span className="material-symbols-outlined text-lg">{isCompleted ? 'undo' : 'check'}</span>
                    {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </button>
                </div>
              );
            })()}
          </section>
        )}

        {/* Static placeholder when no analysis yet */}
        {!analysisResult && !isAnalyzing && (
          <>
            {/* STEP 2: Static Results Preview */}
            <section className="flex flex-col gap-6">
              <h3 className="font-headline-md text-headline-md font-medium flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-container/20 text-primary flex items-center justify-center text-sm font-bold border border-primary/30">2</span>
                Skill Mapping
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1 */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border-t-4 border-t-success-emerald">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-success-emerald">{config.bucket1Icon}</span>
                    <h4 className="font-bold text-success-emerald">{config.bucket1Label}</h4>
                  </div>
                  <p className="text-sm text-on-surface-variant">{config.bucket1Desc}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1.5 bg-success-emerald/10 text-success-emerald border border-success-emerald/20 rounded-lg text-sm animate-slide-up stagger-1">Figma</span>
                    <span className="px-3 py-1.5 bg-success-emerald/10 text-success-emerald border border-success-emerald/20 rounded-lg text-sm animate-slide-up stagger-2">User Research</span>
                    <span className="px-3 py-1.5 bg-success-emerald/10 text-success-emerald border border-success-emerald/20 rounded-lg text-sm animate-slide-up stagger-3">Prototyping</span>
                  </div>
                </div>
                
                {/* Column 2 */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border-t-4 border-t-[#FFB300]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FFB300]">{config.bucket2Icon}</span>
                    <h4 className="font-bold text-[#FFB300]">{config.bucket2Label}</h4>
                  </div>
                  <p className="text-sm text-on-surface-variant">{config.bucket2Desc}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1.5 bg-[#FFB300]/10 text-[#FFB300] border border-[#FFB300]/30 rounded-lg text-sm animate-slide-up stagger-2 flex items-center gap-1">
                        WCAG 2.1 <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span> 2.2
                    </span>
                    <span className="px-3 py-1.5 bg-[#FFB300]/10 text-[#FFB300] border border-[#FFB300]/30 rounded-lg text-sm animate-slide-up stagger-3">Design Systems</span>
                  </div>
                </div>
                
                {/* Column 3 */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border-t-4 border-t-primary">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">{config.bucket3Icon}</span>
                    <h4 className="font-bold text-primary">{config.bucket3Label}</h4>
                  </div>
                  <p className="text-sm text-on-surface-variant">{config.bucket3Desc}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm animate-slide-up stagger-3">Generative AI Tools</span>
                    <span className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm animate-slide-up stagger-4">Figma Variables</span>
                    <span className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm animate-slide-up stagger-5">Spatial UI</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Static Timeline Preview */}
            <section className="glass-panel rounded-2xl p-8 mb-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-headline-md text-headline-md font-medium">{config.planTitle}</h3>
                <button className="text-primary font-medium flex items-center gap-1 hover:underline text-sm">
                    View Full Path <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
              <div className="relative pt-8 pb-4 overflow-x-auto">
                <div className="absolute top-[42px] left-8 right-8 h-[2px] border-t-2 border-dotted border-white/20 -z-10 min-w-[600px]"></div>
                
                <div className="flex justify-between min-w-[600px] relative">
                  {/* Day 1: Completed */}
                  <div className="flex flex-col items-center gap-3 group w-24">
                    <div className="w-8 h-8 rounded-full bg-success-emerald text-white flex items-center justify-center shadow-md relative z-10">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <div className="text-center">
                      <p className="font-label-sm text-label-sm text-on-surface-variant">DAY 1</p>
                      <p className="text-sm font-medium mt-1">Figma Updates</p>
                    </div>
                  </div>
                  
                  {/* Day 2: Completed */}
                  <div className="flex flex-col items-center gap-3 group w-24">
                    <div className="w-8 h-8 rounded-full bg-success-emerald text-white flex items-center justify-center shadow-md relative z-10">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <div className="text-center">
                      <p className="font-label-sm text-label-sm text-on-surface-variant">DAY 2</p>
                      <p className="text-sm font-medium mt-1">Variables</p>
                    </div>
                  </div>
                  
                  {/* Day 3: Current */}
                  <div className="flex flex-col items-center gap-3 group w-32 cursor-pointer relative">
                    <div className="absolute top-12 w-48 bg-glass-overlay backdrop-blur-md rounded-xl p-3 shadow-xl border border-glass-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-20 translate-y-2 group-hover:translate-y-0 duration-200">
                      <p className="text-xs text-[#FFB300] font-bold mb-1">CURRENT MODULE</p>
                      <p className="text-sm font-medium mb-2 text-on-surface">Intro to AI for UX</p>
                      <button className="w-full bg-[#FFB300] text-[#320047] font-semibold text-xs py-1.5 rounded-lg flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">play_circle</span> Start Video
                      </button>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#FFB300] text-[#320047] flex items-center justify-center animate-pulse-amber relative z-10 font-bold">
                      <span className="text-xl">✦</span>
                    </div>
                    <div className="text-center">
                      <p className="font-label-sm text-label-sm text-[#FFB300] font-bold">DAY 3 (TODAY)</p>
                      <p className="text-sm font-medium mt-1">AI Tools Intro</p>
                    </div>
                  </div>
                  
                  {/* Day 4: Future */}
                  <div className="flex flex-col items-center gap-3 group w-24">
                    <div className="w-8 h-8 rounded-full bg-white/10 text-on-surface-variant flex items-center justify-center relative z-10">
                      <span className="text-lg">✦</span>
                    </div>
                    <div className="text-center opacity-50">
                      <p className="font-label-sm text-label-sm">DAY 4</p>
                      <p className="text-sm mt-1">AI Prompts</p>
                    </div>
                  </div>

                  {/* Day 5: Future */}
                  <div className="flex flex-col items-center gap-3 group w-24">
                    <div className="w-8 h-8 rounded-full bg-white/10 text-on-surface-variant flex items-center justify-center relative z-10">
                      <span className="text-lg">✦</span>
                    </div>
                    <div className="text-center opacity-50">
                      <p className="font-label-sm text-label-sm">DAY 5</p>
                      <p className="text-sm mt-1">Project</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

      </main>
    </div>
  );
}
