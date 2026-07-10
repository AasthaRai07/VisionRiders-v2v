'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect } from 'react';

export default function LearningHub() {
  useEffect(() => {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    // Clear existing particles
    container.innerHTML = '';
    
    const particleCount = 15;
    const particles = [];

    // Generate particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        // Simple inline styles for nova-particle to keep it self-contained
        particle.style.position = 'absolute';
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 8px 2px rgba(255, 179, 0, 0.4)';
        
        // Randomize properties
        const size = Math.random() * 4 + 2; // 2px to 6px
        const x = Math.random() * 100; // vw
        const y = Math.random() * 100; // vh
        const depth = Math.random() * 0.5 + 0.1; // parallax depth factor
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}vw`;
        particle.style.top = `${y}vh`;
        
        // Store data for parallax calculation
        particle.dataset.depth = depth;
        particle.dataset.initialY = y;
        
        container.appendChild(particle);
        particles.push(particle);
    }

    // Parallax scroll effect
    const handleScroll = () => {
        const scrolled = window.scrollY;
        particles.forEach(p => {
            const depth = parseFloat(p.dataset.depth);
            const yOffset = scrolled * depth * 0.1; // Slow down the movement
            p.style.transform = `translateY(-${yOffset}px)`;
        });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen">
      <div id="particles-container" className="fixed inset-0 pointer-events-none z-0"></div>
      
      <Sidebar activeItem="learn" />
      <Header />
      
      {/* Main Content Area */}
      <main className="md:ml-64 pt-24 md:pt-28 px-margin-mobile md:px-margin-desktop pb-32 md:pb-12 max-w-container-max mx-auto relative z-10 w-full">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-stack-lg gap-stack-md">
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Learning Hub</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Elevate your skills, one glass step at a time.</p>
          </div>
          <div className="w-full md:w-96 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-xl">temp_preferences_custom</span>
            </div>
            <input className="w-full bg-glass-overlay backdrop-blur-xl border border-glass-border rounded-full py-3 pl-12 pr-4 text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-[#FFB300]/50 focus:border-[#FFB300]/50 transition-all font-body-md text-body-md shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]" placeholder="Search courses, mentors..." type="text"/>
          </div>
        </div>
        
        {/* Filter Chips (Horizontal Scroll) */}
        <div className="mb-stack-xl relative overflow-hidden">
          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-4 pr-8">
            <button className="flex-shrink-0 glass-panel rounded-full px-6 py-2 font-label-sm text-label-sm text-primary-container bg-surface-container-highest border-primary-container/30 transition-all hover:bg-surface-container-high">
              All Courses
            </button>
            <button className="flex-shrink-0 glass-panel rounded-full px-6 py-2 font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all hover:bg-glass-overlay">
              Tech &amp; Data
            </button>
            <button className="flex-shrink-0 glass-panel rounded-full px-6 py-2 font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all hover:bg-glass-overlay">
              Financial Literacy
            </button>
            <button className="flex-shrink-0 glass-panel rounded-full px-6 py-2 font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all hover:bg-glass-overlay">
              Career Skills
            </button>
            <button className="flex-shrink-0 glass-panel rounded-full px-6 py-2 font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all hover:bg-glass-overlay">
              Wellness
            </button>
            <button className="flex-shrink-0 glass-panel rounded-full px-6 py-2 font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all hover:bg-glass-overlay">
              Leadership
            </button>
          </div>
          {/* Fade gradient for scroll */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-bg-gradient-start to-transparent pointer-events-none"></div>
        </div>
        
        {/* Continue Where You Left Off */}
        <section className="mb-stack-xl">
          <div className="flex items-center justify-between mb-stack-md">
            <h3 className="font-headline-md text-headline-md text-on-surface">Continue Learning</h3>
            <span className="material-symbols-outlined text-primary-container cursor-pointer hover:scale-110 transition-transform">arrow_forward</span>
          </div>
          <div className="flex overflow-x-auto no-scrollbar space-x-6 pb-6 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
            {/* Resume Card 1 */}
            <div className="flex-shrink-0 w-80 md:w-96 glass-panel rounded-2xl p-4 flex flex-col hover:shadow-[0_8px_30px_rgba(240,98,146,0.1)] transition-all cursor-pointer group">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-fixed-dim to-primary flex items-center justify-center text-white flex-shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">insights</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-primary mb-1">DATA ANALYTICS</p>
                  <h4 className="font-body-lg text-body-lg text-on-surface line-clamp-2 leading-tight">Introduction to Data Visualisation</h4>
                </div>
              </div>
              <div className="mt-auto">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Module 3 of 8</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">45%</span>
                </div>
                <div className="w-full h-1.5 bg-glass-overlay border border-glass-border rounded-full overflow-hidden relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-[45%] text-[8px] text-[#FFB300] z-10 -ml-1">✦</div>
                  <div className="h-full bg-gradient-to-r from-primary-container to-[#FFB300] rounded-full w-[45%] relative shadow-[0_0_8px_rgba(255,179,0,0.5)]"></div>
                </div>
              </div>
            </div>
            
            {/* Resume Card 2 */}
            <div className="flex-shrink-0 w-80 md:w-96 glass-panel rounded-2xl p-4 flex flex-col hover:shadow-[0_8px_30px_rgba(240,98,146,0.1)] transition-all cursor-pointer group">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary-fixed-dim to-secondary flex items-center justify-center text-white flex-shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">account_balance</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-secondary mb-1">FINANCE</p>
                  <h4 className="font-body-lg text-body-lg text-on-surface line-clamp-2 leading-tight">Negotiating Your First Tech Salary</h4>
                </div>
              </div>
              <div className="mt-auto">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Module 1 of 4</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">80%</span>
                </div>
                <div className="w-full h-1.5 bg-glass-overlay border border-glass-border rounded-full overflow-hidden relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-[80%] text-[8px] text-[#FFB300] z-10 -ml-1">✦</div>
                  <div className="h-full bg-gradient-to-r from-secondary to-[#FFB300] rounded-full w-[80%] relative shadow-[0_0_8px_rgba(255,179,0,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Recommended Courses Grid */}
        <section>
          <div className="flex items-center justify-between mb-stack-md">
            <h3 className="font-headline-md text-headline-md text-on-surface">Recommended for You</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {/* Course Card 1 */}
            <div className="glass-panel rounded-2xl overflow-hidden flex flex-col group hover:shadow-[0_10px_40px_rgba(216,27,96,0.08)] transition-all duration-300">
              <div className="h-40 w-full relative overflow-hidden bg-surface-variant">
                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA5AmL1ris2G6dYw0pCZJdr4wR0JhAhLhnaGFaHfWFcP0bney5UUbVCrZLbkfuVml5RAQaK3bz_XXzQWQZHlGveARG4P3s0nFxAQudzXCNQrUwxqZhcCt40cITYkOWm2ZqF8A5EpBeuDSV4THlZmOqx7HS4AUKa7S7enCaMkBDeX-HLK6AN0VCTtD85Qo1gsLt4HVt79VUmUqtXYxPujebl5b8xGf9adgW3vyNvJ5HJmYuLUTA-HTQ8AvWfYx56GCSwpc69hekggFY')"}}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 to-transparent"></div>
                <div className="absolute top-3 right-3 glass-panel px-3 py-1 rounded-full flex items-center space-x-1">
                  <span className="material-symbols-outlined text-[14px] text-white">schedule</span>
                  <span className="font-label-sm text-label-sm text-white">4h 30m</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <p className="font-label-sm text-label-sm text-primary mb-2">WEB DEVELOPMENT</p>
                <h4 className="font-body-lg text-body-lg font-medium text-on-surface mb-2">Frontend Fundamentals</h4>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-4">Master HTML, CSS, and modern UI principles with this beginner-friendly course.</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-glass-border">
                  <div className="flex -space-x-2">
                    <img alt="Mentor" className="w-6 h-6 rounded-full border border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOp195XlVmvJJoEbU7Kg_C888Tgc7xtKk_3xHfgHTJN7dC61NrO1Bz3A66q1wzGF1cIX_BlZiUdbBZqvWls19KUN6Bu3fFbzPX2sohWmpVYwECoxX8a8h6RN_e2ryaOgFIKZ2iAJpMC-8JhwQ0oI1yUOKT-SKFgxJ2SWiTBu5VBa-_SbtHpSMFM7m1XL4Vd3lkFKfMg_0eWgd-W8UGjhZgYzuieA1wT5FHcwi0ztV2CTIFkjBfzg0OxN1qzDnL5FuO_JVqwYFi3cE"/>
                    <span className="font-label-sm text-label-sm text-on-surface-variant ml-3 flex items-center">By Sarah J.</span>
                  </div>
                  <button className="text-primary-container hover:text-primary transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-glass-overlay">
                    <span className="material-symbols-outlined">bookmark_border</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Course Card 2 */}
            <div className="glass-panel rounded-2xl overflow-hidden flex flex-col group hover:shadow-[0_10px_40px_rgba(216,27,96,0.08)] transition-all duration-300">
              <div className="h-40 w-full relative overflow-hidden bg-surface-variant">
                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA_0DJkIx9TFBPVVY2EeNYqC1yNCI8CZcbBnZKkuA7xBUOHnWG8nVxKq6P_-S9tOb-DwdgO5Dm8cszTuVZAD55vbMG0tr256heytT_YAH2FzD6I3dvQDuo4mFLaHw-wrGnUWEnYih9h1hg0jl6N49xl3kJrXAAMdtVp3TxhO-0JqjAzg9WXDgGTyHk5BvB4CPR6AbqVZMRg6Ry8uzkBdXivYF5E5KlKfqTla9iS0TepIjjhz6hPnJM_iI6dc8uEt5BzfjxF75TMMjs')"}}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 to-transparent"></div>
                <div className="absolute top-3 right-3 glass-panel px-3 py-1 rounded-full flex items-center space-x-1">
                  <span className="material-symbols-outlined text-[14px] text-white">schedule</span>
                  <span className="font-label-sm text-label-sm text-white">2h 15m</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <p className="font-label-sm text-label-sm text-secondary mb-2">CAREER SKILLS</p>
                <h4 className="font-body-lg text-body-lg font-medium text-on-surface mb-2">Imposter Syndrome &amp; You</h4>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-4">Strategies to overcome self-doubt and own your achievements in the workplace.</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-glass-border">
                  <div className="flex -space-x-2">
                    <img alt="Mentor" className="w-6 h-6 rounded-full border border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS1S3iOQtcdT9tvLnlJ7V43geRsmubYM5EJsXgUEq-n7XaYOYnwTdYHFlq9orbXaFoPoUQJcXlZhHsjtvVyJ2zzQvd6_oRmcmxh0wItqBfxebGHPPvtzMFWMWnJpVLFE91JudPSIOFBNYW3hEy2HZ6SoMztrU00P6zbDOlaF1zzie7wjgQLKk7hOSZLNeZhAxFfKfBfpvalpg3wzIH0dp0NwJr2sSOpg_Uf8oScJG6Gunk289gSo8OA2DEC9S4AJKAkl_jRop2jmk"/>
                    <span className="font-label-sm text-label-sm text-on-surface-variant ml-3 flex items-center">By Dr. Chen</span>
                  </div>
                  <button className="text-primary-container hover:text-primary transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-glass-overlay">
                    <span className="material-symbols-outlined">bookmark_border</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Course Card 3 */}
            <div className="glass-panel rounded-2xl overflow-hidden flex flex-col group hover:shadow-[0_10px_40px_rgba(216,27,96,0.08)] transition-all duration-300">
              <div className="h-40 w-full relative overflow-hidden bg-surface-variant">
                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAB_my8-RtoeDAHcXY2i8SNvYvaJqYVcyKaj_IvCiiuy2ORjzmdcMPBgABd0NReVGJErCq7bhUVKt77Y7_DabwLkk9k1YqAHyGKDDqS_tpYsJVlPGcFEehaiGJoye-n9go4eLXcZGiB3JiSuFMC8qETQH4L4FNWYq0ANYz2L8Ic_NsiU-AIlkYyZ7yAHBRhpDXxuJKVBUisZ3NHo2z_nBdgBWlucg_CVho7oS77PHlL-IW7wOg6E4ZyvP8kZ1stCrgQrcgdqTeCf1k')"}}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 to-transparent"></div>
                <div className="absolute top-3 right-3 glass-panel px-3 py-1 rounded-full flex items-center space-x-1">
                  <span className="material-symbols-outlined text-[14px] text-white">schedule</span>
                  <span className="font-label-sm text-label-sm text-white">6h 00m</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <p className="font-label-sm text-label-sm text-tertiary-container mb-2">FINANCIAL LITERACY</p>
                <h4 className="font-body-lg text-body-lg font-medium text-on-surface mb-2">Investing for Beginners</h4>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-4">Demystifying stocks, bonds, and creating a portfolio that works for your goals.</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-glass-border">
                  <div className="flex -space-x-2">
                    <img alt="Mentor" className="w-6 h-6 rounded-full border border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQPOZbtDhmFAa46rh-buGh1pKE-3C2dmCHAHhgI0DVf_BlE98blYdK2IYDUM3dpQ4mg2Q8BuhmJDcMksvGTuGyQ7UJcY1-Kwk7iDhlMbyzpfQBOkHhcVDVMYLZ3h9Se4r6rmwDVVTL0Yu3o9KrEUB41qxJ-1nS6EIfCqtAu8BgCmVFhZEIYY7QvyudC5V424hPkq5eIgVtD48ECaKr-RMwsJ2V0tdSuOmxVkcp9xJpd1CpHoFpn9n6JhU-8DmadP-pTkygTlt4Tac"/>
                    <span className="font-label-sm text-label-sm text-on-surface-variant ml-3 flex items-center">By Elena R.</span>
                  </div>
                  <button className="text-primary-container hover:text-primary transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-glass-overlay">
                    <span className="material-symbols-outlined">bookmark_border</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
