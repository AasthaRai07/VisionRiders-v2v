'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PersonaSelect from '@/components/auth/PersonaSelect';
import ResumeUpload from '@/components/auth/ResumeUpload';
import CreateAccountProfile from '@/components/auth/CreateAccountProfile';
import AdditionalDetails from '@/components/auth/AdditionalDetails';
import AuthBackground from '@/components/auth/AuthBackground';

export default function SignupPage() {
  const router = useRouter();

  // Onboarding steps: 'persona', 'upload', 'universal', 'specific'
  const [step, setStep] = useState('persona');

  // Unified form / onboarding state
  const [onboardingData, setOnboardingData] = useState({
    persona: '',
    resumeUploaded: false,
    resumeFileName: '',
    resumeText: '',
    certificates: [],
    fullName: '',
    email: '',
    password: '',
    ageRange: '',
    educationLevel: '',
    domain: '',
    targetRole: '',
    isGoogleAuth: false
  });

  // Extract Google Auth data if redirected from Google login page
  useEffect(() => {
    try {
      const googleInfo = sessionStorage.getItem('google_auth_info');
      if (googleInfo) {
        const parsed = JSON.parse(googleInfo);
        setOnboardingData((prev) => ({
          ...prev,
          fullName: parsed.fullName || '',
          email: parsed.email || '',
          isGoogleAuth: true
        }));
        // Remove it so it doesn't linger for subsequent signs
        sessionStorage.removeItem('google_auth_info');
      }
    } catch (err) {
      console.error("Error reading Google Auth info from sessionStorage", err);
    }
  }, []);

  const handlePersonaSelect = (selectedPersona) => {
    setOnboardingData((prev) => ({
      ...prev,
      persona: selectedPersona,
    }));
    setStep('upload');
  };

  const handleUploadContinue = (resumeFile, certificateFiles, resumeParsed, extractedText) => {
    setOnboardingData((prev) => ({
      ...prev,
      resumeUploaded: !!resumeFile,
      resumeFileName: resumeFile ? resumeFile.name : '',
      resumeText: extractedText || '',
      certificates: certificateFiles.map(f => f.name),
    }));
    setStep('universal');
  };

  const handleUniversalContinue = (universalData) => {
    setOnboardingData((prev) => ({
      ...prev,
      ...universalData,
    }));
    setStep('specific');
  };

  const handleSpecificSubmit = (finalData) => {
    router.push('/dashboard');
  };

  return (
    <div className="h-screen m-0 p-0 overflow-hidden font-body-md text-body-md text-on-surface selection:bg-primary-container selection:text-white">
      <AuthBackground />

      {/* Main Content Area */}
      <main className="h-full flex items-center justify-center p-6 md:p-12 relative z-10 overflow-y-auto">
        <div className="w-full flex justify-center py-8">
          {step === 'persona' && (
            <PersonaSelect 
              onBack={() => router.push('/auth')} 
              onContinue={handlePersonaSelect} 
              initialPersona={onboardingData.persona}
            />
          )}

          {step === 'upload' && (
            <ResumeUpload 
              onBack={() => setStep('persona')} 
              onContinue={handleUploadContinue} 
            />
          )}

          {step === 'universal' && (
            <CreateAccountProfile 
              onBack={() => setStep('upload')} 
              onContinue={handleUniversalContinue} 
              onboardingData={onboardingData}
            />
          )}

          {step === 'specific' && (
            <AdditionalDetails 
              onBack={() => setStep('universal')} 
              onSubmit={handleSpecificSubmit} 
              onboardingData={onboardingData}
            />
          )}
        </div>
      </main>
    </div>
  );
}
