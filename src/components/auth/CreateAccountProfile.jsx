'use client';

import { useState, useEffect } from 'react';

export default function CreateAccountProfile({ onBack, onContinue, onboardingData }) {
  const isGoogle = !!onboardingData.isGoogleAuth;

  // Form states
  const [fullName, setFullName] = useState(onboardingData.fullName || '');
  const [email, setEmail] = useState(onboardingData.email || '');
  const [password, setPassword] = useState(onboardingData.password || '');
  const [ageRange, setAgeRange] = useState(onboardingData.ageRange || '');
  const [educationLevel, setEducationLevel] = useState(onboardingData.educationLevel || '');
  const [domain, setDomain] = useState(onboardingData.domain || '');
  const [targetRole, setTargetRole] = useState(onboardingData.targetRole || '');

  // Touched states for blur validation
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    ageRange: false,
    educationLevel: false,
    domain: false,
    targetRole: false,
  });

  // Validation errors
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    ageRange: '',
    educationLevel: '',
    domain: '',
    targetRole: '',
  });

  // Pre-fill values if a resume was uploaded
  useEffect(() => {
    if (onboardingData.resumeUploaded && !onboardingData.fullName && !isGoogle) {
      setFullName('Jane Doe');
      setAgeRange('23–28');
      setEducationLevel("Bachelor's");
      setDomain('CS/IT');
      setTargetRole('Software Developer');
    }
  }, [onboardingData.resumeUploaded, isGoogle]);

  // Handle Google user info changes
  useEffect(() => {
    if (isGoogle) {
      if (onboardingData.fullName) setFullName(onboardingData.fullName);
      if (onboardingData.email) setEmail(onboardingData.email);
    }
  }, [isGoogle, onboardingData.fullName, onboardingData.email]);

  // Real-time validations
  const validateField = (field, val) => {
    let errorMsg = '';
    if (field === 'fullName') {
      const trimmed = val.trim();
      if (!trimmed) {
        errorMsg = 'Full Name is required';
      } else if (trimmed.length < 2) {
        errorMsg = 'Name must be at least 2 characters';
      } else if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
        errorMsg = 'Name must contain only letters';
      }
    } else if (field === 'email') {
      if (!val.trim()) {
        errorMsg = 'Email Address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
        errorMsg = 'Please enter a valid email address';
      }
    } else if (field === 'password' && !isGoogle) {
      if (!val) {
        errorMsg = 'Password is required';
      } else if (val.length < 8 || !/[a-zA-Z]/.test(val) || !/[0-9]/.test(val)) {
        errorMsg = 'Password must be at least 8 characters and include a number';
      }
    } else if (['ageRange', 'educationLevel', 'domain', 'targetRole'].includes(field)) {
      if (!val) {
        errorMsg = 'This field is required';
      }
    }
    return errorMsg;
  };

  const handleBlur = (field, val) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleChange = (field, val, setter) => {
    setter(val);
    if (touched[field]) {
      const errorMsg = validateField(field, val);
      setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    }
  };

  // Password strength logic
  const getPasswordStrength = (val) => {
    if (!val) return { label: '', color: 'bg-transparent', textColor: 'text-transparent' };
    const hasLetter = /[a-zA-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);
    
    if (val.length < 8 || !hasLetter || !hasNumber) {
      return { label: 'Weak', color: 'bg-rose-500 w-1/3', textColor: 'text-rose-500' };
    }
    if (val.length >= 10 && hasSpecial && /[A-Z]/.test(val)) {
      return { label: 'Strong', color: 'bg-emerald-500 w-full', textColor: 'text-emerald-500' };
    }
    return { label: 'Medium', color: 'bg-amber-500 w-2/3', textColor: 'text-amber-500' };
  };

  const strength = getPasswordStrength(password);

  // General Form validity
  const isNameValid = fullName.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(fullName.trim());
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = isGoogle || (password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password));
  const isDropdownsValid = ageRange && educationLevel && domain && targetRole;
  const isFormValid = isNameValid && isEmailValid && isPasswordValid && isDropdownsValid;

  const handleNext = (e) => {
    e.preventDefault();

    // Trigger validation for all fields on submit attempt
    const newErrors = {
      fullName: validateField('fullName', fullName),
      email: validateField('email', email),
      password: validateField('password', password),
      ageRange: validateField('ageRange', ageRange),
      educationLevel: validateField('educationLevel', educationLevel),
      domain: validateField('domain', domain),
      targetRole: validateField('targetRole', targetRole),
    };

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      ageRange: true,
      educationLevel: true,
      domain: true,
      targetRole: true,
    });

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((err) => err !== '');

    if (!hasErrors && isFormValid) {
      onContinue({
        fullName,
        email,
        password: isGoogle ? 'google-oauth-authenticated' : password,
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
        
        {onboardingData.resumeUploaded && !isGoogle && (
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFB300]/10 border border-[#FFB300]/30 text-[#825b00] text-xs font-semibold animate-pulse">
            <span className="material-symbols-outlined text-xs">auto_awesome</span>
            Auto-filled from resume — please confirm
          </div>
        )}

        {isGoogle && (
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-semibold">
            <span className="material-symbols-outlined text-xs">verified_user</span>
            Authenticated via Google
          </div>
        )}
      </div>

      <form onSubmit={handleNext} className="space-y-4 flex-grow">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="fullName">Full Name</label>
          <input 
            className={`glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50 ${
              touched.fullName && errors.fullName ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''
            }`} 
            id="fullName" 
            placeholder="Jane Doe" 
            type="text" 
            value={fullName}
            onChange={(e) => handleChange('fullName', e.target.value, setFullName)}
            onBlur={(e) => handleBlur('fullName', e.target.value)}
            required 
            disabled={isGoogle}
          />
          {touched.fullName && errors.fullName && (
            <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email and Password Row */}
        {!isGoogle ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="signup-email">Email Address</label>
              <input 
                className={`glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50 ${
                  touched.email && errors.email ? 'border-rose-500 focus:border-rose-500' : ''
                }`} 
                id="signup-email" 
                placeholder="hello@example.com" 
                type="email" 
                value={email}
                onChange={(e) => handleChange('email', e.target.value, setEmail)}
                onBlur={(e) => handleBlur('email', e.target.value)}
                required 
              />
              {touched.email && errors.email && (
                <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="signup-password">Password</label>
              <input 
                className={`glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50 ${
                  touched.password && errors.password ? 'border-rose-500 focus:border-rose-500' : ''
                }`} 
                id="signup-password" 
                placeholder="••••••••" 
                type="password" 
                value={password}
                onChange={(e) => handleChange('password', e.target.value, setPassword)}
                onBlur={(e) => handleBlur('password', e.target.value)}
                required 
              />
              
              {/* Strength indicator */}
              {password && (
                <div className="mt-1 space-y-1 px-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-on-surface-variant">Password Strength:</span>
                    <span className={`font-bold ${strength.textColor}`}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-glass-border h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-300`}></div>
                  </div>
                </div>
              )}

              {touched.password && errors.password && (
                <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">{errors.password}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1">Email Address</label>
            <input 
              className="glass-input w-full h-12 px-4 rounded-[14px] font-body-md text-on-surface opacity-80" 
              value={email}
              disabled
            />
          </div>
        )}

        {/* Age Range and Highest Education Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Age Range Dropdown */}
          <div className="space-y-1">
            <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="ageRange">Age Range</label>
            <div className="relative">
              <select 
                className={`glass-input w-full h-12 px-4 pr-10 rounded-[14px] font-body-md text-on-surface appearance-none bg-white ${
                  touched.ageRange && errors.ageRange ? 'border-rose-500' : ''
                }`}
                id="ageRange" 
                value={ageRange}
                onChange={(e) => handleChange('ageRange', e.target.value, setAgeRange)}
                onBlur={(e) => handleBlur('ageRange', e.target.value)}
                required
              >
                <option value="" disabled>Select age range</option>
                <option value="18–22">18–22</option>
                <option value="23–28">23–28</option>
                <option value="29–35">29–35</option>
                <option value="36+">36+</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
            {touched.ageRange && errors.ageRange && (
              <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">{errors.ageRange}</p>
            )}
          </div>

          {/* Highest Education Dropdown */}
          <div className="space-y-1">
            <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="educationLevel">Highest Education</label>
            <div className="relative">
              <select 
                className={`glass-input w-full h-12 px-4 pr-10 rounded-[14px] font-body-md text-on-surface appearance-none bg-white ${
                  touched.educationLevel && errors.educationLevel ? 'border-rose-500' : ''
                }`}
                id="educationLevel" 
                value={educationLevel}
                onChange={(e) => handleChange('educationLevel', e.target.value, setEducationLevel)}
                onBlur={(e) => handleBlur('educationLevel', e.target.value)}
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
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
            {touched.educationLevel && errors.educationLevel && (
              <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">{errors.educationLevel}</p>
            )}
          </div>
        </div>

        {/* Field of Study and Target Role Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Field of Study Dropdown */}
          <div className="space-y-1">
            <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="domain">Field of Study / Domain</label>
            <div className="relative">
              <select 
                className={`glass-input w-full h-12 px-4 pr-10 rounded-[14px] font-body-md text-on-surface appearance-none bg-white ${
                  touched.domain && errors.domain ? 'border-rose-500' : ''
                }`}
                id="domain" 
                value={domain}
                onChange={(e) => handleChange('domain', e.target.value, setDomain)}
                onBlur={(e) => handleBlur('domain', e.target.value)}
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
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
            {touched.domain && errors.domain && (
              <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">{errors.domain}</p>
            )}
          </div>

          {/* Target Role Dropdown */}
          <div className="space-y-1">
            <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="targetRole">Target Role of Interest</label>
            <div className="relative">
              <select 
                className={`glass-input w-full h-12 px-4 pr-10 rounded-[14px] font-body-md text-on-surface appearance-none bg-white ${
                  touched.targetRole && errors.targetRole ? 'border-rose-500' : ''
                }`}
                id="targetRole" 
                value={targetRole}
                onChange={(e) => handleChange('targetRole', e.target.value, setTargetRole)}
                onBlur={(e) => handleBlur('targetRole', e.target.value)}
                required
              >
                <option value="" disabled>Select target role</option>
                <option value="Software Developer">Software Developer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Mechanical Engineer">Mechanical Engineer</option>
                <option value="Electrical/Embedded Engineer">Electrical/Embedded Engineer</option>
                <option value="Other">Other</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
            {touched.targetRole && errors.targetRole && (
              <p className="text-rose-600 font-label-sm text-[11px] mt-0.5 ml-1">{errors.targetRole}</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`px-8 h-12 rounded-[14px] font-headline-md text-body-md font-semibold flex items-center justify-center gap-2 transition-all ${
              isFormValid 
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
