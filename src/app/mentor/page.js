'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getUserContext } from '@/lib/userContext';
import MentorCard from '@/components/mentor/MentorCard';
import STARComparisonCard from '@/components/mentor/STARComparisonCard';

export default function MentorAI() {
  const [userContext, setUserContext] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Load user context and fetch personalized opening greeting
  useEffect(() => {
    const ctx = getUserContext();
    setUserContext(ctx);

    const fetchGreeting = async () => {
      setIsTyping(true);
      try {
        const res = await fetch('/api/mentor/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initGreeting: true, userContext: ctx })
        });
        const data = await res.json();
        setMessages([
          {
            id: 1,
            role: 'ai',
            content: data.reply || `Welcome back, ${ctx.fullName || 'there'}! Let's work together on your career goals.`,
            toolCalls: [],
            fallback: data.fallback || false
          }
        ]);
      } catch (err) {
        console.warn('Error fetching greeting:', err);
        setMessages([
          {
            id: 1,
            role: 'ai',
            content: `Welcome back, ${ctx?.fullName || 'there'}! I experienced a connection delay, but I'm ready to assist you with your career and interview goals.`,
            toolCalls: []
          }
        ]);
      } finally {
        setIsTyping(false);
      }
    };

    fetchGreeting();

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
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (customMessage) => {
    const textToSend = typeof customMessage === 'string' ? customMessage : input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: textToSend.trim(),
      toolCalls: []
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (typeof customMessage !== 'string') setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          userContext
        })
      });

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          content: data.reply || "I'm right here to support your career growth and interview prep!",
          toolCalls: data.toolCalls || [],
          fallback: data.fallback || false
        }
      ]);
    } catch (err) {
      console.warn('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          content: "I ran into a quick network hiccup, but I'm ready for our practice whenever you are!",
          toolCalls: []
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const allMentors = [
    {
      name: 'Elena Rostova',
      role: 'VP of Engineering at FinTech Co.',
      rating: '4.9',
      reviews: '42',
      tags: ['Leadership', 'Tech', 'Negotiation'],
      bio: 'Helping women transition into technical leadership roles and negotiate their worth with confidence.',
      nextAvailable: 'Tomorrow',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ9VxbCGNbO6LSm1_x7B7sOD1up1UonQFS7dyqk7UWOeCUqonKQjSnW2ePKsAg5CcetfuCZ-2ZRHb8ua3huUqpV_2xOLcNtmq1xdkYawgM0lDXVnFnGrtT90ikT7Jf0TJkzfgQ1GqC4QJt3jq39hG_E4pFeoSx-5kuB8VLzeLuM6ytOHUbfshB53RdlgPRkoLtIupmXMY0CnJP9GaGIo9sDhMVCofiCLTd997SQdicshdXS9rnuRr7nGt76SeVduvIysaThx3r5Rs'
    },
    {
      name: 'Sarah Jenkins',
      role: 'Senior Wealth Manager',
      rating: '5.0',
      reviews: '18',
      tags: ['Investing', 'Finance', 'Startups'],
      bio: 'Demystifying personal finance and early-stage startup investing for female founders.',
      nextAvailable: 'Next Week',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Thu9XtcRMvFTCxO86IykdUG4A5BJYNtoMk9q_RbqFhb6CpntC6UB58Fys-SKC_7kybS9eThiXIvfIJeF7CHZEfIPZRSJLvUq5_6GqPCG4sX64-p0qW0InFspauSANSJaBaHjqSRkziZar-LtkqjWjOY6wMwVH_mbEMNpMkXFTDu--vxfPaKgcXtdaa7sPYwjyCIpimhODHDn7t2WecFrWdzRJaztJLst1Z8ulX-M1Is-JwyGzVKnVfkxRs-MyXlZAFdkdtMVW9Q'
    },
    {
      name: 'Maya Patel',
      role: 'Design Director, Agency X',
      rating: '4.8',
      reviews: '89',
      tags: ['UX/UI', 'Portfolio', 'Career Pivot'],
      bio: 'Passionate about helping junior designers refine their portfolios and break into the industry.',
      nextAvailable: 'Today',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8DisgSUhyZfbvR2JvGw9Y-6WwY8sKlWABo3ALBTIBuGVC0u6a9dyRHQDLqWjAPq6LSWUrg93UuQCtrFn1poWJuzZNM03FJgxWk8gkYKxh5sJDeeDCg-wAkdqWUQWnB4q0lu4lhVQrjQFlR2nbrjwnaKUIdqE2W-h_7mTyrxCXWoGN9ZiE5loMY6nTaGVY7Z7z2c8ChmIM57UgK_UpT3l9x3LDZ10h9MlxSqxu-2oO0tJ_D9V1c7lTLLdp3ennW0j_UdimnBEKU8o'
    }
  ];

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
      
      <Sidebar activeItem="mentor" />
      <Header />
      
      <main className="md:ml-64 pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop pb-32 max-w-container-max mx-auto relative z-10 w-full flex flex-col gap-6">
        {/* Header Section */}
        <header className="mb-2 animate-fade-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface flex items-center gap-3 font-bold">
                <span className="text-primary font-serif">✦</span> Nova AI Mentor &amp; Coach
              </h1>
              <p className="font-body-lg text-sm text-on-surface-variant mt-1 opacity-80 max-w-2xl">
                Your unified AI career strategist, mock interview coach, and gateway to top industry mentors.
              </p>
            </div>
            {userContext && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-glass-border px-3.5 py-1.5 rounded-full self-start md:self-auto">
                <span className="material-symbols-outlined text-[#FFB300] text-sm">verified</span>
                <span className="text-xs font-semibold text-on-surface">{userContext.fullName} • {userContext.careerGoal}</span>
              </div>
            )}
          </div>
        </header>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap gap-2 animate-fade-slide-up" style={{animationDelay: '0.15s'}}>
          <button 
            onClick={() => handleSend("I want to practice my STAR method interview answers for my role.")}
            className="glass-panel px-4 py-2 rounded-full font-label-sm text-xs text-on-surface flex items-center gap-2 hover:bg-white/20 transition-all border border-[#FFB300]/40 shadow-sm"
          >
            <span className="material-symbols-outlined text-[#FFB300] text-sm">psychology</span> Practice STAR Interview
          </button>
          <button 
            onClick={() => handleSend("Find me top industry mentors for my career goal.")}
            className="glass-panel px-4 py-2 rounded-full font-label-sm text-xs text-on-surface flex items-center gap-2 hover:bg-white/20 transition-all border border-primary/40 shadow-sm"
          >
            <span className="material-symbols-outlined text-primary text-sm">diversity_3</span> Find Industry Mentors
          </button>
          <button 
            onClick={() => handleSend("Can you review my resume and skills to give me actionable career feedback?")}
            className="glass-panel px-4 py-2 rounded-full font-label-sm text-xs text-on-surface flex items-center gap-2 hover:bg-white/20 transition-all border border-glass-border shadow-sm"
          >
            <span className="material-symbols-outlined text-success-emerald text-sm">auto_awesome</span> Review My Resume
          </button>
        </div>

        {/* Main Chat Interface */}
        <section className="glass-panel rounded-2xl flex flex-col h-[620px] animate-fade-slide-up relative overflow-hidden shadow-lg border border-glass-border" style={{animationDelay: '0.2s'}}>
          {/* Chat Header */}
          <div className="p-4 border-b border-glass-border flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">smart_toy</span>
              </div>
              <div>
                <h3 className="font-headline-md text-sm font-bold text-on-surface flex items-center gap-2">
                  Nova AI Mentor &amp; Coach
                  <span className="text-[10px] bg-[#FFB300]/20 text-[#FFB300] px-2 py-0.5 rounded-full font-bold">AI 3.5</span>
                </h3>
                <p className="font-label-sm text-xs text-success-emerald flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-success-emerald animate-pulse"></span> Active Session
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setMessages(messages.slice(0, 1))}
                className="text-on-surface-variant hover:text-primary transition-colors px-3 py-1 rounded-full text-xs font-medium border border-glass-border hover:bg-white/10"
              >
                Clear Chat
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6" id="chat-container">
            {messages.map((m) => (
              <div key={m.id} className="flex flex-col gap-3 w-full">
                {/* Message Bubble */}
                <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'self-end flex-row-reverse' : ''}`}>
                  {m.role === 'ai' ? (
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-glass-border overflow-hidden flex-shrink-0 mt-1 bg-[#FFB300]/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#FFB300] text-sm">person</span>
                    </div>
                  )}
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    m.role === 'ai' 
                      ? 'bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-tl-sm text-on-surface' 
                      : 'bg-[#FFB300]/20 backdrop-blur-sm border border-[#FFB300]/30 rounded-tr-sm text-on-surface'
                  }`}>
                    {m.fallback && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full mb-2">
                        <span className="material-symbols-outlined" style={{fontSize: '10px'}}>wifi_off</span>
                        Offline mode
                      </span>
                    )}
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-line">{m.content}</p>
                  </div>
                </div>

                {/* Interactive Tool Call Rendering Inside Chat */}
                {m.toolCalls && m.toolCalls.length > 0 && (
                  <div className="w-full pl-12 pr-4 space-y-4">
                    {m.toolCalls.map((tc, tcIdx) => {
                      if (tc.name === 'search_mentors') {
                        const topic = tc.arguments?.topic || '';
                        let displayMentors = allMentors;
                        if (topic.toLowerCase().includes('finance') || topic.toLowerCase().includes('invest')) {
                          displayMentors = [allMentors[1], allMentors[0]];
                        } else if (topic.toLowerCase().includes('design') || topic.toLowerCase().includes('ux')) {
                          displayMentors = [allMentors[2], allMentors[0]];
                        }
                        return (
                          <div key={tcIdx} className="w-full flex flex-col gap-3 my-2">
                            <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm">diversity_3</span>
                              Recommended Mentors for {topic || 'Your Goals'}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {displayMentors.map((mentor, mIdx) => (
                                <MentorCard 
                                  key={mIdx} 
                                  mentor={mentor} 
                                  onConnect={(m) => handleSend(`I would like to schedule a session with mentor ${m.name}.`)} 
                                />
                              ))}
                            </div>
                          </div>
                        );
                      } else if (tc.name === 'start_interview_practice') {
                        const role = tc.arguments?.role || userContext?.careerGoal || 'Product Manager';
                        return (
                          <div key={tcIdx} className="w-full my-2">
                            <STARComparisonCard role={role} />
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-4 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-glass-border px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                  <span className="typing-dot">✦</span>
                  <span className="typing-dot">✦</span>
                  <span className="typing-dot">✦</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-white/5 border-t border-glass-border">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="glass-panel rounded-full p-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#FFB300]/50 transition-shadow bg-white/10"
            >
              <button type="button" className="p-2 rounded-full text-[#FFB300] hover:bg-white/20 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>mic</span>
              </button>
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm md:text-base focus:ring-0 placeholder:text-on-surface-variant/50 focus:outline-none text-on-surface px-2" 
                placeholder="Ask Nova about interview prep, mentorship, or career strategies..." 
                type="text"
                disabled={isTyping}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:shadow-[0_0_15px_rgba(194,24,91,0.4)] transition-all disabled:opacity-50 disabled:hover:shadow-none"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>
        </section>

        {/* Career Readiness / Feedback Meters at Bottom */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 animate-fade-slide-up" style={{animationDelay: '0.4s'}}>
          {/* Clarity */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group border border-glass-border">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h4 className="font-headline-md text-sm font-bold mb-3 text-on-surface z-10 uppercase tracking-wider">STAR Clarity</h4>
            <div className="relative w-28 h-28 z-10">
              <svg className="circular-chart text-[#FFB300] w-full h-full" viewBox="0 0 36 36">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                <path className="circle circle-amber" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray="85, 100"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-headline-lg text-lg text-on-surface font-bold">
                  85<span className="text-xs">%</span>
              </div>
            </div>
          </div>
          
          {/* Confidence */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group border border-glass-border">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h4 className="font-headline-md text-sm font-bold mb-3 text-on-surface z-10 uppercase tracking-wider">Interview Confidence</h4>
            <div className="relative w-28 h-28 z-10">
              <svg className="circular-chart text-[#FFB300] w-full h-full" viewBox="0 0 36 36">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                <path className="circle circle-amber" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray="78, 100"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-headline-lg text-lg text-on-surface font-bold">
                  78<span className="text-xs">%</span>
              </div>
            </div>
          </div>
          
          {/* Technical Accuracy */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group border border-glass-border">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h4 className="font-headline-md text-sm font-bold mb-3 text-on-surface z-10 uppercase tracking-wider">Mentor Network Match</h4>
            <div className="relative w-28 h-28 z-10">
              <svg className="circular-chart text-[#FFB300] w-full h-full" viewBox="0 0 36 36">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                <path className="circle circle-amber" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray="92, 100"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-headline-lg text-lg text-on-surface font-bold">
                  92<span className="text-xs">%</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
