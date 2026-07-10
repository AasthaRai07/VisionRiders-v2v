'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';

export default function JobsBoard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState({});

  const toggleBookmark = (e, id) => {
    e.stopPropagation();
    setBookmarks(prev => ({...prev, [id]: !prev[id]}));
  };

  useEffect(() => {
    const container = document.getElementById('jobs-particles');
    if (!container) return;
    
    container.innerHTML = '';
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#FFB300';
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 8px 2px rgba(255, 179, 0, 0.4)';
        particle.style.opacity = '0.6';
        
        const left = Math.random() * 100;
        const duration = 15 + Math.random() * 10;
        
        particle.style.left = `${left}vw`;
        particle.style.animation = `drift ${duration}s linear infinite`;
        
        container.appendChild(particle);
    }
  }, []);

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes drift {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        @keyframes fadeUp {
            to { opacity: 1; transform: translateY(0); }
        }
        .job-card {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeUp 0.6s ease forwards;
        }
        .job-card:nth-child(1) { animation-delay: 0.1s; }
        .job-card:nth-child(2) { animation-delay: 0.2s; }
        .job-card:nth-child(3) { animation-delay: 0.3s; }
        .job-card:nth-child(4) { animation-delay: 0.4s; }
        .search-glow:focus-within {
            box-shadow: 0 0 15px rgba(255, 179, 0, 0.3);
            border-color: rgba(255, 179, 0, 0.5);
        }
        .glass-panel-hover:hover {
            box-shadow: 0 8px 32px rgba(194, 24, 91, 0.08);
            transform: translateY(-2px);
            border: 1px solid rgba(255, 255, 255, 0.6);
        }
      `}} />
      <div id="jobs-particles" className="fixed top-[100vh] left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden"></div>
      
      <Sidebar activeItem="jobs" />
      <Header />
      
      <main className="flex-1 ml-0 md:ml-[280px] mt-16 md:mt-24 p-margin-mobile md:p-margin-desktop min-h-screen pb-32 max-w-container-max mx-auto w-full">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-stack-xl max-w-3xl mx-auto mt-stack-md">
          <div className="relative inline-block">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2 flex items-center gap-2 justify-center">
                Find Your Next Role
                <span className="material-symbols-outlined text-[#FFB300] text-3xl animate-pulse">spark</span>
            </h2>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant opacity-90 max-w-xl">
              Curated opportunities for every stage of your journey.
          </p>
        </div>

        {/* Search & Filter Cluster */}
        <div className="max-w-[720px] mx-auto mb-stack-xl flex flex-col gap-stack-md">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">search_spark</span>
            </div>
            <input className="w-full pl-12 pr-4 py-4 rounded-full glass-panel search-glow font-body-md text-body-md text-on-surface placeholder:text-outline outline-none transition-all duration-300 focus:bg-white/30" placeholder="Search by role, company, or keyword..." type="text"/>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="px-5 py-2 rounded-full font-label-sm text-label-sm tracking-wide transition-all duration-200 border border-[rgba(255,179,0,0.4)] bg-[rgba(255,179,0,0.15)] text-primary shadow-[0_0_10px_rgba(255,179,0,0.15)] hover:bg-[rgba(255,179,0,0.25)]">
                Remote
            </button>
            <button className="glass-panel px-5 py-2 rounded-full font-label-sm text-label-sm tracking-wide text-on-surface-variant hover:text-primary transition-all duration-200 hover:bg-glass-overlay">
                Flexible Hours
            </button>
            <button className="glass-panel px-5 py-2 rounded-full font-label-sm text-label-sm tracking-wide text-on-surface-variant hover:text-primary transition-all duration-200 hover:bg-glass-overlay flex items-center gap-2">
                Returnship
                <span className="material-symbols-outlined text-[14px]">change_circle</span>
            </button>
            <button className="glass-panel px-5 py-2 rounded-full font-label-sm text-label-sm tracking-wide text-on-surface-variant hover:text-primary transition-all duration-200 hover:bg-glass-overlay">
                Internship
            </button>
            <button className="glass-panel px-5 py-2 rounded-full font-label-sm text-label-sm tracking-wide text-on-surface-variant hover:text-primary transition-all duration-200 hover:bg-glass-overlay">
                Full-Time
            </button>
          </div>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 */}
          <article className="job-card glass-panel rounded-2xl p-6 flex flex-col gap-4 cursor-pointer glass-panel-hover" onClick={() => setModalOpen(true)}>
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border border-surface-variant shadow-sm">
                <img className="w-8 h-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKqbwVCCYryoBa3pG65TuZYFOVqMr7As7uSYxDEtw5uGl4eBnHM0em4GhZdTAqtAO0npmC3vkCpECuCIOnLpV-CFoplySfv3-nVzGTGIMsMt_JwK9__3jq1FAEVG9iJtXQ2tvSChGturkbiMQ922rBw7fmINbBrVoDZ3Y2how5UzwrS3ADLQiHVlEKeZK7ZDFBgjhZjabkCYHtHA8xl00v2Tbl1YUnIGDcExHgxxJFSl7ToX_TZQm4_xUuc6DXLPSTCN8CpXu9Uo4"/>
              </div>
              <button className={`transition-colors p-1 ${bookmarks[1] ? 'text-[#FFB300]' : 'text-outline hover:text-[#FFB300]'}`} onClick={(e) => toggleBookmark(e, 1)}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: bookmarks[1] ? "'FILL' 1" : "'FILL' 0"}}>star</span>
              </button>
            </div>
            <div>
              <h3 className="font-headline-md text-[20px] font-bold text-on-surface mb-1 leading-tight">Senior Frontend Engineer</h3>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/40 border border-white/50 text-[13px] text-on-surface-variant font-medium">
                  Lumina Tech · San Francisco, CA
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[rgba(46,125,50,0.1)] to-[rgba(255,179,0,0.1)] border border-[rgba(46,125,50,0.2)] w-max shadow-[0_0_8px_rgba(46,125,50,0.05)]">
              <span className="material-symbols-outlined text-[14px] text-success-emerald">spark</span>
              <span className="text-[11px] font-bold text-success-emerald tracking-wide uppercase">Women-friendly</span>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 rounded bg-surface-container/50 text-xs text-on-surface-variant font-medium">Senior</span>
              <span className="px-2 py-1 rounded bg-surface-container/50 text-xs text-on-surface-variant font-medium">Remote</span>
            </div>
            <p className="text-[14px] text-on-surface-variant leading-relaxed line-clamp-2 mt-2">
                We are looking for an experienced frontend engineer to lead the development of our next-generation analytics dashboard, focusing on accessibility and performance.
            </p>
            <div className="mt-auto pt-4 border-t border-glass-border">
              <span className="text-xs text-outline font-medium">Posted 2 days ago</span>
            </div>
          </article>

          {/* Card 2 */}
          <article className="job-card glass-panel rounded-2xl p-6 flex flex-col gap-4 cursor-pointer glass-panel-hover" onClick={() => setModalOpen(true)}>
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border border-surface-variant shadow-sm">
                <img className="w-8 h-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGGFwlV3cdL-7a7bGvRn_J7QsgPcUG0tsKc2uxww5irxfzz3rI7YYHsMtf7dB8XKGXdkD6SW4FmPhANKlU9fY42VyDWa97zk1BXdqnZwBXNk60ouh1qoB664rdG66mEn99kNw-1cTQPzc-QDf7Oquri4bJAkWJxxUrKshqbXGE2o3WWR-K1nSO_lQbnR4DrND8MdFGf1ztYW46XTvMAyItQ4ciCA1b82rZGs1W63FrmHY4cP4zbZggJOfeg8q7xdD7Kfbv3_Xksbg"/>
              </div>
              <button className={`transition-colors p-1 ${!bookmarks[2] ? 'text-[#FFB300]' : 'text-outline hover:text-[#FFB300]'}`} onClick={(e) => toggleBookmark(e, 2)}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: !bookmarks[2] ? "'FILL' 1" : "'FILL' 0"}}>star</span>
              </button>
            </div>
            <div>
              <h3 className="font-headline-md text-[20px] font-bold text-on-surface mb-1 leading-tight">Product Marketing Manager</h3>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/40 border border-white/50 text-[13px] text-on-surface-variant font-medium">
                  EcoVentures · New York, NY
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[rgba(46,125,50,0.1)] to-[rgba(255,179,0,0.1)] border border-[rgba(46,125,50,0.2)] w-max shadow-[0_0_8px_rgba(46,125,50,0.05)]">
              <span className="material-symbols-outlined text-[14px] text-success-emerald">spark</span>
              <span className="text-[11px] font-bold text-success-emerald tracking-wide uppercase">Women-friendly</span>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 rounded bg-surface-container/50 text-xs text-on-surface-variant font-medium">Mid-level</span>
              <span className="px-2 py-1 rounded bg-surface-container/50 text-xs text-on-surface-variant font-medium">Hybrid</span>
            </div>
            <p className="text-[14px] text-on-surface-variant leading-relaxed line-clamp-2 mt-2">
                Drive the go-to-market strategy for our sustainable product lines. Collaborate with cross-functional teams to craft compelling messaging that resonates with environmentally conscious consumers.
            </p>
            <div className="mt-auto pt-4 border-t border-glass-border">
              <span className="text-xs text-outline font-medium">Posted 5 hours ago</span>
            </div>
          </article>

          {/* Card 3 */}
          <article className="job-card glass-panel rounded-2xl p-6 flex flex-col gap-4 cursor-pointer glass-panel-hover" onClick={() => setModalOpen(true)}>
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border border-surface-variant shadow-sm">
                <span className="font-headline-md text-primary font-bold text-xl">V</span>
              </div>
              <button className={`transition-colors p-1 ${bookmarks[3] ? 'text-[#FFB300]' : 'text-outline hover:text-[#FFB300]'}`} onClick={(e) => toggleBookmark(e, 3)}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: bookmarks[3] ? "'FILL' 1" : "'FILL' 0"}}>star</span>
              </button>
            </div>
            <div>
              <h3 className="font-headline-md text-[20px] font-bold text-on-surface mb-1 leading-tight">Data Analyst (Returnship)</h3>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/40 border border-white/50 text-[13px] text-on-surface-variant font-medium">
                  Veritas Finance · Chicago, IL
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[rgba(46,125,50,0.1)] to-[rgba(255,179,0,0.1)] border border-[rgba(46,125,50,0.2)] w-max shadow-[0_0_8px_rgba(46,125,50,0.05)]">
              <span className="material-symbols-outlined text-[14px] text-success-emerald">spark</span>
              <span className="text-[11px] font-bold text-success-emerald tracking-wide uppercase">Women-friendly</span>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 rounded bg-[#FFB300]/20 text-xs text-tertiary-container font-bold flex items-center gap-1 border border-[#FFB300]/30"><span className="material-symbols-outlined text-[12px]">change_circle</span> Returnship</span>
              <span className="px-2 py-1 rounded bg-surface-container/50 text-xs text-on-surface-variant font-medium">Remote</span>
            </div>
            <p className="text-[14px] text-on-surface-variant leading-relaxed line-clamp-2 mt-2">
                A 16-week structured program designed for professionals returning to the workforce. Analyze complex datasets and present actionable insights to stakeholders.
            </p>
            <div className="mt-auto pt-4 border-t border-glass-border">
              <span className="text-xs text-outline font-medium">Posted 1 day ago</span>
            </div>
          </article>
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="bg-surface/90 backdrop-blur-xl border border-glass-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-headline-md text-2xl font-bold text-on-surface">Job Description</h2>
                <button className="text-on-surface-variant hover:text-primary" onClick={() => setModalOpen(false)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <p className="text-on-surface-variant mb-6">Full details for this position would load here...</p>
              <button className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold" onClick={() => setModalOpen(false)}>
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
