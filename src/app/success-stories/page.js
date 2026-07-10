'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useState, useEffect } from 'react';

export default function SuccessStories() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Basic Intersection Observer for Staggered Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-8');
            }
        });
    }, { threshold: 0.1 });

    const staggerItems = document.querySelectorAll('.stagger-item');
    staggerItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 100}ms`;
        observer.observe(item);
    });

    return () => {
        staggerItems.forEach(item => observer.unobserve(item));
    };
  }, []);

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .bg-nova-gradient {
            background: linear-gradient(135deg, #FFF3F6 0%, #F3E5F5 100%);
        }
        
        .stagger-item {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
      `}} />

      <Sidebar activeItem="home" />
      <Header />

      <main className="flex-1 ml-0 md:ml-64 p-margin-mobile md:p-margin-desktop pt-24 md:pt-32 overflow-x-hidden w-full max-w-container-max mx-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <header className="mb-12 text-center md:text-left stagger-item">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2 font-bold">Inspiration Starts Here</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto md:mx-0">Discover journeys of resilience, pivot, and triumph. Real stories from the HerNova community to fuel your path forward.</p>
          </header>

          {/* Hero Story Card */}
          <section className="mb-16 stagger-item">
            <div className="glass-panel rounded-[24px] p-6 md:p-12 relative overflow-hidden group">
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-30 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                {/* Hero Portrait */}
                <div className="relative shrink-0">
                  <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white/50 shadow-[0_0_30px_rgba(255,179,0,0.2)] relative z-10">
                    <img alt="Sarah Jenkins" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwefw-L5Rm71IJ0q945QU0MG6pZKj3iH6MBPJ0VMxDpL9yG8d-R-0dswm_UyUxODc--7Mqtc8Oioe76J4Bo36aPfMYNLtmPQBfOKYx9V2QUA6EQdM3Piknn3KKfsi1HIIx0QQDHRNqCv0a2SlgESy1HW9J9cHy7tWDenL4GSjfI3ftO_v2yQyVPdJL-o8d_eqQWbG4xSYh1NAwKVoUCBoGXpdhq_yTy9TLmK8nQuTMbS8YlVUkuGWHqz6B9p0fqp0uq9KMevB1Zy0"/>
                  </div>
                  <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] -z-0 rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="none" r="48" stroke="rgba(194, 24, 91, 0.1)" strokeWidth="1"></circle>
                    <circle className="transition-all duration-1000 group-hover:stroke-dashoffset-50" cx="50" cy="50" fill="none" r="48" stroke="url(#gold-grad)" strokeDasharray="300" strokeDashoffset="150" strokeWidth="2"></circle>
                    <defs>
                      <linearGradient id="gold-grad" x1="0%" x2="100%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFB300"></stop>
                        <stop offset="100%" stopColor="#C2185B"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Hero Content */}
                <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full pt-4">
                  <span className="inline-block px-3 py-1 bg-surface-variant/80 rounded-full font-label-sm text-label-sm text-primary uppercase tracking-widest mb-4 w-max mx-auto md:mx-0">Featured Journey</span>
                  <h3 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-4 leading-tight">
                    "From a 5-Year Career Break to Senior Engineering Lead."
                  </h3>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl">
                    Sarah Jenkins shares how she navigated imposter syndrome, upskilled through the HerNova Career Hub, and reclaimed her professional identity in tech.
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <button className="px-8 py-3 bg-primary text-white rounded-full font-label-sm text-label-sm uppercase tracking-wider font-bold shadow-lg hover:shadow-xl hover:bg-[#9b0044] transition-all" onClick={() => setModalOpen(true)}>
                      Read Her Story
                    </button>
                    <span className="text-on-surface-variant text-sm font-body-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">schedule</span> 5 min read
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section Divider */}
          <div className="flex items-center gap-4 mb-8 stagger-item">
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">More Journeys</h3>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-glass-border to-transparent"></div>
          </div>

          {/* Grid of Stories */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {/* Card 1 */}
            <article className="glass-panel rounded-xl p-6 flex flex-col h-full hover:shadow-[0_10px_40px_rgba(194,24,91,0.08)] transition-all duration-300 stagger-item cursor-pointer group" onClick={() => setModalOpen(true)}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/60">
                  <img alt="Elena R." className="w-full h-full object-cover group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb_uGFeUcm752UNsBKko_PozSE_TgziEtac2Ax5Id0OpvtZ7k_MARrOXHYP0zTQ5tug8zH79DABOzlBrkxvQcnKm8n71iNEdKlY9lo-1-4sfxsf9j066GrH2P1_-sBqlNgxsYxH1LdgRqUYxE1tXsBpoEb3vQ0VokvR-wLmo1IdGd3BzX3WJ_K5wls_kIMlbZHsu1O5Rx7XYrGNOIdvMy0MON5cBvRaIPM0uVC2ze9wBIhHXQoJhFCdsn7NMCRoQUVEQ3qonRrNbg"/>
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md text-base font-bold text-on-surface">Elena R.</h4>
                  <p className="font-label-sm text-label-sm text-primary tracking-wide">First-Gen Founder</p>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant italic mb-6 flex-1">
                "The networking circles here gave me the blueprint I didn't know I needed to launch my own agency."
              </p>
              <div className="flex justify-between items-center border-t border-glass-border pt-4 mt-auto">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Startup</span>
                <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">arrow_forward</span>
              </div>
            </article>

            {/* Card 2 */}
            <article className="glass-panel rounded-xl p-8 flex flex-col h-full hover:shadow-[0_10px_40px_rgba(194,24,91,0.08)] transition-all duration-300 stagger-item cursor-pointer group lg:translate-y-4" onClick={() => setModalOpen(true)}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/60">
                  <img alt="Priya P." className="w-full h-full object-cover group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqTZyJgarCRmZ36JYfZZsVi2I_4mofApKo_ETkcBZ_bmIA-cL9FSv0jAMbpLp4pDyPpVQdhsbOtF_Wlj4L6TvX4qj9-sW-e92zCDDlV4upCHJHXcWsYUbJDG8JnCVPU5WDnLteZTFsxSpV6TjOijQOXMWBboNwMol9SN3ydnOmuPA18jywBpmnNfKFVzBJvN3nJyE_Elf36tPdYT_exjVTJ-Gk7QXqAfOjf2_JZGKSz9KW8H6UhTeL-Gi7TB6wsG6HoN0B6Z47PZs"/>
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md text-base font-bold text-on-surface">Priya P.</h4>
                  <p className="font-label-sm text-label-sm text-primary tracking-wide">Financial Director</p>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant italic mb-6 flex-1 text-lg">
                "Negotiating my worth wasn't natural to me. The resources here completely changed my financial trajectory."
              </p>
              <div className="flex justify-between items-center border-t border-glass-border pt-4 mt-auto">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Finance</span>
                <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">arrow_forward</span>
              </div>
            </article>

            {/* Card 3 */}
            <article className="glass-panel rounded-xl p-6 flex flex-col h-full hover:shadow-[0_10px_40px_rgba(194,24,91,0.08)] transition-all duration-300 stagger-item cursor-pointer group" onClick={() => setModalOpen(true)}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/60">
                  <img alt="Maya T." className="w-full h-full object-cover group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGJN49R2VuYrYQEc2x8NWXK6TCriUhcPwENI1HGsqYc__8JOcw8DyAANDdy19yvIJVuE4E5OE98xmRB9gDjAqNvEWIodXE83-q7QHK1-LiaiAqImC82s0LB36Hd2Nm1I2V9u1rpBPDpLnyRnO_SBdm-MWO39bmXPCtr6DYtOnifBgQ8cE6XzCn5GMp9hNNJgysn-kW3vjMlu6O0cNpkhunzBAV_WvShLjkorMhWadjwmMxSfjIr10SSuzeuWM0iTkaf1cf-gKEXTc"/>
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md text-base font-bold text-on-surface">Maya T.</h4>
                  <p className="font-label-sm text-label-sm text-primary tracking-wide">Creative Director</p>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant italic mb-6 flex-1">
                "Transitioning from freelance to agency leadership was daunting. Finding a mentor through this platform was the key."
              </p>
              <div className="flex justify-between items-center border-t border-glass-border pt-4 mt-auto">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Design</span>
                <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">arrow_forward</span>
              </div>
            </article>
          </section>
        </div>
      </main>

      {/* READING MODAL OVERLAY */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 transition-opacity duration-300 opacity-100 visible">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-surface rounded-2xl md:rounded-[32px] shadow-2xl overflow-hidden flex flex-col transform scale-100 transition-transform duration-300">
            {/* Modal Header / Hero Image */}
            <div className="h-48 md:h-64 w-full relative shrink-0">
              <img alt="Story Banner" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLEYgQCzdsM331XWKxGOHnputKk-PWsRsfa_xvDCZOw-2l8KEpXXrGb-BdLqb4c5aQcRtBalLdiUCcx6ZeLIwEvzHShVfxl15FRo6y1TcnptutBAaiDo2e9M-AallzesHy0fjgvfzQYCW128I94vuY1kdBiSRD39hhdsKQScsiIGykNgRWvswoAR2lTqlbPhWMnPMecN_xVes084hUZx1sKObp606M5RQqRbiTtcKTh6fmarSemnW0tRwQUa6aV3coCY3PDq2nzBE"/>
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
              <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors" onClick={() => setModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12 -mt-16 relative z-10">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img alt="Author" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPy_3-qpGfi9yBroxuvxeg0BfSmQ88XzaVTLmJzqlChTLmA8tdlFObGtIzWuKUyq747gv3O96BgeRGZOrBTyfBUR6ANb4Mu5gRbz9yllfXbmtkFroerjiJ3GkJAz8-GF08IBuu0vHcgxVl-FTqderj9IkCcIxq3EKKAqWQMrAgcwB1xwGF6vuAjwMpUYCJrJ1JfVV-D74je0ieC4z4OkSCoBC0qMAW-_rqkkQRVGRlB5Jf8qt-gpFPeZjKjotb1qARs-rsr7vzPD8"/>
                  </div>
                  <div>
                    <p className="font-headline-md text-headline-md text-base font-bold text-on-surface">Sarah Jenkins</p>
                    <p className="font-label-sm text-label-sm text-primary tracking-wide">Senior Engineering Lead</p>
                  </div>
                </div>
                
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-8 leading-tight">From a 5-Year Career Break to Senior Engineering Lead</h2>
                
                <div className="prose prose-p:font-body-lg prose-p:text-body-lg prose-p:text-on-surface-variant prose-p:leading-relaxed prose-p:mb-6 max-w-none">
                  <p>Stepping away from a rapidly moving tech industry for five years to focus on family felt like hitting a massive "pause" button on my professional identity. When I decided to return, the landscape had changed entirely. React was everywhere, cloud architecture had evolved, and my confidence was at an all-time low.</p>
                  
                  <p className="border-l-4 border-primary pl-6 py-2 my-8 italic text-xl text-on-surface font-medium">
                    "The hardest part wasn't learning the new syntax; it was convincing myself that my non-linear path was an asset, not a liability."
                  </p>
                  
                  <p>I found the HerNova Career Hub during a late-night scroll of frustration. Unlike other platforms that just threw coding exercises at me, this space offered something different: context, mentorship, and a community of women who understood the specific nuances of returning to work.</p>
                  
                  <p>Through the Networking circles, I connected with a mentor who helped me reframe my resume. We stopped hiding my career break and started highlighting the project management and conflict resolution skills I honed while running a household and volunteering. I spent three months intensely upskilling in the Hub, utilizing the safe spaces to ask "stupid" technical questions.</p>
                  
                  <p>Today, I lead a team of twelve engineers. My journey wasn't a straight line, but it's mine. To anyone standing where I was a year ago: your experience is valid, your skills are adaptable, and your next chapter is waiting.</p>
                </div>
                
                {/* Social Sharing Row */}
                <div className="mt-12 pt-8 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Share this story</p>
                  <div className="flex gap-4">
                    <button className="w-10 h-10 rounded-full border border-glass-border flex items-center justify-center text-on-surface-variant hover:text-[#FFB300] hover:border-[#FFB300] hover:shadow-[0_0_10px_rgba(255,179,0,0.3)] transition-all">
                      <span className="material-symbols-outlined text-[20px]">share</span>
                    </button>
                    <button className="w-10 h-10 rounded-full border border-glass-border flex items-center justify-center text-on-surface-variant hover:text-[#FFB300] hover:border-[#FFB300] hover:shadow-[0_0_10px_rgba(255,179,0,0.3)] transition-all">
                      <span className="material-symbols-outlined text-[20px]">link</span>
                    </button>
                    <button className="w-10 h-10 rounded-full border border-glass-border flex items-center justify-center text-on-surface-variant hover:text-[#FFB300] hover:border-[#FFB300] hover:shadow-[0_0_10px_rgba(255,179,0,0.3)] transition-all">
                      <span className="material-symbols-outlined text-[20px]">bookmark</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
