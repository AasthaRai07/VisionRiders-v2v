'use client';

import Link from 'next/link';

export default function OnboardingStart() {
  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen overflow-x-hidden font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container bg-[#FFF7F9]">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 15px rgba(255, 179, 0, 0.4); }
            50% { box-shadow: 0 0 30px rgba(255, 179, 0, 0.8); }
        }
        .animate-pulse-glow {
            animation: pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .nova-star::before {
            content: "✦";
            display: inline-block;
            color: #FFB300;
            margin-left: 2px;
            margin-right: 2px;
        }
      `}} />

      {/* Background Gradient */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none bg-gradient-to-br from-[#FFF3F6] to-[#F3E5F5]"></div>

      {/* Main Content Canvas */}
      <main className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
        {/* Center Glass Card */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-[0_8px_32px_rgba(155,0,68,0.1)] p-8 md:p-12 flex flex-col items-center text-center space-y-12 relative overflow-hidden">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-[2rem]"></div>
          
          {/* Logo Section */}
          <div className="space-y-4 relative z-10 w-full">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-primary tracking-tight flex items-center justify-center font-bold text-4xl">
              HerN<span className="text-[#FFB300] mx-1">✦</span>va
            </h1>
            <p className="font-serif italic text-on-surface-variant text-lg md:text-xl font-light opacity-80">
                "Igniting the next generation of women leaders."
            </p>
          </div>
          
          {/* Content Area */}
          <div className="flex-grow flex items-center justify-center w-full py-8 relative z-10">
            <span aria-hidden="true" className="material-symbols-outlined text-5xl text-primary opacity-60">
                auto_awesome
            </span>
          </div>
          
          {/* CTA Section */}
          <div className="w-full relative z-10">
            <Link href="/onboarding/pillars" className="w-full bg-[#FFB300]/90 hover:bg-[#FFB300] text-[#320047] font-label-sm uppercase tracking-wider py-4 px-8 rounded-full border border-white/50 backdrop-blur-md transition-all duration-300 shadow-md animate-pulse-glow flex items-center justify-center space-x-2 group font-bold">
              <span>Get Started</span>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          
          {/* Optional Secondary Action / Login link */}
          <div className="mt-4 relative z-10">
            <Link href="/login" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline">
                Already have an account? Log in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
