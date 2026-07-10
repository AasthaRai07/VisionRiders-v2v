'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect } from 'react';

export default function InterviewCoach() {
  useEffect(() => {
    // Micro-parallax effect for background particles
    const handleMouseMove = (e) => {
      const particles = document.querySelectorAll('#parallax-bg div');
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      
      particles.forEach((p, index) => {
          const speed = (index + 1) * 20;
          p.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    // Auto-scroll chat to bottom
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulseNova {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        .typing-dot {
            display: inline-block;
            animation: pulseNova 1.5s infinite ease-in-out;
            color: theme('colors.primary');
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        .circular-chart {
            display: block;
            margin: 0 auto;
            max-width: 80%;
            max-height: 250px;
        }
        .circle-bg {
            fill: none;
            stroke: rgba(255, 255, 255, 0.3);
            stroke-width: 3.8;
        }
        .circle {
            fill: none;
            stroke-width: 2.8;
            stroke-linecap: round;
            animation: progress 1s ease-out forwards;
        }
        .circle-amber {
            stroke: #FFB300;
            filter: drop-shadow(0 0 4px rgba(255, 179, 0, 0.5));
        }
        @keyframes progress {
            0% { stroke-dasharray: 0 100; }
        }
        @keyframes fade-slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide-up {
            animation: fade-slide-up 0.6s ease-out forwards;
            opacity: 0;
        }
      `}} />

      {/* Background Particles (Micro-parallax effect container) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" id="parallax-bg">
        <div className="absolute top-20 left-1/4 text-primary opacity-30 text-2xl transition-transform duration-75 ease-out">✦</div>
        <div className="absolute top-1/2 right-1/4 text-[#FFB300] opacity-20 text-4xl transition-transform duration-75 ease-out">✦</div>
        <div className="absolute bottom-20 left-1/3 text-primary opacity-40 text-xl transition-transform duration-75 ease-out">✦</div>
      </div>
      
      <Sidebar activeItem="learn" />
      <Header />
      
      <main className="md:ml-64 pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop pb-32 max-w-container-max mx-auto relative z-10 w-full flex flex-col gap-8">
        {/* Header Section */}
        <header className="mb-6 animate-fade-slide-up" style={{animationDelay: '0.1s'}}>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface flex items-center gap-3 font-bold">
            <span className="nova-star"></span> Practice with Confidence
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 opacity-80 max-w-2xl">
            Private, safe, and tailored to your career path.
          </p>
        </header>

        {/* Main Chat Interface */}
        <section className="glass-panel rounded-2xl flex flex-col h-[600px] animate-fade-slide-up relative overflow-hidden" style={{animationDelay: '0.2s'}}>
          {/* Chat Header */}
          <div className="p-4 border-b border-glass-border flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">smart_toy</span>
              </div>
              <div>
                <h3 className="font-headline-md text-body-lg font-medium">Nova AI Mentor</h3>
                <p className="font-label-sm text-label-sm text-success-emerald flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success-emerald animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button className="text-on-surface-variant hover:text-primary transition-colors px-3 py-1 rounded-full text-label-sm font-label-sm border border-glass-border hover:bg-white/10">
              End Session
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6" id="chat-container">
            {/* AI Message */}
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
              </div>
              <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 p-4 rounded-2xl rounded-tl-sm text-on-surface shadow-sm">
                <p>Welcome! I'm here to help you practice for your upcoming Product Manager interview. Whenever you're ready, let's start with a classic: "Tell me about a time you had to pivot a product strategy based on user feedback."</p>
              </div>
            </div>

            {/* User Message */}
            <div className="flex gap-4 max-w-[80%] self-end flex-row-reverse">
              <div className="w-8 h-8 rounded-full border border-glass-border overflow-hidden flex-shrink-0 mt-1">
                <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEOc5SbDt4EBkQn3nUazo8-cJbyUuywVS62qT3npYf9mZVEaQtUbGpqsn4uf92oOB_41TOrS9R2C01t2im-rKGrbASSlzd0gK4FD-0aW4IuYp5OSqnF7HcyWuvCQFmhUHZ7SrFZGGLCfwA0VZrqGPcJ_8wFltb2qgEMBIIs3T8w2SqCOOea-m5Mbg3uJKUJhYKQzmicBUJlsFjlnh-k2jtZxAtlSqSUd3lq4FvitcOdYo0b3u-DKecADYThjzjMp07bRBSv27anP8"/>
              </div>
              <div className="bg-[#FFB300]/20 backdrop-blur-sm border border-[#FFB300]/30 p-4 rounded-2xl rounded-tr-sm text-on-surface shadow-sm">
                <p>Sure. In my last role, we launched a feature expecting high engagement, but usage was low. I talked to users and realized the onboarding was confusing, so we paused new feature development to fix it.</p>
              </div>
            </div>

            {/* AI Message (Feedback - Gap Reveal Standout Moment) */}
            <div className="flex gap-4 w-full">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
              </div>
              <div className="w-full flex flex-col gap-4">
                <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 p-4 rounded-2xl rounded-tl-sm text-on-surface shadow-sm max-w-[80%]">
                  <p>Good start! You identified the problem and took action. Let's look at how we can elevate that answer using the STAR method to show more leadership and measurable impact.</p>
                </div>
                
                {/* Gap Reveal Component */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-2">
                  {/* Original Answer */}
                  <div className="glass-panel p-5 rounded-xl border-dashed border-white/20 opacity-80">
                    <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-3">Your Original Answer</h4>
                    <p className="text-body-md text-on-surface-variant italic">"...I talked to users and realized the onboarding was confusing, so we paused new feature development to fix it."</p>
                  </div>
                  
                  {/* Optimized Answer */}
                  <div className="glass-panel p-5 rounded-xl border border-[#FFB300]/50 bg-white/10 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#FFB300]/20 rounded-full blur-xl group-hover:bg-[#FFB300]/30 transition-all"></div>
                    <h4 className="font-label-sm text-label-sm text-primary uppercase tracking-wider mb-3 flex items-center gap-2 font-bold">
                      <span className="material-symbols-outlined text-sm">auto_awesome</span> AI-Optimized Answer
                    </h4>
                    <p className="text-body-md text-on-surface relative z-10 font-medium">
                        "I <span className="bg-[#FFB300]/30 px-1 rounded relative inline-block text-white">initiated qualitative user interviews<span className="absolute -top-1 -right-1 text-[8px] text-[#FFB300]">✦</span></span> which revealed a 40% drop-off in onboarding. I <span className="bg-[#FFB300]/30 px-1 rounded relative inline-block text-white">realigned the engineering roadmap<span className="absolute -top-1 -right-1 text-[8px] text-[#FFB300]">✦</span></span> to prioritize UX, resulting in a 25% increase in retention."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Typing Indicator */}
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-glass-border px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                <span className="typing-dot">✦</span>
                <span className="typing-dot">✦</span>
                <span className="typing-dot">✦</span>
              </div>
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-white/5 border-t border-glass-border">
            <div className="glass-panel rounded-full p-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#FFB300]/50 transition-shadow bg-white/10">
              <button className="p-2 rounded-full text-[#FFB300] hover:bg-white/20 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>mic</span>
              </button>
              <input className="flex-1 bg-transparent border-none text-body-md focus:ring-0 placeholder:text-on-surface-variant/50 focus:outline-none text-on-surface" placeholder="Type your response..." type="text"/>
              <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:shadow-[0_0_15px_rgba(194,24,91,0.4)] transition-all">
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        </section>

        {/* Feedback Meters (Bottom) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 animate-fade-slide-up" style={{animationDelay: '0.4s'}}>
          {/* Clarity */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h4 className="font-headline-md text-body-lg mb-4 text-on-surface z-10 font-bold">Clarity</h4>
            <div className="relative w-32 h-32 z-10">
              <svg className="circular-chart text-[#FFB300] w-full h-full" viewBox="0 0 36 36">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                <path className="circle circle-amber" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray="85, 100"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-headline-lg text-headline-md text-on-surface font-bold">
                  85<span className="text-sm">%</span>
              </div>
            </div>
          </div>
          
          {/* Confidence */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h4 className="font-headline-md text-body-lg mb-4 text-on-surface z-10 font-bold">Confidence</h4>
            <div className="relative w-32 h-32 z-10">
              <svg className="circular-chart text-[#FFB300] w-full h-full" viewBox="0 0 36 36">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                <path className="circle circle-amber" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray="72, 100"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-headline-lg text-headline-md text-on-surface font-bold">
                  72<span className="text-sm">%</span>
              </div>
            </div>
          </div>
          
          {/* Technical Accuracy */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h4 className="font-headline-md text-body-lg mb-4 text-on-surface z-10 font-bold">Technical Accuracy</h4>
            <div className="relative w-32 h-32 z-10">
              <svg className="circular-chart text-[#FFB300] w-full h-full" viewBox="0 0 36 36">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                <path className="circle circle-amber" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray="90, 100"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-headline-lg text-headline-md text-on-surface font-bold">
                  90<span className="text-sm">%</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
