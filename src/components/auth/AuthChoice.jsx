'use client';

export default function AuthChoice({ onSelectLogin, onSelectSignUp }) {
  return (
    <div className="glass-panel w-full max-w-[420px] rounded-[24px] p-8 animate-fade-up relative overflow-hidden flex flex-col items-center">
      {/* Logo / Branding */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 backdrop-blur-sm border border-glass-border">
          <span className="material-symbols-outlined text-primary text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">HerNova</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">Igniting the next generation of women leaders</p>
      </div>

      {/* Auth Choices */}
      <div className="w-full space-y-4">
        <button 
          onClick={onSelectLogin}
          className="btn-primary w-full h-12 rounded-[14px] font-headline-md text-body-md font-semibold flex items-center justify-center gap-2"
          id="choice-login-btn"
        >
          Log In
          <span className="material-symbols-outlined text-[20px]">login</span>
        </button>

        <button 
          onClick={onSelectSignUp}
          className="btn-glass w-full h-12 rounded-[14px] font-headline-md text-body-md font-semibold text-on-surface flex items-center justify-center gap-2"
          id="choice-signup-btn"
        >
          Sign Up
          <span className="material-symbols-outlined text-[20px]">person_add</span>
        </button>
      </div>
    </div>
  );
}
