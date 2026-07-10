'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect } from 'react';

export default function CommunityHub() {
  useEffect(() => {
    // Basic Intersection Observer for fade-up animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-slide-up').forEach((el) => {
        observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .fade-slide-up {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-slide-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
        @keyframes novaPulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 179, 0, 0.4); }
            70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(255, 179, 0, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 179, 0, 0); }
        }
        .pulse-active {
            animation: novaPulse 1.5s infinite;
        }
        @keyframes twinkle {
            0% { opacity: 0.2; transform: scale(0.8); }
            100% { opacity: 0.6; transform: scale(1.2); }
        }
        .star-particle {
            position: absolute;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
            border-radius: 50%;
            animation: twinkle 4s infinite ease-in-out alternate;
        }
      `}} />

      {/* Background Particles */}
      <div aria-hidden="true" className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="star-particle" style={{top: '10%', left: '20%', width: '4px', height: '4px', animationDelay: '0s'}}></div>
        <div className="star-particle" style={{top: '30%', left: '80%', width: '6px', height: '6px', animationDelay: '1s'}}></div>
        <div className="star-particle" style={{top: '60%', left: '15%', width: '3px', height: '3px', animationDelay: '2s'}}></div>
        <div className="star-particle" style={{top: '80%', left: '70%', width: '5px', height: '5px', animationDelay: '0.5s'}}></div>
        <div className="star-particle" style={{top: '40%', left: '50%', width: '4px', height: '4px', animationDelay: '1.5s'}}></div>
      </div>
      
      <Sidebar activeItem="community" />
      <Header />
      
      <main className="pt-20 md:pt-24 pb-32 md:pb-12 px-margin-mobile md:px-margin-desktop md:ml-64 max-w-container-max mx-auto min-h-screen flex flex-col gap-stack-lg w-full">
        {/* Community Guidelines Banner */}
        <div className="glass-panel rounded-xl py-3 px-6 flex items-center justify-center gap-3 fade-slide-up sticky top-20 md:top-8 z-30 mb-4 bg-white/40">
          <span className="material-symbols-outlined text-secondary">shield</span>
          <p className="font-body-md text-body-md text-[#594045] font-medium text-center">
              A safe space for growth. Please follow our community guidelines.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide fade-slide-up" style={{animationDelay: '0.1s'}}>
          <button className="glass-panel px-6 py-2 rounded-full font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap">
              All
          </button>
          <button className="glass-panel px-6 py-2 rounded-full font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap">
              Career Talk
          </button>
          <button className="glass-panel px-6 py-2 rounded-full font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap">
              Wellness
          </button>
          <button className="glass-panel px-6 py-2 rounded-full font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap">
              Money Matters
          </button>
          {/* Active Tab */}
          <button className="glass-panel px-6 py-2 rounded-full font-label-sm text-label-sm text-primary font-bold border-b-2 border-accent-golden relative whitespace-nowrap shadow-[0_4px_12px_rgba(255,179,0,0.3)] bg-white/50">
              Wins &amp; Support
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFB300] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFB300] shadow-[0_0_8px_rgba(255,179,0,0.8)]"></span>
              </span>
          </button>
        </div>

        {/* Feed Container */}
        <div className="flex flex-col gap-stack-md max-w-3xl mx-auto w-full">
          {/* Post Card 1 */}
          <article className="glass-panel rounded-2xl p-6 flex flex-col gap-4 fade-slide-up hover:shadow-lg transition-shadow duration-300" style={{animationDelay: '0.2s'}}>
            <header className="flex items-center gap-4">
              <img className="w-12 h-12 rounded-full border-2 border-glass-border object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnRk5OUF0weYzRdcLFqsdR4DKiud7CDMq7juQ8NGqwil1JjFUJBzF3n9oxTR_iRdzUrR6N4ZvIWVMqUePivpVTv6Wt_wLQ-DWy_uS_tBHuG8_R2dP52oeL_14v0qnikFA-fxlh9OV-4j_JjjL48ACKl8CW-2c9ZQXgQ1fns9V6dFsv1eXtQ4A5Ty3kEx_TjilVbXFvw8jrkOOWujR2qHsRNdqJG_rc_ecX9qnSeKd_56_BVtbdK3kEb5fcVxpmHSYA0P8PlWltjK4"/>
              <div>
                <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">Priya K.</h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70">2h ago • Career Talk</p>
              </div>
              <button className="ml-auto text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </header>
            <div className="font-body-md text-body-md text-on-surface leading-relaxed">
              <p>Just landed my first returnship interview! 🌟 So thankful for the mentor matches here. The resume review workshop last week really helped me articulate my career gap confidently.</p>
            </div>
            <footer className="pt-4 border-t border-glass-border flex gap-6 items-center">
              <button className="flex items-center gap-2 text-on-surface-variant hover:text-[#FFB300] transition-colors group">
                <span className="material-symbols-outlined group-hover:pulse-active">auto_awesome</span>
                <span className="font-label-sm text-label-sm">42 Support</span>
              </button>
              <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">chat_bubble_outline</span>
                <span className="font-label-sm text-label-sm">8 Comments</span>
              </button>
              <button className="ml-auto text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">share</span>
              </button>
            </footer>
          </article>

          {/* Post Card 2 */}
          <article className="glass-panel rounded-2xl p-6 flex flex-col gap-4 fade-slide-up hover:shadow-lg transition-shadow duration-300" style={{animationDelay: '0.3s'}}>
            <header className="flex items-center gap-4">
              <img className="w-12 h-12 rounded-full border-2 border-glass-border object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDii4Nm7Cv9cH1YvoyKByYRIhaV6PkiatBkME2if6X8ONt8TJpfpt7BluM6ya4_wRwQ0i_XD51mMdRHH2sD3R3n9EsKtnjfWZPZXT3WKfTlNLQY_gFOoKWjcd6TIAWcm87GsHrI8AbXeMeasLylw1P6u4uQzlmLdKIWCV4IN_lz1W0Et6QURWCIwH68RM1FBYOxW9lpoF8Gz76KbaasNEaoWgzZIROonKRKKFkiHn11NKnRKeAXXCoFSQDkyAgyogKH0_lbm4Iajp4"/>
              <div>
                <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">Sarah M.</h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70">5h ago • Wins &amp; Support</p>
              </div>
              <button className="ml-auto text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </header>
            <div className="font-body-md text-body-md text-on-surface leading-relaxed">
              <p>Finally negotiated that raise! It was terrifying, but I used the scripts from the Finance module and it actually worked. Don't underestimate your worth, ladies! 💪💸</p>
            </div>
            <footer className="pt-4 border-t border-glass-border flex gap-6 items-center">
              <button className="flex items-center gap-2 text-[#FFB300] transition-colors group">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                <span className="font-label-sm text-label-sm font-bold">128 Supported</span>
              </button>
              <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">chat_bubble_outline</span>
                <span className="font-label-sm text-label-sm">24 Comments</span>
              </button>
              <button className="ml-auto text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">share</span>
              </button>
            </footer>
          </article>

          {/* Post Card 3 */}
          <article className="glass-panel rounded-2xl p-6 flex flex-col gap-4 fade-slide-up hover:shadow-lg transition-shadow duration-300" style={{animationDelay: '0.4s'}}>
            <header className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-headline-md text-headline-md font-bold">
                  EM
              </div>
              <div>
                <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">Elena M.</h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70">1d ago • Wellness</p>
              </div>
              <button className="ml-auto text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </header>
            <div className="font-body-md text-body-md text-on-surface leading-relaxed">
              <p>Reminder to step away from the screen today. I've been feeling burnt out, taking a small mental health day makes a huge difference. How is everyone managing work-life balance this week?</p>
            </div>
            <footer className="pt-4 border-t border-glass-border flex gap-6 items-center">
              <button className="flex items-center gap-2 text-on-surface-variant hover:text-[#FFB300] transition-colors group">
                <span className="material-symbols-outlined group-hover:pulse-active">auto_awesome</span>
                <span className="font-label-sm text-label-sm">89 Support</span>
              </button>
              <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">chat_bubble_outline</span>
                <span className="font-label-sm text-label-sm">15 Comments</span>
              </button>
              <button className="ml-auto text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">share</span>
              </button>
            </footer>
          </article>
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 md:bottom-12 right-6 md:right-12 w-14 h-14 bg-[#FFB300] rounded-full flex items-center justify-center text-[#281526] hover:scale-105 active:scale-95 transition-all z-40 group shadow-[0_0_15px_rgba(255,179,0,0.5)]">
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add_circle</span>
      </button>
    </div>
  );
}
