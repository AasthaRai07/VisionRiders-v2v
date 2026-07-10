'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';

export default function FinanceHub() {
  const [quizState, setQuizState] = useState(null);

  useEffect(() => {
    // Basic particle setup
    const container = document.getElementById('finance-particles');
    if (!container) return;
    
    container.innerHTML = '';
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.background = 'rgba(255,255,255,0.8)';
        particle.style.borderRadius = '50%';
        
        const size = Math.random() * 4 + 2; 
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animation = `float-up ${duration}s linear infinite`;
        particle.style.animationDelay = `${delay}s`;
        
        container.appendChild(particle);
    }
  }, []);

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-up {
            0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
        }
        @keyframes pulse-ring {
            0% { transform: scale(0.95); opacity: 0.5; }
            50% { transform: scale(1.05); opacity: 0.8; }
            100% { transform: scale(0.95); opacity: 0.5; }
        }
        .pulse-amber {
            animation: pulse-ring 2s infinite ease-in-out;
        }
        .nova-star {
            clip-path: polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%);
        }
        .glass-glow-hover:hover {
            box-shadow: 0 0 20px rgba(194, 24, 91, 0.15);
        }
        .glass-glow-amber {
            box-shadow: 0 0 20px rgba(255, 179, 0, 0.3);
        }
        @keyframes starBurst {
            0% { transform: scale(0) translateY(0); opacity: 1; }
            100% { transform: scale(1.5) translateY(-30px); opacity: 0; }
        }
        .correct-star-burst {
            animation: starBurst 1.5s ease-out forwards;
        }
      `}} />
      <div id="finance-particles" className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden"></div>
      
      <Sidebar activeItem="finance" />
      <Header />
      
      <main className="md:ml-64 pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop pb-32 max-w-container-max mx-auto relative z-10 w-full">
        {/* FinHer Score Pinned Widget */}
        <section className="glass-panel rounded-xl p-6 mb-stack-lg flex flex-col md:flex-row md:items-center justify-between gap-4 animate-[fadeSlideUp_0.6s_ease-out_forwards]">
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="40" stroke="#fad9f1" strokeWidth="8"></circle>
                <circle className="pulse-amber transition-all duration-1000 ease-out" cx="50" cy="50" fill="none" r="40" stroke="#FFB300" strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" strokeWidth="8"></circle>
              </svg>
              <div className="absolute inset-0 bg-[#FFB300]/10 rounded-full pulse-amber"></div>
              <div className="relative z-10 flex flex-col items-center justify-center">
                <span className="font-headline-md text-headline-md font-bold text-on-surface">75</span>
              </div>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold mb-1">Your FinHer Score</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">You're making great progress in financial literacy.</p>
            </div>
          </div>
          <button className="font-label-sm text-label-sm text-primary hover:text-primary-container transition-colors flex items-center gap-1 font-bold">
            View full report <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </section>

        {/* Lessons Grid */}
        <div className="mb-stack-xl">
          <h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-stack-md font-semibold">Continue Learning</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-panel rounded-xl p-6 flex flex-col gap-4 glass-glow-hover transition-all duration-300 cursor-pointer group">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                </div>
                <span className="font-label-sm text-label-sm px-2 py-1 bg-surface-variant text-on-surface-variant rounded-full">Module 1</span>
              </div>
              <div>
                <h4 className="font-headline-md text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Budgeting 101</h4>
                <p className="font-body-md text-sm text-on-surface-variant mt-1">Master the basics of cash flow management.</p>
              </div>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden flex-grow mr-4">
                  <div className="bg-primary h-full rounded-full w-[80%]"></div>
                </div>
                <div className="w-6 h-6 bg-[#FFB300] nova-star flex-shrink-0 pulse-amber drop-shadow-[0_0_8px_rgba(255,179,0,0.6)]"></div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6 flex flex-col gap-4 glass-glow-hover transition-all duration-300 cursor-pointer group">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-2">
                  <span className="material-symbols-outlined">credit_card</span>
                </div>
                <span className="font-label-sm text-label-sm px-2 py-1 bg-surface-variant text-on-surface-variant rounded-full">Module 2</span>
              </div>
              <div>
                <h4 className="font-headline-md text-body-lg font-bold text-on-surface group-hover:text-secondary transition-colors">Understanding Credit</h4>
                <p className="font-body-md text-sm text-on-surface-variant mt-1">Build and maintain a healthy credit score.</p>
              </div>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden flex-grow mr-4">
                  <div className="bg-primary h-full rounded-full w-[45%]"></div>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">45%</span>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6 flex flex-col gap-4 glass-glow-hover transition-all duration-300 cursor-pointer group opacity-80">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary mb-2">
                  <span className="material-symbols-outlined">assured_workload</span>
                </div>
                <span className="font-label-sm text-label-sm px-2 py-1 bg-surface-variant text-on-surface-variant rounded-full">Module 3</span>
              </div>
              <div>
                <h4 className="font-headline-md text-body-lg font-bold text-on-surface group-hover:text-tertiary transition-colors">Govt. Schemes for Women</h4>
                <p className="font-body-md text-sm text-on-surface-variant mt-1">Leverage grants and subsidized loans.</p>
              </div>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden flex-grow mr-4">
                  <div className="bg-primary h-full rounded-full w-0"></div>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Quiz Widget */}
        <div className="glass-panel rounded-xl p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <span className="material-symbols-outlined text-[#FFB300]">quiz</span>
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Quick Check</h3>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface mb-8 relative z-10">Which of these is a central govt. scheme for women entrepreneurs?</p>
          
          <div className="flex flex-col gap-4 relative z-10">
            <button 
              onClick={() => setQuizState('A')}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between group relative overflow-hidden ${quizState === 'A' ? 'border-[#FFB300] bg-surface/80 glass-glow-amber' : 'border-glass-border bg-glass-overlay hover:bg-surface/50'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-label-sm text-label-sm ${quizState === 'A' ? 'bg-[#FFB300]/20 text-[#FFB300]' : 'bg-surface-variant text-on-surface'}`}>A</div>
                <span className="font-body-md text-on-surface font-medium">Mudra Yojana</span>
              </div>
              {quizState === 'A' && (
                <>
                  <div className="flex items-center gap-2 text-success-emerald">
                    <span className="material-symbols-outlined">check_circle</span>
                    <span className="font-label-sm text-label-sm font-bold">Correct!</span>
                  </div>
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 w-10 h-10 pointer-events-none">
                    <div className="w-3 h-3 bg-[#FFB300] nova-star absolute top-0 left-0 correct-star-burst"></div>
                    <div className="w-2 h-2 bg-primary-container nova-star absolute top-4 left-4 correct-star-burst" style={{animationDelay: '100ms'}}></div>
                    <div className="w-4 h-4 bg-secondary nova-star absolute bottom-0 right-0 correct-star-burst" style={{animationDelay: '200ms'}}></div>
                  </div>
                </>
              )}
            </button>
            <button 
              onClick={() => setQuizState('B')}
              className="w-full text-left p-4 rounded-lg border border-glass-border bg-glass-overlay hover:bg-surface/50 transition-all flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface font-bold font-label-sm text-label-sm">B</div>
              <span className="font-body-md text-on-surface font-medium">SkillBridge</span>
            </button>
            <button 
              onClick={() => setQuizState('C')}
              className="w-full text-left p-4 rounded-lg border border-glass-border bg-glass-overlay hover:bg-surface/50 transition-all flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface font-bold font-label-sm text-label-sm">C</div>
              <span className="font-body-md text-on-surface font-medium">HerNova Grants</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
