'use client';

import { useState } from 'react';

const StudentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FresherIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="7" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProfessionalIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 6l-9.5 9.5-5-5L1 18" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 6h6v6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ReturnshipIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 4v6h6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.51 15a9 9 0 102.13-9.36L1 10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function PersonaSelect({ onBack, onContinue, initialPersona }) {
  const [selectedPersona, setSelectedPersona] = useState(initialPersona || '');

  const personas = [
    {
      id: 'student',
      title: 'Student',
      description: 'Currently studying, exploring career paths',
      icon: <StudentIcon />,
    },
    {
      id: 'fresher',
      title: 'Fresher',
      description: 'Recently graduated, starting my career',
      icon: <FresherIcon />,
    },
    {
      id: 'professional',
      title: 'Working Professional',
      description: 'Employed, looking to grow or switch',
      icon: <ProfessionalIcon />,
    },
    {
      id: 'returnship',
      title: 'Returnship',
      description: 'Returning to work after a career break',
      icon: <ReturnshipIcon />,
    },
  ];

  const handleSelect = (id) => {
    setSelectedPersona(id);
  };

  const handleNext = () => {
    if (selectedPersona) {
      onContinue(selectedPersona);
    }
  };

  return (
    <div className="glass-panel w-full max-w-[640px] rounded-[24px] p-8 animate-fade-up relative overflow-hidden flex flex-col">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-label-sm text-label-sm"
        id="persona-back-btn"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Back
      </button>

      <div className="text-center mt-6 mb-8">
        <h2 className="font-serif text-[28px] font-semibold text-on-surface mb-2">Tell us about yourself</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Select the option that best describes your current career stage.</p>
      </div>

      {/* Grid of cards with items-stretch for equal height */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 items-stretch">
        {personas.map((persona) => {
          const isSelected = selectedPersona === persona.id;
          return (
            <button
              key={persona.id}
              onClick={() => handleSelect(persona.id)}
              className={`flex flex-col text-left p-6 rounded-[18px] border transition-all duration-300 h-full justify-start ${
                isSelected 
                  ? 'border-[#D4537E] bg-[#FBEAF0]/40 ring-4 ring-[#D4537E]/20 shadow-md scale-[1.02]'
                  : 'border-[#F0DCE3] bg-white/5 hover:bg-glass-overlay hover:-translate-y-1 hover:shadow-md'
              }`}
              id={`persona-${persona.id}`}
              type="button"
            >
              {/* Unified brand color circle */}
              <div className="w-12 h-12 rounded-full bg-[#FBEAF0] flex items-center justify-center mb-4 text-[#D4537E] border border-[#FBEAF0]">
                {persona.icon}
              </div>
              <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-1.5 leading-snug">
                {persona.title}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                {persona.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="flex justify-end h-12">
        {selectedPersona && (
          <button
            onClick={handleNext}
            className="btn-primary px-8 h-full rounded-[14px] font-headline-md text-body-md font-semibold flex items-center justify-center gap-2 animate-fade-up"
            id="persona-continue-btn"
          >
            Continue
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        )}
      </div>
    </div>
  );
}
