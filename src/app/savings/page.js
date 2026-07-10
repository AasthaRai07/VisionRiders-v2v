'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';

export default function SavingsTracker() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Generate Nova Particles
    const particlesContainer = document.getElementById('savings-particles');
    if (!particlesContainer) return;
    
    particlesContainer.innerHTML = '';
    const numParticles = 15;
    
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        
        const size = Math.random() * 8 + 4; // 4px to 12px
        const left = Math.random() * 100; // 0% to 100%
        const animDuration = Math.random() * 10 + 15; // 15s to 25s
        const delay = Math.random() * 10; // 0s to 10s
        
        particle.style.position = 'absolute';
        particle.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}vw`;
        particle.style.animation = `float-up ${animDuration}s linear infinite, twinkle 3s ease-in-out infinite alternate`;
        particle.style.animationDelay = `-${delay}s, -${Math.random() * 3}s`;
        
        particlesContainer.appendChild(particle);
    }
  }, []);

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
            100% { transform: translateX(200%) skewX(-12deg); }
        }
        @keyframes float-up {
            from { transform: translateY(100vh) rotate(0deg); }
            to { transform: translateY(-100px) rotate(360deg); }
        }
        @keyframes twinkle {
            from { opacity: 0.1; transform: scale(0.8); }
            to { opacity: 0.4; transform: scale(1.2); }
        }
        @keyframes drawLine {
            to { stroke-dashoffset: 0; }
        }
        @keyframes fillArea {
            to { opacity: 1; }
        }
        .chart-path {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: drawLine 2s ease-out forwards;
        }
        .chart-fill {
            opacity: 0;
            animation: fillArea 2s ease-out forwards;
            animation-delay: 0.5s;
        }
        @keyframes slideUpFade {
            to { opacity: 1; transform: translateY(0); }
        }
        .entry-row {
            opacity: 0;
            transform: translateY(20px);
            animation: slideUpFade 0.6s ease-out forwards;
        }
      `}} />
      <div id="savings-particles" className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden"></div>
      
      <Sidebar activeItem="finance" />
      <Header />
      
      <main className="md:ml-64 pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop pb-32 max-w-container-max mx-auto relative z-10 w-full">
        {/* Header / Goal Section */}
        <section className="mb-stack-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-stack-md">
            <div>
              <h2 className="font-headline-lg md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2 font-bold">Emergency Fund</h2>
              <p className="font-body-lg text-body-lg text-[#7B1FA2]">Target: ₹1,00,000</p>
            </div>
            <div className="md:text-right">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Current Balance</p>
              <p className="font-headline-md text-headline-md text-primary">₹65,400</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="glass-panel rounded-full h-8 w-full p-1 relative overflow-hidden shadow-[0_0_15px_rgba(255,179,0,0.2)]">
            <div className="absolute inset-0 bg-white/10 rounded-full"></div>
            <div className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden w-[65%]" style={{background: 'linear-gradient(90deg, #FFB300 0%, #2E7D32 100%)'}}>
              {/* Shimmer effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 font-label-sm text-label-sm text-on-surface-variant">
            <span>0%</span>
            <span>65% Achieved</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <section className="lg:col-span-2 glass-panel rounded-2xl p-6 md:p-8 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface">Savings Trend</h3>
              <div className="flex gap-2 bg-white/20 rounded-lg p-1">
                <button className="px-3 py-1 rounded-md bg-white/40 text-primary font-label-sm text-label-sm shadow-sm">1M</button>
                <button className="px-3 py-1 rounded-md text-on-surface-variant hover:bg-white/20 font-label-sm text-label-sm transition-colors">6M</button>
                <button className="px-3 py-1 rounded-md text-on-surface-variant hover:bg-white/20 font-label-sm text-label-sm transition-colors">1Y</button>
              </div>
            </div>
            <div className="flex-1 relative w-full h-full mt-4">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 200">
                <defs>
                  <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#9b0044" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="#C2185B" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path className="chart-fill" d="M0,200 L0,150 Q50,140 100,160 T200,120 T300,90 T400,60 T500,40 L500,200 Z" fill="url(#areaGradient)"></path>
                <path className="chart-path" d="M0,150 Q50,140 100,160 T200,120 T300,90 T400,60 T500,40" fill="none" stroke="#C2185B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                <circle className="opacity-0 animate-[fillArea_0.5s_ease-out_2s_forwards]" cx="500" cy="40" fill="#FFF" r="6" stroke="#C2185B" strokeWidth="3"></circle>
              </svg>
            </div>
          </section>

          {/* Recent Entries Section */}
          <section className="lg:col-span-1 flex flex-col gap-4">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2 px-1">Recent Entries</h3>
            <div className="flex flex-col gap-3">
              {/* Row 1 */}
              <div className="glass-panel p-4 flex items-center justify-between entry-row rounded-2xl hover:-translate-y-1 hover:backdrop-blur-2xl transition-all duration-300" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">account_balance</span>
                  </div>
                  <div>
                    <p className="font-body-md text-on-surface font-medium">Monthly SIP</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Today</p>
                  </div>
                </div>
                <span className="font-body-lg font-medium text-success-emerald">+₹5,000</span>
              </div>
              
              {/* Row 2 */}
              <div className="glass-panel p-4 flex items-center justify-between entry-row rounded-2xl hover:-translate-y-1 hover:backdrop-blur-2xl transition-all duration-300" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFB300]/10 flex items-center justify-center text-[#FFB300]">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div>
                    <p className="font-body-md text-on-surface font-medium">Freelance Bonus</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Yesterday</p>
                  </div>
                </div>
                <span className="font-body-lg font-medium text-success-emerald">+₹12,400</span>
              </div>
              
              {/* Row 3 */}
              <div className="glass-panel p-4 flex items-center justify-between entry-row rounded-2xl hover:-translate-y-1 hover:backdrop-blur-2xl transition-all duration-300" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">savings</span>
                  </div>
                  <div>
                    <p className="font-body-md text-on-surface font-medium">Auto-Save</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Oct 12, 2023</p>
                  </div>
                </div>
                <span className="font-body-lg font-medium text-success-emerald">+₹2,000</span>
              </div>
              
              {/* Row 4 */}
              <div className="glass-panel p-4 flex items-center justify-between entry-row rounded-2xl hover:-translate-y-1 hover:backdrop-blur-2xl transition-all duration-300" style={{animationDelay: '0.4s'}}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
                    <span className="material-symbols-outlined">medical_services</span>
                  </div>
                  <div>
                    <p className="font-body-md text-on-surface font-medium">Medical Emergency</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Sep 28, 2023</p>
                  </div>
                </div>
                <span className="font-body-lg font-medium text-error">-₹4,000</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Floating Action Button */}
      <button 
        className="fixed bottom-8 md:bottom-12 right-6 md:right-12 z-50 flex items-center justify-center gap-2 bg-[#FFB300] text-[#320047] px-6 py-4 rounded-full shadow-[0_0_20px_rgba(255,179,0,0.4)] hover:shadow-[0_0_30px_rgba(255,179,0,0.6)] hover:scale-105 transition-all duration-300 font-body-lg font-semibold group border border-white/30 backdrop-blur-md active:scale-95"
        onClick={() => setModalOpen(true)}
      >
        <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300">add</span>
        Add Entry
      </button>

      {/* Glass Modal for Adding Entry */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300">
          <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="relative w-full max-w-md mx-4 glass-panel rounded-2xl p-8 shadow-2xl transition-transform duration-300 transform scale-100">
            <button className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface hover:bg-white/20 p-2 rounded-full transition-colors" onClick={() => setModalOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="font-headline-md text-headline-md text-primary mb-6">New Savings Entry</h2>
            <form className="flex flex-col gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1 uppercase">Amount (₹)</label>
                <input className="w-full glass-panel rounded-[14px] px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-white/40 bg-white/20 placeholder:text-on-surface-variant/50 font-body-lg" placeholder="0.00" type="number"/>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1 uppercase">Category</label>
                <div className="relative">
                  <select className="w-full glass-panel rounded-[14px] px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-white/40 bg-white/20 appearance-none font-body-md">
                    <option value="sip">Monthly SIP</option>
                    <option value="bonus">Bonus / Extra Income</option>
                    <option value="auto">Auto-Save</option>
                    <option value="other">Other Deposit</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1 uppercase">Date</label>
                <input className="w-full glass-panel rounded-[14px] px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-white/40 bg-white/20 font-body-md" type="date"/>
              </div>
              <button className="mt-4 w-full bg-[#FFB300] text-[#320047] font-body-lg font-semibold py-3 rounded-xl shadow-[0_0_15px_rgba(255,179,0,0.3)] hover:bg-[#FFC107] transition-colors" type="button" onClick={() => setModalOpen(false)}>
                  Save Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
