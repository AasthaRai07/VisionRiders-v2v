'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect } from 'react';

export default function MentorshipConnect() {
  useEffect(() => {
    const container = document.getElementById('particles-container-mentorship');
    if (!container) return;
    
    container.innerHTML = '';
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.backgroundColor = '#ffb1c2'; // primary-fixed-dim
        particle.style.borderRadius = '50%';
        particle.style.filter = 'blur(1px)';
        particle.style.opacity = '0.6';
        
        // Random positioning and timing
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = 5 + Math.random() * 15;
        const delay = Math.random() * 5;
        
        particle.style.left = `${left}vw`;
        particle.style.top = `${top}vh`;
        particle.style.animation = `float ${duration}s infinite linear`;
        particle.style.animationDelay = `${delay}s`;
        
        container.appendChild(particle);
    }
  }, []);

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
            0% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-20px) translateX(10px); }
            100% { transform: translateY(0) translateX(0); }
        }
      `}} />
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden" id="particles-container-mentorship"></div>
      
      <Sidebar activeItem="mentors" />
      <Header />
      
      {/* Main Content Canvas */}
      <main className="md:ml-64 pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop pb-32 max-w-container-max mx-auto relative z-10 w-full">
        {/* Header Section */}
        <div className="mb-stack-lg">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">Find Your Guide</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Connect with experienced professionals who can help navigate your career path and financial growth.</p>
        </div>
        
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-stack-xl">
          <button className="glass-panel px-4 py-2 rounded-full font-label-sm text-label-sm text-on-surface flex items-center gap-2 hover:bg-glass-overlay transition-colors">
            Industry <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
          <button className="glass-panel px-4 py-2 rounded-full font-label-sm text-label-sm text-on-surface flex items-center gap-2 hover:bg-glass-overlay transition-colors">
            Career Stage <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
          <button className="glass-panel px-4 py-2 rounded-full font-label-sm text-label-sm text-on-surface flex items-center gap-2 hover:bg-glass-overlay transition-colors">
            Availability <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
          <button className="glass-panel px-4 py-2 rounded-full font-label-sm text-label-sm text-primary flex items-center gap-2 ml-auto border-primary-fixed-dim bg-white/30 hover:bg-white/40 transition-colors">
            <span className="material-symbols-outlined text-[16px]">tune</span> Filters
          </button>
        </div>
        
        {/* Mentor Grid (Bento/Masonry feel) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-lg">
          {/* Mentor Card 1 */}
          <div className="glass-panel rounded-xl p-stack-lg relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-container rounded-full mix-blend-multiply filter blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="flex items-start gap-4 mb-stack-md">
              <img className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm z-10 relative" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ9VxbCGNbO6LSm1_x7B7sOD1up1UonQFS7dyqk7UWOeCUqonKQjSnW2ePKsAg5CcetfuCZ-2ZRHb8ua3huUqpV_2xOLcNtmq1xdkYawgM0lDXVnFnGrtT90ikT7Jf0TJkzfgQ1GqC4QJt3jq39hG_E4pFeoSx-5kuB8VLzeLuM6ytOHUbfshB53RdlgPRkoLtIupmXMY0CnJP9GaGIo9sDhMVCofiCLTd997SQdicshdXS9rnuRr7nGt76SeVduvIysaThx3r5Rs"/>
              <div className="z-10 relative">
                <h3 className="font-headline-md text-headline-md text-on-surface">Elena Rostova</h3>
                <p className="font-body-md text-body-md text-outline">VP of Engineering at FinTech Co.</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-tertiary-fixed-dim text-[16px]">star</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">4.9 (42 reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-stack-lg z-10 relative">
              <span className="bg-surface-dim text-on-surface-variant px-2 py-1 rounded-md font-label-sm text-label-sm">Leadership</span>
              <span className="bg-surface-dim text-on-surface-variant px-2 py-1 rounded-md font-label-sm text-label-sm">Tech</span>
              <span className="bg-surface-dim text-on-surface-variant px-2 py-1 rounded-md font-label-sm text-label-sm">Negotiation</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg line-clamp-2 z-10 relative">
              Helping women transition into technical leadership roles and negotiate their worth with confidence.
            </p>
            <div className="flex justify-between items-center z-10 relative mt-auto border-t border-glass-border pt-stack-sm">
              <span className="font-label-sm text-label-sm text-primary">Next available: Tommorrow</span>
              <button className="bg-[#FFB300] hover:bg-opacity-90 text-[#3f293b] px-6 py-2 rounded-lg font-label-sm text-label-sm uppercase tracking-wider font-bold shadow-md transition-colors">Connect</button>
            </div>
          </div>
          
          {/* Mentor Card 2 */}
          <div className="glass-panel rounded-xl p-stack-lg relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-fixed-dim rounded-full mix-blend-multiply filter blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="flex items-start gap-4 mb-stack-md">
              <img className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm z-10 relative" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9Thu9XtcRMvFTCxO86IykdUG4A5BJYNtoMk9q_RbqFhb6CpntC6UB58Fys-SKC_7kybS9eThiXIvfIJeF7CHZEfIPZRSJLvUq5_6GqPCG4sX64-p0qW0InFspauSANSJaBaHjqSRkziZar-LtkqjWjOY6wMwVH_mbEMNpMkXFTDu--vxfPaKgcXtdaa7sPYwjyCIpimhODHDn7t2WecFrWdzRJaztJLst1Z8ulX-M1Is-JwyGzVKnVfkxRs-MyXlZAFdkdtMVW9Q"/>
              <div className="z-10 relative">
                <h3 className="font-headline-md text-headline-md text-on-surface">Sarah Jenkins</h3>
                <p className="font-body-md text-body-md text-outline">Senior Wealth Manager</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-tertiary-fixed-dim text-[16px]">star</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">5.0 (18 reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-stack-lg z-10 relative">
              <span className="bg-surface-dim text-on-surface-variant px-2 py-1 rounded-md font-label-sm text-label-sm">Investing</span>
              <span className="bg-surface-dim text-on-surface-variant px-2 py-1 rounded-md font-label-sm text-label-sm">Finance</span>
              <span className="bg-surface-dim text-on-surface-variant px-2 py-1 rounded-md font-label-sm text-label-sm">Startups</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg line-clamp-2 z-10 relative">
              Demystifying personal finance and early-stage startup investing for female founders.
            </p>
            <div className="flex justify-between items-center z-10 relative mt-auto border-t border-glass-border pt-stack-sm">
              <span className="font-label-sm text-label-sm text-primary">Next available: Next Week</span>
              <button className="bg-[#FFB300] hover:bg-opacity-90 text-[#3f293b] px-6 py-2 rounded-lg font-label-sm text-label-sm uppercase tracking-wider font-bold shadow-md transition-colors">Connect</button>
            </div>
          </div>
          
          {/* Mentor Card 3 */}
          <div className="glass-panel rounded-xl p-stack-lg relative overflow-hidden group hover:shadow-lg transition-all duration-300 lg:col-span-1 md:col-span-2">
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-surface-tint rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="flex items-start gap-4 mb-stack-md">
              <img className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm z-10 relative" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8DisgSUhyZfbvR2JvGw9Y-6WwY8sKlWABo3ALBTIBuGVC0u6a9dyRHQDLqWjAPq6LSWUrg93UuQCtrFn1poWJuzZNM03FJgxWk8gkYKxh5sJDeeDCg-wAkdqWUQWnB4q0lu4lhVQrjQFlR2nbrjwnaKUIdqE2W-h_7mTyrxCXWoGN9ZiE5loMY6nTaGVY7Z7z2c8ChmIM57UgK_UpT3l9x3LDZ10h9MlxSqxu-2oO0tJ_D9V1c7lTLLdp3ennW0j_UdimnBEKU8o"/>
              <div className="z-10 relative">
                <h3 className="font-headline-md text-headline-md text-on-surface">Maya Patel</h3>
                <p className="font-body-md text-body-md text-outline">Design Director, Agency X</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-tertiary-fixed-dim text-[16px]">star</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">4.8 (89 reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-stack-lg z-10 relative">
              <span className="bg-surface-dim text-on-surface-variant px-2 py-1 rounded-md font-label-sm text-label-sm">UX/UI</span>
              <span className="bg-surface-dim text-on-surface-variant px-2 py-1 rounded-md font-label-sm text-label-sm">Portfolio</span>
              <span className="bg-surface-dim text-on-surface-variant px-2 py-1 rounded-md font-label-sm text-label-sm">Career Pivot</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg line-clamp-2 z-10 relative">
              Passionate about helping junior designers refine their portfolios and break into the industry.
            </p>
            <div className="flex justify-between items-center z-10 relative mt-auto border-t border-glass-border pt-stack-sm">
              <span className="font-label-sm text-label-sm text-primary">Next available: Today</span>
              <button className="bg-[#FFB300] hover:bg-opacity-90 text-[#3f293b] px-6 py-2 rounded-lg font-label-sm text-label-sm uppercase tracking-wider font-bold shadow-md transition-colors">Connect</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
