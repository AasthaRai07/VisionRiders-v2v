'use client';

import { useState } from 'react';

export default function PersonaQuestions({ onBack, onSubmit, onboardingData }) {
  const persona = onboardingData.persona;

  // --- Student State ---
  const [studentYear, setStudentYear] = useState('');
  const [hasInternship, setHasInternship] = useState(false);
  const [internshipDetails, setInternshipDetails] = useState('');
  const [studentCourses, setStudentCourses] = useState([]);
  const [studentConfidence, setStudentConfidence] = useState(3);
  const [studentBlocker, setStudentBlocker] = useState('');

  // --- Fresher State ---
  const [gradYear, setGradYear] = useState('');
  const [fresherJobOffers, setFresherJobOffers] = useState(false);
  const [fresherAppliedCount, setFresherAppliedCount] = useState('');
  const [fresherSkills, setFresherSkills] = useState([]);
  const [fresherSkillInput, setFresherSkillInput] = useState('');
  const [fresherBlocker, setFresherBlocker] = useState('');

  // --- Working Professional State ---
  const [currentRole, setCurrentRole] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [professionalReason, setProfessionalReason] = useState('');
  const [professionalSkills, setProfessionalSkills] = useState([]);
  const [professionalSkillInput, setProfessionalSkillInput] = useState('');
  const [skillGap, setSkillGap] = useState('');

  // --- Returnship State ---
  const [lastRole, setLastRole] = useState('');
  const [breakDuration, setBreakDuration] = useState('');
  const [breakReason, setBreakReason] = useState('');
  const [returnshipConfidence, setReturnshipConfidence] = useState(3);
  const [returnType, setReturnType] = useState('');

  // Loading and submit states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Helpers for Tag Input ---
  const addFresherSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const val = fresherSkillInput.trim();
      if (val && !fresherSkills.includes(val)) {
        setFresherSkills([...fresherSkills, val]);
        setFresherSkillInput('');
      }
    }
  };

  const removeFresherSkill = (skillToRemove) => {
    setFresherSkills(fresherSkills.filter((s) => s !== skillToRemove));
  };

  const addProfessionalSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const val = professionalSkillInput.trim();
      if (val && !professionalSkills.includes(val)) {
        setProfessionalSkills([...professionalSkills, val]);
        setProfessionalSkillInput('');
      }
    }
  };

  const removeProfessionalSkill = (skillToRemove) => {
    setProfessionalSkills(professionalSkills.filter((s) => s !== skillToRemove));
  };

  // --- Validation Logic ---
  const validateForm = () => {
    if (persona === 'student') {
      const isInternshipOk = !hasInternship || internshipDetails.trim() !== '';
      return studentYear !== '' && isInternshipOk && studentBlocker !== '';
    }
    if (persona === 'fresher') {
      return gradYear !== '' && fresherAppliedCount !== '' && fresherSkills.length > 0 && fresherBlocker !== '';
    }
    if (persona === 'professional') {
      return currentRole.trim() !== '' && yearsExperience !== '' && professionalReason !== '' && professionalSkills.length > 0 && skillGap.trim() !== '';
    }
    if (persona === 'returnship') {
      return lastRole.trim() !== '' && breakDuration !== '' && breakReason !== '' && returnType !== '';
    }
    return false;
  };

  const isValid = validateForm();

  // --- Course checkbox helper ---
  const handleCourseCheckbox = (course) => {
    if (studentCourses.includes(course)) {
      setStudentCourses(studentCourses.filter((c) => c !== course));
    } else {
      setStudentCourses([...studentCourses, course]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);

    let specificData = {};
    if (persona === 'student') {
      specificData = {
        studentYear,
        hasInternship,
        internshipDetails: hasInternship ? internshipDetails : '',
        studentCourses,
        studentConfidence,
        studentBlocker,
      };
    } else if (persona === 'fresher') {
      specificData = {
        gradYear,
        fresherJobOffers,
        fresherAppliedCount,
        fresherSkills,
        fresherBlocker,
      };
    } else if (persona === 'professional') {
      specificData = {
        currentRole,
        yearsExperience: Number(yearsExperience),
        professionalReason,
        professionalSkills,
        skillGap,
      };
    } else if (persona === 'returnship') {
      specificData = {
        lastRole,
        breakDuration,
        breakReason,
        returnshipConfidence,
        returnType,
      };
    }

    const finalCollectedData = {
      ...onboardingData,
      specificData,
      signupCompletedAt: new Date().toISOString(),
    };

    // Print to console as requested
    console.log('--- FINAL COLLECTED ONBOARDING DATA ---');
    console.log(finalCollectedData);
    console.log('---------------------------------------');

    // TODO: Wire up actual signup API submit here.
    // Example:
    // try {
    //   const response = await fetch('/api/auth/onboard', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(finalCollectedData)
    //   });
    //   if (!response.ok) throw new Error('Failed to save profile');
    // } catch (err) {
    //   console.error(err);
    // }

    setTimeout(() => {
      // Mock session saving
      const session = { email: onboardingData.email || 'new_user@hernova.com', token: 'mock-jwt-token-onboarding-456' };
      localStorage.setItem('user_session', JSON.stringify(session));

      // Save user to simulated DB to allow login later
      let registeredUsers = [];
      try {
        const stored = localStorage.getItem('hernova_registered_users');
        if (stored) registeredUsers = JSON.parse(stored);
      } catch (err) {}
      
      // Register only if they have credentials in state
      if (onboardingData.email && onboardingData.password) {
        registeredUsers.push({
          email: onboardingData.email,
          password: onboardingData.password,
          fullName: onboardingData.fullName,
        });
        localStorage.setItem('hernova_registered_users', JSON.stringify(registeredUsers));
      }

      setIsSubmitting(false);
      onSubmit(finalCollectedData);
    }, 1500);
  };

  return (
    <div className="glass-panel w-full max-w-[540px] rounded-[24px] p-8 animate-fade-up relative overflow-hidden flex flex-col">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-label-sm text-label-sm"
        id="specific-back-btn"
        disabled={isSubmitting}
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Back
      </button>

      <div className="text-center mt-6 mb-6">
        <h2 className="font-serif text-[28px] font-semibold text-on-surface mb-2">Additional Details</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Help us customize your path as a <span className="font-bold text-primary capitalize">{persona}</span>.</p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-5 flex-grow">
        {/* ================= STUDENT QUESTIONS ================= */}
        {persona === 'student' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="studentYear">Current Year of Study</label>
              <select
                className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23534551\'%3E%3Cpath d=\'M7 10l5 5 5-5H7z\'/%3E%3C/svg%3E")', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
                id="studentYear"
                value={studentYear}
                onChange={(e) => setStudentYear(e.target.value)}
                required
              >
                <option value="" disabled>Select current year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Completed any internships?</span>
                <button
                  type="button"
                  onClick={() => setHasInternship(!hasInternship)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${hasInternship ? 'bg-primary' : 'bg-glass-border'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${hasInternship ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {hasInternship && (
                <div className="animate-fade-up">
                  <input
                    className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50"
                    placeholder="Role & duration (e.g. Web Dev Intern, 3 months)"
                    type="text"
                    value={internshipDetails}
                    onChange={(e) => setInternshipDetails(e.target.value)}
                    required={hasInternship}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <span className="block font-label-sm text-label-sm text-on-surface-variant ml-1">Online courses completed</span>
              <div className="grid grid-cols-2 gap-2 p-3 bg-glass-overlay rounded-[16px] border border-glass-border">
                {['NPTEL', 'Coursera', 'Udemy', 'Other', 'None'].map((course) => (
                  <label key={course} className="flex items-center gap-2 cursor-pointer p-1">
                    <input
                      type="checkbox"
                      checked={studentCourses.includes(course)}
                      onChange={() => handleCourseCheckbox(course)}
                      className="accent-primary w-4 h-4 rounded border-glass-border focus:ring-0"
                    />
                    <span className="font-body-md text-sm text-on-surface">{course}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Confidence in core skills for target role</span>
                <span className="font-headline-md text-sm font-bold text-primary">{studentConfidence} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={studentConfidence}
                onChange={(e) => setStudentConfidence(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-glass-border rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-on-surface-variant/60 px-1">
                <span>Beginner</span>
                <span>Advanced</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="block font-label-sm text-label-sm text-on-surface-variant ml-1">Biggest current blocker</span>
              <div className="space-y-2">
                {[
                  "Don't know what skills to learn",
                  "No projects/portfolio",
                  "Don't know how interviews work",
                  "Lack of guidance",
                ].map((blocker) => (
                  <label key={blocker} className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 border border-glass-border cursor-pointer hover:bg-glass-overlay/30 transition-colors">
                    <input
                      type="radio"
                      name="studentBlocker"
                      value={blocker}
                      checked={studentBlocker === blocker}
                      onChange={(e) => setStudentBlocker(e.target.value)}
                      className="accent-primary w-4 h-4"
                      required
                    />
                    <span className="font-body-md text-xs text-on-surface">{blocker}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= FRESHER QUESTIONS ================= */}
        {persona === 'fresher' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="gradYear">Graduation Year</label>
              <select
                className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23534551\'%3E%3Cpath d=\'M7 10l5 5 5-5H7z\'/%3E%3C/svg%3E")', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
                id="gradYear"
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                required
              >
                <option value="" disabled>Select graduation year</option>
                <option value="2027">2027 (Expected)</option>
                <option value="2026">2026 (Current Year)</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">Before 2022</option>
              </select>
            </div>

            <div className="flex items-center justify-between ml-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Any job offers so far?</span>
              <button
                type="button"
                onClick={() => setFresherJobOffers(!fresherJobOffers)}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${fresherJobOffers ? 'bg-primary' : 'bg-glass-border'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${fresherJobOffers ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="fresherAppliedCount">Number of jobs applied to</label>
              <select
                className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23534551\'%3E%3Cpath d=\'M7 10l5 5 5-5H7z\'/%3E%3C/svg%3E")', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
                id="fresherAppliedCount"
                value={fresherAppliedCount}
                onChange={(e) => setFresherAppliedCount(e.target.value)}
                required
              >
                <option value="" disabled>Select range</option>
                <option value="0–10">0–10</option>
                <option value="10–50">10–50</option>
                <option value="50+">50+</option>
              </select>
            </div>

            {/* Skills confident in (Tag Input) */}
            <div className="space-y-2">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="fresherSkillInput">
                Skills you are most confident in <span className="text-primary font-bold">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  className="glass-input flex-1 h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50"
                  id="fresherSkillInput"
                  placeholder="Type a skill and press Enter"
                  value={fresherSkillInput}
                  onChange={(e) => setFresherSkillInput(e.target.value)}
                  onKeyDown={addFresherSkill}
                />
                <button
                  type="button"
                  onClick={addFresherSkill}
                  className="px-4 bg-primary text-white rounded-[14px] font-label-sm text-sm hover:opacity-90 active:scale-95 transition-all"
                >
                  Add
                </button>
              </div>

              {fresherSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-2 bg-glass-overlay rounded-[14px] border border-glass-border">
                  {fresherSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeFresherSkill(skill)}
                        className="text-primary/70 hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[14px] font-bold">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-primary italic ml-1">Please add at least 1 skill to proceed.</p>
              )}
            </div>

            <div className="space-y-2">
              <span className="block font-label-sm text-label-sm text-on-surface-variant ml-1">Biggest current blocker</span>
              <div className="space-y-2">
                {[
                  "Don't know what skills to learn",
                  "No projects/portfolio",
                  "Don't know how interviews work",
                  "Lack of guidance",
                ].map((blocker) => (
                  <label key={blocker} className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 border border-glass-border cursor-pointer hover:bg-glass-overlay/30 transition-colors">
                    <input
                      type="radio"
                      name="fresherBlocker"
                      value={blocker}
                      checked={fresherBlocker === blocker}
                      onChange={(e) => setFresherBlocker(e.target.value)}
                      className="accent-primary w-4 h-4"
                      required
                    />
                    <span className="font-body-md text-xs text-on-surface">{blocker}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= WORKING PROFESSIONAL QUESTIONS ================= */}
        {persona === 'professional' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="currentRole">Current Role / Title</label>
              <input
                className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50"
                id="currentRole"
                placeholder="e.g. Software Engineer"
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="yearsExperience">Years of Total Experience</label>
              <input
                className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50"
                id="yearsExperience"
                placeholder="e.g. 3"
                type="number"
                min="0"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <span className="block font-label-sm text-label-sm text-on-surface-variant ml-1">Reason for using platform</span>
              <div className="space-y-2">
                {[
                  "Want to switch roles",
                  "Want a promotion/skill up",
                  "Exploring new domain",
                  "Just exploring",
                ].map((reason) => (
                  <label key={reason} className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 border border-glass-border cursor-pointer hover:bg-glass-overlay/30 transition-colors">
                    <input
                      type="radio"
                      name="professionalReason"
                      value={reason}
                      checked={professionalReason === reason}
                      onChange={(e) => setProfessionalReason(e.target.value)}
                      className="accent-primary w-4 h-4"
                      required
                    />
                    <span className="font-body-md text-xs text-on-surface">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Current skill stack (Tag Input) */}
            <div className="space-y-2">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="professionalSkillInput">
                Current Tech / Skill Stack <span className="text-primary font-bold">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  className="glass-input flex-1 h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50"
                  id="professionalSkillInput"
                  placeholder="Type a skill (e.g. React) and press Enter"
                  value={professionalSkillInput}
                  onChange={(e) => setProfessionalSkillInput(e.target.value)}
                  onKeyDown={addProfessionalSkill}
                />
                <button
                  type="button"
                  onClick={addProfessionalSkill}
                  className="px-4 bg-primary text-white rounded-[14px] font-label-sm text-sm hover:opacity-90 active:scale-95 transition-all"
                >
                  Add
                </button>
              </div>

              {professionalSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-2 bg-glass-overlay rounded-[14px] border border-glass-border">
                  {professionalSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeProfessionalSkill(skill)}
                        className="text-primary/70 hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[14px] font-bold">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-primary italic ml-1">Please add at least 1 skill to proceed.</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="skillGap">What skill gap do you feel behind on?</label>
              <input
                className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50"
                id="skillGap"
                placeholder="e.g. System Design, Cloud Architecture"
                type="text"
                value={skillGap}
                onChange={(e) => setSkillGap(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* ================= RETURNSHIP QUESTIONS ================= */}
        {persona === 'returnship' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="lastRole">Last Role before the break</label>
              <input
                className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50"
                id="lastRole"
                placeholder="e.g. HR Manager"
                type="text"
                value={lastRole}
                onChange={(e) => setLastRole(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="breakDuration">Duration of break</label>
              <select
                className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23534551\'%3E%3Cpath d=\'M7 10l5 5 5-5H7z\'/%3E%3C/svg%3E")', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
                id="breakDuration"
                value={breakDuration}
                onChange={(e) => setBreakDuration(e.target.value)}
                required
              >
                <option value="" disabled>Select break duration</option>
                <option value="<1 year">Less than 1 year</option>
                <option value="1–2 years">1–2 years</option>
                <option value="2–5 years">2–5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>

            <div className="space-y-2">
              <span className="block font-label-sm text-label-sm text-on-surface-variant ml-1">Reason for break</span>
              <div className="space-y-2">
                {[
                  "Caregiving/family",
                  "Health",
                  "Personal/relocation",
                  "Prefer not to say",
                ].map((reason) => (
                  <label key={reason} className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 border border-glass-border cursor-pointer hover:bg-glass-overlay/30 transition-colors">
                    <input
                      type="radio"
                      name="breakReason"
                      value={reason}
                      checked={breakReason === reason}
                      onChange={(e) => setBreakReason(e.target.value)}
                      className="accent-primary w-4 h-4"
                      required
                    />
                    <span className="font-body-md text-xs text-on-surface">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Confidence in previous skill set today</span>
                <span className="font-headline-md text-sm font-bold text-primary">{returnshipConfidence} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={returnshipConfidence}
                onChange={(e) => setReturnshipConfidence(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-glass-border rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-on-surface-variant/60 px-1">
                <span>Low Confidence</span>
                <span>Fully Ready</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="block font-label-sm text-label-sm text-on-surface-variant ml-1">What kind of return are you looking for?</span>
              <div className="space-y-2">
                {[
                  "Same role",
                  "Similar domain, refreshed skills",
                  "Complete pivot",
                ].map((rt) => (
                  <label key={rt} className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 border border-glass-border cursor-pointer hover:bg-glass-overlay/30 transition-colors">
                    <input
                      type="radio"
                      name="returnType"
                      value={rt}
                      checked={returnType === rt}
                      onChange={(e) => setReturnType(e.target.value)}
                      className="accent-primary w-4 h-4"
                      required
                    />
                    <span className="font-body-md text-xs text-on-surface">{rt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 h-12 gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="text-on-surface-variant hover:text-primary font-body-md text-sm font-semibold transition-colors"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`px-8 h-full rounded-[14px] font-headline-md text-body-md font-bold flex items-center justify-center gap-2 transition-all ${
              isValid && !isSubmitting
                ? 'bg-[#FFB300] hover:bg-[#FFB300]/90 text-[#320047] shadow-md hover:scale-[1.02]' 
                : 'bg-glass-overlay text-on-surface-variant/40 border border-glass-border cursor-not-allowed'
            }`}
            id="specific-submit-btn"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-[#320047] border-t-transparent rounded-full animate-spin"></span>
                <span>Saving profile...</span>
              </div>
            ) : (
              <>
                Submit & Complete
                <span className="material-symbols-outlined text-[20px]">check</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
