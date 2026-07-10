'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function SkillGapAnalyzer() {
  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-amber {
            0% { box-shadow: 0 0 0 0 rgba(255, 179, 0, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(255, 179, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 179, 0, 0); }
        }
        .animate-pulse-amber {
            animation: pulse-amber 2s infinite;
        }
        
        @keyframes slide-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
            animation: slide-up 0.5s ease-out forwards;
        }
        
        .stagger-1 { animation-delay: 100ms; opacity: 0; }
        .stagger-2 { animation-delay: 200ms; opacity: 0; }
        .stagger-3 { animation-delay: 300ms; opacity: 0; }
        .stagger-4 { animation-delay: 400ms; opacity: 0; }
        .stagger-5 { animation-delay: 500ms; opacity: 0; }
        
        .dropzone-container:hover .dropzone-border {
            border-color: #FFB300;
            box-shadow: 0 0 15px rgba(255, 179, 0, 0.2) inset;
        }
        
        .chip-radio:checked + label {
            background-color: #C2185B;
            color: white;
            border-color: #C2185B;
            box-shadow: 0 0 15px rgba(194, 24, 91, 0.3);
        }
      `}} />
      
      <Sidebar activeItem="learn" />
      <Header />
      
      <main className="md:ml-64 pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop pb-32 max-w-container-max mx-auto relative z-10 w-full flex-grow flex flex-col gap-10">
        
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-primary flex items-center gap-3">
              Find Your Path <span className="text-tertiary-fixed-dim text-2xl">✦</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Upload your resume, we'll map the gap.</p>
        </div>

        {/* STEP 1: Upload Card */}
        <section className="glass-panel rounded-2xl p-8 flex flex-col gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary to-transparent rounded-full blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
          <h3 className="font-headline-md text-headline-md font-medium flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary-container/20 text-primary flex items-center justify-center text-sm font-bold border border-primary/30">1</span>
            Resume Analysis
          </h3>
          <div className="dropzone-container cursor-pointer group">
            <div className="dropzone-border border-2 border-dashed border-[#FFB300]/50 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-all duration-300 bg-white/5 relative">
              <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary animate-bounce">
                <span className="material-symbols-outlined text-4xl">cloud_upload</span>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg mb-1">Drag and drop your resume here</p>
                <p className="text-sm text-on-surface-variant">PDF, DOCX up to 5MB</p>
              </div>
              <button className="mt-4 px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-[#320047] transition-colors font-semibold">
                  Browse Files
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 mt-4">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Target Role</p>
            <div className="flex flex-wrap gap-3">
              <div>
                <input className="peer sr-only chip-radio" id="role-ds" name="role" type="radio"/>
                <label className="cursor-pointer px-4 py-2 rounded-full border border-glass-border bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md inline-flex items-center gap-2 text-sm" htmlFor="role-ds">
                    Data Scientist
                </label>
              </div>
              <div>
                <input defaultChecked className="peer sr-only chip-radio" id="role-ux" name="role" type="radio"/>
                <label className="cursor-pointer px-4 py-2 rounded-full border border-glass-border bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md inline-flex items-center gap-2 text-sm" htmlFor="role-ux">
                    UX Designer
                </label>
              </div>
              <div>
                <input className="peer sr-only chip-radio" id="role-pm" name="role" type="radio"/>
                <label className="cursor-pointer px-4 py-2 rounded-full border border-glass-border bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md inline-flex items-center gap-2 text-sm" htmlFor="role-pm">
                    Product Manager
                </label>
              </div>
              <div>
                <input className="peer sr-only chip-radio" id="role-se" name="role" type="radio"/>
                <label className="cursor-pointer px-4 py-2 rounded-full border border-glass-border bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md inline-flex items-center gap-2 text-sm" htmlFor="role-se">
                    Software Engineer
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 2: Results */}
        <section className="flex flex-col gap-6">
          <h3 className="font-headline-md text-headline-md font-medium flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary-container/20 text-primary flex items-center justify-center text-sm font-bold border border-primary/30">2</span>
            Skill Mapping
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Solid */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border-t-4 border-t-success-emerald">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-success-emerald">check_circle</span>
                <h4 className="font-bold text-success-emerald">Still Solid</h4>
              </div>
              <p className="text-sm text-on-surface-variant">Core competencies you maintain well.</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1.5 bg-success-emerald/10 text-success-emerald border border-success-emerald/20 rounded-lg text-sm animate-slide-up stagger-1">Figma</span>
                <span className="px-3 py-1.5 bg-success-emerald/10 text-success-emerald border border-success-emerald/20 rounded-lg text-sm animate-slide-up stagger-2">User Research</span>
                <span className="px-3 py-1.5 bg-success-emerald/10 text-success-emerald border border-success-emerald/20 rounded-lg text-sm animate-slide-up stagger-3">Prototyping</span>
              </div>
            </div>
            
            {/* Column 2: Decayed */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border-t-4 border-t-[#FFB300]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FFB300]">update</span>
                <h4 className="font-bold text-[#FFB300]">Needs Refresh</h4>
              </div>
              <p className="text-sm text-on-surface-variant">Skills that need a quick update.</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1.5 bg-[#FFB300]/10 text-[#FFB300] border border-[#FFB300]/30 rounded-lg text-sm animate-slide-up stagger-2 flex items-center gap-1">
                    WCAG 2.1 <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span> 2.2
                </span>
                <span className="px-3 py-1.5 bg-[#FFB300]/10 text-[#FFB300] border border-[#FFB300]/30 rounded-lg text-sm animate-slide-up stagger-3">Design Systems</span>
              </div>
            </div>
            
            {/* Column 3: New */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border-t-4 border-t-primary">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">star</span>
                <h4 className="font-bold text-primary">New Since You Left</h4>
              </div>
              <p className="text-sm text-on-surface-variant">Critical gaps to fill for this role.</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm animate-slide-up stagger-3">Generative AI Tools</span>
                <span className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm animate-slide-up stagger-4">Figma Variables</span>
                <span className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm animate-slide-up stagger-5">Spatial UI</span>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="glass-panel rounded-2xl p-8 mb-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-headline-md text-headline-md font-medium">7-Day Recovery Plan</h3>
            <button className="text-primary font-medium flex items-center gap-1 hover:underline text-sm">
                View Full Path <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="relative pt-8 pb-4 overflow-x-auto">
            {/* Connector Line */}
            <div className="absolute top-[42px] left-8 right-8 h-[2px] border-t-2 border-dotted border-white/20 -z-10 min-w-[600px]"></div>
            
            <div className="flex justify-between min-w-[600px] relative">
              {/* Day 1: Completed */}
              <div className="flex flex-col items-center gap-3 group w-24">
                <div className="w-8 h-8 rounded-full bg-success-emerald text-white flex items-center justify-center shadow-md relative z-10">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
                <div className="text-center">
                  <p className="font-label-sm text-label-sm text-on-surface-variant">DAY 1</p>
                  <p className="text-sm font-medium mt-1">Figma Updates</p>
                </div>
              </div>
              
              {/* Day 2: Completed */}
              <div className="flex flex-col items-center gap-3 group w-24">
                <div className="w-8 h-8 rounded-full bg-success-emerald text-white flex items-center justify-center shadow-md relative z-10">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
                <div className="text-center">
                  <p className="font-label-sm text-label-sm text-on-surface-variant">DAY 2</p>
                  <p className="text-sm font-medium mt-1">Variables</p>
                </div>
              </div>
              
              {/* Day 3: Current */}
              <div className="flex flex-col items-center gap-3 group w-32 cursor-pointer relative">
                <div className="absolute top-12 w-48 bg-glass-overlay backdrop-blur-md rounded-xl p-3 shadow-xl border border-glass-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-20 translate-y-2 group-hover:translate-y-0 duration-200">
                  <p className="text-xs text-[#FFB300] font-bold mb-1">CURRENT MODULE</p>
                  <p className="text-sm font-medium mb-2 text-on-surface">Intro to AI for UX</p>
                  <button className="w-full bg-[#FFB300] text-[#320047] font-semibold text-xs py-1.5 rounded-lg flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">play_circle</span> Start Video
                  </button>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#FFB300] text-[#320047] flex items-center justify-center animate-pulse-amber relative z-10 font-bold">
                  <span className="text-xl">✦</span>
                </div>
                <div className="text-center">
                  <p className="font-label-sm text-label-sm text-[#FFB300] font-bold">DAY 3 (TODAY)</p>
                  <p className="text-sm font-medium mt-1">AI Tools Intro</p>
                </div>
              </div>
              
              {/* Day 4: Future */}
              <div className="flex flex-col items-center gap-3 group w-24">
                <div className="w-8 h-8 rounded-full bg-white/10 text-on-surface-variant flex items-center justify-center relative z-10">
                  <span className="text-lg">✦</span>
                </div>
                <div className="text-center opacity-50">
                  <p className="font-label-sm text-label-sm">DAY 4</p>
                  <p className="text-sm mt-1">AI Prompts</p>
                </div>
              </div>

              {/* Day 5: Future */}
              <div className="flex flex-col items-center gap-3 group w-24">
                <div className="w-8 h-8 rounded-full bg-white/10 text-on-surface-variant flex items-center justify-center relative z-10">
                  <span className="text-lg">✦</span>
                </div>
                <div className="text-center opacity-50">
                  <p className="font-label-sm text-label-sm">DAY 5</p>
                  <p className="text-sm mt-1">Project</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
