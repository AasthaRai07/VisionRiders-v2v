'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  useEffect(() => {
    const container = document.getElementById('particles');
    if (!container) return;
    
    // Clear existing particles in case of fast refresh
    container.innerHTML = '';
    
    const numParticles = 20;
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Randomize positions, durations, and delays
        const left = Math.random() * 100;
        const duration = 10 + Math.random() * 20; // 10s to 30s
        const delay = Math.random() * 10;
        
        particle.style.left = `${left}vw`;
        particle.style.animationDuration = `${duration}s, 3s`;
        particle.style.animationDelay = `${delay}s, 0s`;
        
        // Random opacity for depth
        particle.style.opacity = (0.2 + Math.random() * 0.5).toString();
        
        container.appendChild(particle);
    }
  }, []);

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen">
      {/* Animated Particles Layer */}
      <div className="particle-container" id="particles"></div>
      
      {/* Main Content Canvas */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-stack-xl min-h-screen">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center max-w-[800px] mx-auto w-full mb-stack-xl">
          {/* Logo Lockup */}
          <div className="glass-panel rounded-full px-8 py-6 mb-stack-md flex items-center justify-center shadow-sm">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight flex items-baseline">
              HerNova<span className="text-tertiary-fixed-dim text-lg md:text-2xl ml-1 -translate-y-2">✦</span>
            </h1>
          </div>
          {/* Tagline */}
          <p className="font-body-lg text-body-lg text-on-surface-variant italic mb-stack-lg max-w-[600px] leading-relaxed">
            Igniting the next generation of women leaders.
          </p>
          {/* CTA Button */}
          <Link href="/dashboard" className="bg-[#FFB300] text-[#281526] font-label-sm text-label-sm py-4 px-10 rounded-full cta-glow flex items-center gap-2 hover:scale-105 transition-transform duration-300">
            Get Started
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </section>

        {/* Pillars Section */}
        <section className="w-full max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Pillar 1: Learn */}
            <div className="glass-panel rounded-xl p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-primary">
                <span className="material-symbols-outlined text-[32px]">school</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Learn</h3>
              <p className="font-body-md text-body-md text-on-surface-variant opacity-80">
                Master essential skills through curated educational tracks.
              </p>
            </div>
            {/* Pillar 2: Earn */}
            <div className="glass-panel rounded-xl p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-secondary">
                <span className="material-symbols-outlined text-[32px]">show_chart</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Earn</h3>
              <p className="font-body-md text-body-md text-on-surface-variant opacity-80">
                Unlock financial independence and career advancement.
              </p>
            </div>
            {/* Pillar 3: Grow */}
            <div className="glass-panel rounded-xl p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-tertiary-container">
                <span className="material-symbols-outlined text-[32px]">explore</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Grow</h3>
              <p className="font-body-md text-body-md text-on-surface-variant opacity-80">
                Connect with mentors and expand your network.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
