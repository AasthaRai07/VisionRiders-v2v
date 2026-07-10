'use client';

import { useState, useEffect } from 'react';

export default function UniversalQuestions({ onBack, onContinue, onboardingData }) {
  const [fullName, setFullName] = useState(onboardingData.fullName || '');
  const [email, setEmail] = useState(onboardingData.email || '');
  const [password, setPassword] = useState(onboardingData.password || '');
  const [ageRange, setAgeRange] = useState(onboardingData.ageRange || '');
  const [educationLevel, setEducationLevel] = useState(onboardingData.educationLevel || '');
  const [domain, setDomain] = useState(onboardingData.domain || '');
  const [targetRole, setTargetRole] = useState(onboardingData.targetRole || '');

  // Pre-fill values if a resume was uploaded and form is empty
  useEffect(() => {
    if (onboardingData.resumeUploaded && !onboardingData.fullName) {
      setFullName('Jane Doe');
      setAgeRange('23–28');
      setEducationLevel("Bachelor's");
      setDomain('CS/IT');
      setTargetRole('Software Developer');
    }
  }, [onboardingData.resumeUploaded]);

  const isValid = 
    fullName.trim() !== '' && 
    email.trim() !== '' && 
    email.includes('@') &&
    password.length >= 6 && 
    ageRange !== '' && 
    educationLevel !== '' && 
    domain !== '' && 
    targetRole !== '';

  const handleNext = (e) => {
    e.preventDefault();
    if (isValid) {
      onContinue({
        fullName,
        email,
        password,
        ageRange,
        educationLevel,
        domain,
        targetRole,
      });
    }
  };

  return (
    <div className="glass-panel w-full max-w-[540px] rounded-[24px] p-8 animate-fade-up relative overflow-hidden flex flex-col">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-label-sm text-label-sm"
        id="universal-back-btn"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Back
      </button>

      <div className="text-center mt-6 mb-6">
        <h2 className="font-serif text-[28px] font-semibold text-on-surface mb-2">Create Account & Profile</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Set up your credentials and tell us a bit about your background.</p>
        
        {onboardingData.resumeUploaded && (
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFB300]/10 border border-[#FFB300]/30 text-[#825b00] text-xs font-semibold animate-pulse">
            <span className="material-symbols-outlined text-xs">auto_awesome</span>
            Auto-filled from resume — please confirm
          </div>
        )}
      </div>

      <form onSubmit={handleNext} className="space-y-4 flex-grow">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="fullName">Full Name</label>
          <input 
            className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50" 
            id="fullName" 
            placeholder="Jane Doe" 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required 
          />
        </div>

        {/* Email and Password Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="signup-email">Email Address</label>
            <input 
              className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50" 
              id="signup-email" 
              placeholder="hello@example.com" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="signup-password">Password (min. 6 chars)</label>
            <input 
              className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50" 
              id="signup-password" 
              placeholder="••••••••" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
        </div>

        {/* Age Range and Highest Education Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="ageRange">Age Range</label>
            <select 
              className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50 appearance-none bg-no-repeat" 
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23534551\'%3E%3Cpath d=\'M7 10l5 5 5-5H7z\'/%3E%3C/svg%3E")', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
              id="ageRange" 
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              required
            >
              <option value="" disabled>Select age range</option>
              <option value="18–22">18–22</option>
              <option value="23–28">23–28</option>
              <option value="29–35">29–35</option>
              <option value="36+">36+</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="educationLevel">Highest Education</label>
            <select 
              className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50 appearance-none" 
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23534551\'%3E%3Cpath d=\'M7 10l5 5 5-5H7z\'/%3E%3C/svg%3E")', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
              id="educationLevel" 
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              required
            >
              <option value="" disabled>Select education</option>
              <option value="High School">High School</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="PhD">PhD</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Field of Study and Target Role Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="domain">Field of Study / Domain</label>
            <select 
              className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50 appearance-none" 
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23534551\'%3E%3Cpath d=\'M7 10l5 5 5-5H7z\'/%3E%3C/svg%3E")', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
              id="domain" 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            >
              <option value="" disabled>Select field of study</option>
              <option value="CS/IT">CS/IT</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Data/Analytics">Data/Analytics</option>
              <option value="Design">Design</option>
              <option value="Business/Finance">Business/Finance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="targetRole">Target Role of Interest</label>
            <select 
              className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50 appearance-none" 
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23534551\'%3E%3Cpath d=\'M7 10l5 5 5-5H7z\'/%3E%3C/svg%3E")', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
              id="targetRole" 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              required
            >
              <option value="" disabled>Select target role</option>
              <option value="Software Developer">Software Developer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Mechanical Engineer">Mechanical Engineer</option>
              <option value="Electrical/Embedded Engineer">Electrical/Embedded Engineer</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={!isValid}
            className={`px-8 h-12 rounded-[14px] font-headline-md text-body-md font-semibold flex items-center justify-center gap-2 transition-all ${
              isValid 
                ? 'btn-primary shadow-md hover:scale-[1.02]' 
                : 'bg-glass-overlay text-on-surface-variant/40 border border-glass-border cursor-not-allowed'
            }`}
            id="universal-continue-btn"
          >
            Continue
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </form>
    </div>
  );
}
