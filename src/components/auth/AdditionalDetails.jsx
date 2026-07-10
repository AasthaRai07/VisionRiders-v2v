'use client';

import { useState } from 'react';

export default function AdditionalDetails({ onBack, onSubmit, onboardingData }) {
  const persona = onboardingData.persona;

  // --- Student State ---
  const [studentYear, setStudentYear] = useState('');
  const [hasInternship, setHasInternship] = useState(false);
  const [internshipDetails, setInternshipDetails] = useState('');
  const [studentCourses, setStudentCourses] = useState([]);
  const [studentConfidence, setStudentConfidence] = useState(3);
  const [studentBlocker, setStudentBlocker] = useState('');
  const [studentBlockerOther, setStudentBlockerOther] = useState('');
  const [otherCourseName, setOtherCourseName] = useState('');

  // --- Fresher State ---
  const [gradYear, setGradYear] = useState('');
  const [fresherJobOffers, setFresherJobOffers] = useState(false);
  const [fresherAppliedCount, setFresherAppliedCount] = useState('');
  const [fresherSkills, setFresherSkills] = useState([]);
  const [fresherSkillInput, setFresherSkillInput] = useState('');
  const [fresherBlocker, setFresherBlocker] = useState('');
  const [fresherBlockerOther, setFresherBlockerOther] = useState('');

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

  // --- Shared states ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Touched state tracker
  const [touched, setTouched] = useState({});

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

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

  // --- Validation Helpers ---
  const isFieldValid = (field) => {
    if (persona === 'student') {
      if (field === 'studentYear') return studentYear !== '';
      if (field === 'internshipDetails') return !hasInternship || internshipDetails.trim().length >= 2;
      if (field === 'studentBlocker') return studentBlocker !== '';
    }
    if (persona === 'fresher') {
      if (field === 'gradYear') return gradYear !== '';
      if (field === 'fresherAppliedCount') return fresherAppliedCount !== '';
      if (field === 'fresherSkills') return fresherSkills.length > 0;
      if (field === 'fresherBlocker') return fresherBlocker !== '';
    }
    if (persona === 'professional') {
      if (field === 'currentRole') return currentRole.trim().length >= 2;
      if (field === 'yearsExperience') return yearsExperience !== '' && Number(yearsExperience) >= 0;
      if (field === 'professionalReason') return professionalReason !== '';
      if (field === 'professionalSkills') return professionalSkills.length > 0;
      if (field === 'skillGap') return skillGap.trim().length >= 2;
    }
    if (persona === 'returnship') {
      if (field === 'lastRole') return lastRole.trim().length >= 2;
      if (field === 'breakDuration') return breakDuration !== '';
      if (field === 'breakReason') return breakReason !== '';
      if (field === 'returnType') return returnType !== '';
    }
    return true;
  };

  // General Form validity
  const validateForm = () => {
    if (persona === 'student') {
      return isFieldValid('studentYear') && isFieldValid('internshipDetails') && isFieldValid('studentBlocker');
    }
    if (persona === 'fresher') {
      return isFieldValid('gradYear') && isFieldValid('fresherAppliedCount') && isFieldValid('fresherSkills') && isFieldValid('fresherBlocker');
    }
    if (persona === 'professional') {
      return isFieldValid('currentRole') && isFieldValid('yearsExperience') && isFieldValid('professionalReason') && isFieldValid('professionalSkills') && isFieldValid('skillGap');
    }
    if (persona === 'returnship') {
      return isFieldValid('lastRole') && isFieldValid('breakDuration') && isFieldValid('breakReason') && isFieldValid('returnType');
    }
    return false;
  };

  const isFormValid = validateForm();

  // Course checkbox helper
  const handleCourseCheckbox = (course) => {
    if (studentCourses.includes(course)) {
      setStudentCourses(studentCourses.filter((c) => c !== course));
      // Clear the "Other" course text input when unchecking "Other"
      if (course === 'Other') {
        setOtherCourseName('');
      }
    } else {
      setStudentCourses([...studentCourses, course]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isFormValid) {
      // Set all fields to touched so errors show up
      const allTouched = {};
      if (persona === 'student') {
        allTouched.studentYear = true;
        allTouched.internshipDetails = true;
        allTouched.studentBlocker = true;
      } else if (persona === 'fresher') {
        allTouched.gradYear = true;
        allTouched.fresherAppliedCount = true;
        allTouched.fresherBlocker = true;
      } else if (persona === 'professional') {
        allTouched.currentRole = true;
        allTouched.yearsExperience = true;
        allTouched.professionalReason = true;
        allTouched.skillGap = true;
      } else if (persona === 'returnship') {
        allTouched.lastRole = true;
        allTouched.breakDuration = true;
        allTouched.breakReason = true;
        allTouched.returnType = true;
      }
      setTouched(allTouched);
      return;
    }

    setIsSubmitting(true);

    let specificData = {};
    if (persona === 'student') {
      specificData = {
        studentYear,
        hasInternship,
        internshipDetails: hasInternship ? internshipDetails : '',
        studentCourses,
        otherCourseName: studentCourses.includes('Other') ? otherCourseName : '',
        studentConfidence,
        studentBlocker,
        blockerOther: studentBlocker === 'Other' ? studentBlockerOther : '',
      };
    } else if (persona === 'fresher') {
      specificData = {
        gradYear,
        fresherJobOffers,
        fresherAppliedCount,
        fresherSkills,
        fresherBlocker,
        blockerOther: fresherBlocker === 'Other' ? fresherBlockerOther : '',
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

    console.log('--- FINAL ONBOARDING DATA SUBMITTED ---');
    console.log(finalCollectedData);

    // Extract skills prioritizing resume-extracted skills if available
    let extractedSkills = [];
    if (onboardingData.resumeSkills && onboardingData.resumeSkills.length > 0) {
      extractedSkills = onboardingData.resumeSkills;
    } else if (onboardingData.persona === 'professional' && specificData.professionalSkills) {
      extractedSkills = specificData.professionalSkills;
    } else if (onboardingData.persona === 'fresher' && specificData.fresherSkills) {
      extractedSkills = specificData.fresherSkills;
    } else if (onboardingData.persona === 'student' && specificData.studentCourses) {
      extractedSkills = specificData.studentCourses;
    }

    setTimeout(() => {
      // Mock session saving
      const session = { 
        email: onboardingData.email || 'google_user@hernova.com', 
        token: 'mock-jwt-token-onboarding-456',
        fullName: onboardingData.fullName || 'Google User',
        persona: onboardingData.persona || 'returnship',
        skills: extractedSkills.length > 0 ? extractedSkills : ['React', 'JavaScript', 'Node.js'],
        resumeText: onboardingData.resumeText || '',
        atsScore: onboardingData.atsScore || null
      };
      localStorage.setItem('user_session', JSON.stringify(session));
      localStorage.setItem('hernova_user_profile', JSON.stringify(finalCollectedData));
      if (session.email) {
        localStorage.setItem(`hernova_user_profile_${session.email.toLowerCase()}`, JSON.stringify(finalCollectedData));
      }

      // Save user to simulated DB to allow login later (only if email & password present)
      if (onboardingData.email && onboardingData.password && onboardingData.password !== 'google-oauth-authenticated') {
        let registeredUsers = [];
        try {
          const stored = localStorage.getItem('hernova_registered_users');
          if (stored) registeredUsers = JSON.parse(stored);
        } catch (err) {}
        
        registeredUsers.push({
          email: onboardingData.email,
          password: onboardingData.password,
          fullName: onboardingData.fullName,
          persona: onboardingData.persona || 'returnship',
          skills: extractedSkills.length > 0 ? extractedSkills : ['React', 'JavaScript', 'Node.js'],
          resumeText: onboardingData.resumeText || '',
          atsScore: onboardingData.atsScore || null
        });
        localStorage.setItem('hernova_registered_users', JSON.stringify(registeredUsers));
      }

      setIsSubmitting(false);
      onSubmit(finalCollectedData);
    }, 1500);
  };

  const showError = (field) => {
    return (touched[field] || submitAttempted) && !isFieldValid(field);
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
            {/* Year dropdown */}
            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="studentYear">Current Year of Study</label>
              <div className="relative">
                <select
                  className={`glass-input w-full h-12 px-4 pr-10 rounded-[14px] font-body-md text-on-surface appearance-none bg-white ${
                    showError('studentYear') ? 'border-rose-500' : ''
                  }`}
                  id="studentYear"
                  value={studentYear}
                  onChange={(e) => setStudentYear(e.target.value)}
                  onBlur={() => handleBlur('studentYear')}
                  required
                >
                  <option value="" disabled>Select current year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="Final Year">Final Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
              {showError('studentYear') && (
                <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">This field is required</p>
              )}
            </div>

            {/* Internship toggle */}
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
                <div className="animate-fade-up space-y-1">
                  <input
                    className={`glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50 ${
                      showError('internshipDetails') ? 'border-rose-500' : ''
                    }`}
                    placeholder="Role & duration (e.g. Web Dev Intern, 3 months)"
                    type="text"
                    value={internshipDetails}
                    onChange={(e) => setInternshipDetails(e.target.value)}
                    onBlur={() => handleBlur('internshipDetails')}
                    required={hasInternship}
                  />
                  {showError('internshipDetails') && (
                    <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">Please enter your internship details</p>
                  )}
                </div>
              )}
            </div>

            {/* Courses Completed */}
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
              {/* Conditional text input when "Other" is checked */}
              {studentCourses.includes('Other') && (
                <div className="animate-fade-up mt-2">
                  <input
                    className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50"
                    placeholder="Which course/certificate?"
                    type="text"
                    value={otherCourseName}
                    onChange={(e) => setOtherCourseName(e.target.value)}
                    id="other-course-name"
                  />
                </div>
              )}
            </div>

            {/* Skill Confidence Slider */}
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

            {/* Blocker Radio Selection */}
            <div className="space-y-2">
              <span className="block font-label-sm text-label-sm text-on-surface-variant ml-1">Biggest current blocker</span>
              <div className="space-y-2">
                {[
                  "Don't know what skills to learn",
                  "No projects/portfolio",
                  "Don't know how interviews work",
                  "Lack of guidance",
                  "Other",
                ].map((blocker) => (
                  <label key={blocker} className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 border border-glass-border cursor-pointer hover:bg-glass-overlay/30 transition-colors">
                    <input
                      type="radio"
                      name="studentBlocker"
                      value={blocker}
                      checked={studentBlocker === blocker}
                      onChange={(e) => {
                        setStudentBlocker(e.target.value);
                        if (e.target.value !== 'Other') setStudentBlockerOther('');
                      }}
                      className="accent-primary w-4 h-4"
                      required
                    />
                    <span className="font-body-md text-xs text-on-surface">{blocker}</span>
                  </label>
                ))}
              </div>
              {/* Conditional text input when "Other" is selected */}
              {studentBlocker === 'Other' && (
                <div className="animate-fade-up mt-1">
                  <input
                    className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50"
                    placeholder="Tell us more..."
                    type="text"
                    value={studentBlockerOther}
                    onChange={(e) => setStudentBlockerOther(e.target.value)}
                    id="student-blocker-other"
                  />
                </div>
              )}
              {showError('studentBlocker') && (
                <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">This field is required</p>
              )}
            </div>
          </div>
        )}

        {/* ================= FRESHER QUESTIONS ================= */}
        {persona === 'fresher' && (
          <div className="space-y-4">
            {/* Graduation year */}
            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="gradYear">Graduation Year</label>
              <div className="relative">
                <select
                  className={`glass-input w-full h-12 px-4 pr-10 rounded-[14px] font-body-md text-on-surface appearance-none bg-white ${
                    showError('gradYear') ? 'border-rose-500' : ''
                  }`}
                  id="gradYear"
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  onBlur={() => handleBlur('gradYear')}
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
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
              {showError('gradYear') && (
                <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">This field is required</p>
              )}
            </div>

            {/* Job offers toggle */}
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

            {/* Number of jobs applied */}
            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="fresherAppliedCount">Number of jobs applied to</label>
              <div className="relative">
                <select
                  className={`glass-input w-full h-12 px-4 pr-10 rounded-[14px] font-body-md text-on-surface appearance-none bg-white ${
                    showError('fresherAppliedCount') ? 'border-rose-500' : ''
                  }`}
                  id="fresherAppliedCount"
                  value={fresherAppliedCount}
                  onChange={(e) => setFresherAppliedCount(e.target.value)}
                  onBlur={() => handleBlur('fresherAppliedCount')}
                  required
                >
                  <option value="" disabled>Select range</option>
                  <option value="0–10">0–10</option>
                  <option value="10–50">10–50</option>
                  <option value="50+">50+</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
              {showError('fresherAppliedCount') && (
                <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">This field is required</p>
              )}
            </div>

            {/* Skills tag input */}
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
                <p className="text-[11px] text-rose-600 italic ml-1">Please add at least 1 skill to proceed.</p>
              )}
            </div>

            {/* Blocker radio */}
            <div className="space-y-2">
              <span className="block font-label-sm text-label-sm text-on-surface-variant ml-1">Biggest current blocker</span>
              <div className="space-y-2">
                {[
                  "Don't know what skills to learn",
                  "No projects/portfolio",
                  "Don't know how interviews work",
                  "Lack of guidance",
                  "Other",
                ].map((blocker) => (
                  <label key={blocker} className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 border border-glass-border cursor-pointer hover:bg-glass-overlay/30 transition-colors">
                    <input
                      type="radio"
                      name="fresherBlocker"
                      value={blocker}
                      checked={fresherBlocker === blocker}
                      onChange={(e) => {
                        setFresherBlocker(e.target.value);
                        if (e.target.value !== 'Other') setFresherBlockerOther('');
                      }}
                      className="accent-primary w-4 h-4"
                      required
                    />
                    <span className="font-body-md text-xs text-on-surface">{blocker}</span>
                  </label>
                ))}
              </div>
              {/* Conditional text input when "Other" is selected */}
              {fresherBlocker === 'Other' && (
                <div className="animate-fade-up mt-1">
                  <input
                    className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50"
                    placeholder="Tell us more..."
                    type="text"
                    value={fresherBlockerOther}
                    onChange={(e) => setFresherBlockerOther(e.target.value)}
                    id="fresher-blocker-other"
                  />
                </div>
              )}
              {showError('fresherBlocker') && (
                <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">This field is required</p>
              )}
            </div>
          </div>
        )}

        {/* ================= WORKING PROFESSIONAL QUESTIONS ================= */}
        {persona === 'professional' && (
          <div className="space-y-4">
            {/* Current role */}
            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="currentRole">Current Role / Title</label>
              <input
                className={`glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50 ${
                  showError('currentRole') ? 'border-rose-500' : ''
                }`}
                id="currentRole"
                placeholder="e.g. Software Engineer"
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                onBlur={() => handleBlur('currentRole')}
                required
              />
              {showError('currentRole') && (
                <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">Please enter your current role</p>
              )}
            </div>

            {/* Experience */}
            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="yearsExperience">Years of Total Experience</label>
              <input
                className={`glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50 ${
                  showError('yearsExperience') ? 'border-rose-500' : ''
                }`}
                id="yearsExperience"
                placeholder="e.g. 3"
                type="number"
                min="0"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                onBlur={() => handleBlur('yearsExperience')}
                required
              />
              {showError('yearsExperience') && (
                <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">Experience must be 0 or greater</p>
              )}
            </div>

            {/* Reason radio */}
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
              {showError('professionalReason') && (
                <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">This field is required</p>
              )}
            </div>

            {/* Current skill stack */}
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
                <p className="text-[11px] text-rose-600 italic ml-1">Please add at least 1 skill to proceed.</p>
              )}
            </div>

            {/* Skill gap */}
            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="skillGap">What skill gap do you feel behind on?</label>
              <input
                className={`glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50 ${
                  showError('skillGap') ? 'border-rose-500' : ''
                }`}
                id="skillGap"
                placeholder="e.g. System Design, Cloud Architecture"
                type="text"
                value={skillGap}
                onChange={(e) => setSkillGap(e.target.value)}
                onBlur={() => handleBlur('skillGap')}
                required
              />
              {showError('skillGap') && (
                <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">Please describe your skill gap</p>
              )}
            </div>
          </div>
        )}

        {/* ================= RETURNSHIP QUESTIONS ================= */}
        {persona === 'returnship' && (
          <div className="space-y-4">
            {/* Last role */}
            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="lastRole">Last Role before the break</label>
              <input
                className={`glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50 ${
                  showError('lastRole') ? 'border-rose-500' : ''
                }`}
                id="lastRole"
                placeholder="e.g. HR Manager"
                type="text"
                value={lastRole}
                onChange={(e) => setLastRole(e.target.value)}
                onBlur={() => handleBlur('lastRole')}
                required
              />
              {showError('lastRole') && (
                <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">Please enter your last role before the break</p>
              )}
            </div>

            {/* Break duration */}
            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="breakDuration">Duration of break</label>
              <div className="relative">
                <select
                  className={`glass-input w-full h-12 px-4 pr-10 rounded-[14px] font-body-md text-on-surface appearance-none bg-white ${
                    showError('breakDuration') ? 'border-rose-500' : ''
                  }`}
                  id="breakDuration"
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(e.target.value)}
                  onBlur={() => handleBlur('breakDuration')}
                  required
                >
                  <option value="" disabled>Select break duration</option>
                  <option value="<1 year">Less than 1 year</option>
                  <option value="1–2 years">1–2 years</option>
                  <option value="2–5 years">2–5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
              {showError('breakDuration') && (
                <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">This field is required</p>
              )}
            </div>

            {/* Break reason */}
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
              {showError('breakReason') && (
                <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">This field is required</p>
              )}
            </div>

            {/* Confidence level slider */}
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

            {/* Return type radio */}
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
              {showError('returnType') && (
                <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">This field is required</p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="btn-glass px-8 py-3.5 rounded-[14px] text-[17px] font-semibold text-on-surface-variant flex items-center justify-center transition-all disabled:opacity-50"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`px-10 py-3.5 rounded-[14px] text-[17px] font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 ${
              isFormValid && !isSubmitting
                ? 'bg-gradient-to-r from-[#D4537E] to-[#993556] text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-[#D4537E]/30 shadow-md active:scale-[0.98]' 
                : 'bg-glass-overlay text-on-surface-variant/30 border border-glass-border opacity-50 cursor-not-allowed'
            }`}
            id="specific-submit-btn"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving profile...</span>
              </div>
            ) : (
              <>
                Submit & Complete
                <span className="material-symbols-outlined text-[22px] text-white">check</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
