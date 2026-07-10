'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Route guard: check for user session
    const session = localStorage.getItem('user_session');
    if (!session) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    // Simple parallax effect for ambient particles (if any)
    const handleMouseMove = (e) => {
      const particles = document.getElementById('ambient-particles');
      if (particles) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        particles.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen">
      <Sidebar activeItem="home" />
      <Header />
      
      {/* Main Content Canvas */}
      <main className="md:ml-64 pt-24 md:pt-28 pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative z-10 w-full">
        {/* Header Greeting */}
        <div className="mb-stack-lg">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background flex items-center gap-2">
            Good evening, Aditi <span className="text-tertiary-fixed-dim text-3xl">✪</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Here is your financial and learning snapshot for today.</p>
        </div>
        
        {/* Hero: FinHer Score Widget */}
        <div className="glass-panel rounded-xl p-stack-lg mb-stack-lg nova-glow relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-stack-lg">
          {/* Background Decorative Glow */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl"></div>
          
          <div className="flex-1 z-10">
            <h3 className="font-headline-md text-headline-md text-on-background mb-2">FinHer Score</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-md">Your financial health is strong! You've improved your savings rate this month. Keep up the momentum.</p>
            <div className="flex gap-4">
              <button className="bg-primary text-on-primary hover:bg-opacity-90 font-label-sm text-label-sm py-2 px-6 rounded-full uppercase tracking-wider transition-colors">View Details</button>
              <button className="bg-transparent border border-glass-border text-on-background font-label-sm text-label-sm py-2 px-6 rounded-full uppercase tracking-wider hover:bg-glass-overlay transition-colors">Tips to Improve</button>
            </div>
          </div>
          
          <div className="relative w-48 h-48 flex items-center justify-center z-10">
            {/* Circular Progress Ring */}
            <svg className="w-full h-full" viewBox="0 0 150 150">
              <defs>
                <linearGradient id="amberGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFB300"></stop>
                  <stop offset="100%" stopColor="#ffdeac"></stop>
                </linearGradient>
              </defs>
              <circle cx="75" cy="75" fill="none" r="65" stroke="rgba(141, 111, 117, 0.2)" strokeWidth="8"></circle>
              <circle className="transition-all duration-1000 ease-out" cx="75" cy="75" fill="none" r="65" stroke="url(#amberGradient)" strokeDasharray="408.4" strokeDashoffset="89.8" strokeLinecap="round" strokeWidth="8"></circle>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-headline-lg text-headline-lg text-on-background">78</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">/ 100</span>
            </div>
            {/* Orbiting Particle */}
            <div className="absolute w-full h-full flex items-center justify-center pointer-events-none">
              <svg className="w-3 h-3 text-tertiary-fixed-dim animate-[spin_10s_linear_infinite]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"></path></svg>
            </div>
          </div>
        </div>
        
        {/* Bento Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg mb-stack-lg">
          {/* SafeCircle Widget (Priority High) */}
          <div className="glass-panel rounded-xl p-stack-lg flex flex-col justify-between col-span-1 md:col-span-1 relative overflow-hidden border border-success-emerald/30">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-success-emerald">shield_person</span>
              <h3 className="font-body-lg text-body-lg font-semibold text-on-background">SafeSphere</h3>
            </div>
            <div className="bg-success-emerald/10 border border-success-emerald/20 rounded-full py-1.5 px-3 flex items-center gap-2 w-max mb-6">
              <div className="w-2 h-2 rounded-full bg-success-emerald animate-pulse"></div>
              <span className="font-label-sm text-label-sm text-success-emerald uppercase tracking-wider">Live tracking active</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">Sharing location with 2 trusted contacts.</p>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-glass-border -mr-3">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKRshVAUirsC2AV0LlBtqTqG2l6yJBC4pUMFvshoZheoQK3g2fYvZ55hep4-2rLyrYZk8kN3leJx06LglNcX94iEmIVX5sgE_OSmcrlLMVNjIwWSOzeEsc6oUWT-9-HNc-nRVbYDH41cz3qtqhNojO9U1P5Y_Ra0biRDMssv8msQ03-r43R6YokjazsUugzIL9o7ewCU44EJElNxuK1N1iunbAUgi3M0OOdY6uzfjex5cHVo9JkuMA2PMpmY67WuUHp0ebzc2CMK8"/>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-glass-border">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDws0VtM_i4c6MaiNqCrevm5hINH3ghpMYR6LuRKfCOGknjeDgbCHt2g-1CdCAVx3Or2s0wCIUyIQE69OZRdak9K6oI0q8UW9vx33zvKPa85bjn4ZhzJgKMwCcn-av4ZOznQ6SIu_0J6TgtRN7vTzEDXEAcmZfDCAzE5Vj-Pd81_eh81YgOppycVejDb7D_n-K_2fNqV35QUS-7JXWYUjwaAa3SoAzjbyWKK-q03dTMpGJkdZuuD3rORzYpAeT7f5QYMm8QkVwk7UE"/>
              </div>
            </div>
            <button className="w-full bg-[#FFB300] hover:bg-opacity-90 font-label-sm text-label-sm py-3 px-4 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 cta-glow text-[#3f293b]">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span>Manage Sharing</span>
            </button>
          </div>
          
          {/* Vertical Stack for smaller widgets */}
          <div className="flex flex-col gap-stack-lg col-span-1 md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
              {/* Continue Learning */}
              <div className="glass-panel rounded-xl p-stack-md flex gap-4 items-center cursor-pointer hover:bg-glass-overlay transition-colors">
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA2vC-deUgNW69gA5GeCCY7A5KKLwphGN9fb_9agECdu6ltZwJJGXES_2oVtHvryOaCsm4z6hGF5iqyiPb5RwWIPylFq2BglaNqAAP5RVkZU4UBp9DFmRh3thxQUiPdeuiwm_-NpsShMYqgQFQ9MMCZ9O4cvr49iZVEz7iZiu6dqvSSjco0Mo4hPQIHmQVJKpgWO5bF8CcYZYxXshsEW25bkzr7wXp13XMT2q9EzG1TI09zvHnOuZ72mVJdDFk34PZ8QDNCCsuma0"/>
                </div>
                <div className="flex-1 w-full">
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest block mb-1">Module 3</span>
                  <h4 className="font-body-lg text-body-lg text-on-background mb-2 leading-tight">Basics of Mutual Funds</h4>
                  <div className="w-full bg-surface-variant rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{width: '45%'}}></div>
                  </div>
                </div>
              </div>
              
              {/* Mentor Match */}
              <div className="glass-panel rounded-xl p-stack-md flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-body-lg text-body-lg text-on-background">Mentor Match</h4>
                  <span className="material-symbols-outlined text-tertiary-fixed-dim text-sm">1k</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-4 text-sm">Based on your tech career goals.</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-fixed-dim">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdF-QlM2QFdD4FQmOmqgRcu5EINIhYUaBu29EfgnaSnSpHdrY0K3Q6wlYObUPKjBsvNfQsgiVjyK88UKBYIqrDFHFd6YUbBFZwVDpdAc29E_hKKiL4D5Te8rtRK_8M4SMVz-rmOhl6hRvYxTowtG60rNeQdbnRv14BR0iraqIcYhJwVhbxZStD8BAM-zl1JH1LhqJSrIC2HLwOrHwDMlrIHz7KxMGbeUnK9YyCjasEEFuGNsMV03TPvgbXq8Y885cOmg0c4g_iUW4"/>
                  </div>
                  <div>
                    <p className="font-body-md text-body-md text-on-background font-medium">Priya Sharma</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">VP Engineering</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Savings Goal (Wide Chart Widget) */}
            <div className="glass-panel rounded-xl p-stack-lg flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-body-lg text-body-lg text-on-background">Emergency Fund</h4>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mt-1">Target: ₹1,00,000</p>
                </div>
                <div className="text-right">
                  <p className="font-headline-md text-headline-md text-primary">₹65,400</p>
                </div>
              </div>
              <div className="w-full h-24 mt-auto relative">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#F06292" stopOpacity="0.2"></stop>
                      <stop offset="100%" stopColor="#F06292" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <path d="M0,100 L0,80 Q20,60 40,70 T80,40 L100,20 L100,100 Z" fill="url(#chartGradient)"></path>
                  <path d="M0,80 Q20,60 40,70 T80,40 L100,20" fill="none" stroke="#F06292" strokeLinecap="round" strokeWidth="2"></path>
                  <circle cx="100" cy="20" fill="#FFB300" r="4"></circle>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Success Stories Carousel Header */}
        <div className="mt-stack-xl mb-stack-md flex justify-between items-end">
          <h3 className="font-headline-md text-headline-md text-on-background">Success Stories</h3>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-glass-border flex items-center justify-center text-on-surface-variant hover:bg-glass-overlay"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
            <button className="w-8 h-8 rounded-full border border-glass-border flex items-center justify-center text-on-surface-variant hover:bg-glass-overlay"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
          </div>
        </div>
        
        {/* Carousel Track */}
        <div className="flex gap-stack-lg overflow-x-auto pb-4 snap-x no-scrollbar">
          <div className="glass-panel rounded-xl p-stack-md min-w-[280px] snap-start flex flex-col gap-4">
            <div className="w-full h-32 rounded-lg overflow-hidden">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZUYZjFc7JvODaxXSO-GSacBLJx_Mg0jOV0YfFEgoteqgGRfyU-fSlC6mrVZqsFsB9M70p5WX_ExQTsE7AMYAroo2D0gISrof7GZbnYmwBUs4q7587oku0X1WbJyJKM5cD8QT1T9h4Py59kXUMFpYyTP7W5xpIk8VPYGjZ66GLiPlLEeHxTOjiR2EN84JZHGNGMURoN9loc8w2xkQTVsYCdZer4SBI7iyWEwUcHyBFgdqPYVRLQdEMCoDx97CjYaNTsh_LuG0qAB4"/>
            </div>
            <div>
              <h4 className="font-body-lg text-body-lg font-medium text-on-background mb-1">From Hobby to Bakery</h4>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm line-clamp-3">How Anita used HerNova's micro-loans and mentorship to turn her passion into a thriving business.</p>
            </div>
          </div>
          
          <div className="glass-panel rounded-xl p-stack-md min-w-[280px] snap-start flex flex-col gap-4">
            <div className="w-full h-32 rounded-lg overflow-hidden">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDImEOrA_6zic9S9KsZ09PJt4c-q02yYBO0rg4VcUsk0EsVkm0F3ni9ccnO-5BsdO8CusTpQ6cYvKmBkZYZJDClLSRlAyBup6BB8CqVjY8UkjdubTYoFwi7N3NIMDHve6FQ6k1Pe_Zm7LfoEJ-hVn66xulTQoPWTtOAxxoNRv6RnsMDy8I1-5vyJH5gQ5AFeBJWKF194lvOxd-SJMYF4eIYB0ABbiZuge9i1feooD_-VrXhtfHGGK8Iy8m65UXK9eH4ItEGTetrQx4"/>
            </div>
            <div>
              <h4 className="font-body-lg text-body-lg font-medium text-on-background mb-1">Mastering Investing</h4>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm line-clamp-3">Sarah shares her journey of building an independent portfolio after completing the Advanced Finance module.</p>
            </div>
          </div>
          
          <div className="glass-panel rounded-xl p-stack-md min-w-[280px] snap-start flex flex-col gap-4">
            <div className="w-full h-32 rounded-lg overflow-hidden">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8Uis_QoeTutTmTmQsNcppUQLeDDqIwmr5V25bj2xCmUquMRCl-NqG673OhMPd_5VMUv4YZM4aNSpKuqYqTGg9hgKgrIuveogGK4mChC0XidbB-aWwUUP3GMIjEKjQtNDANylSY2XWTkIxLLevJbJHKbGtyE0P1GRvuLbKXRzfvfgEwDwdfMzx41NCRa3RPtbNfppJ3py7PiaZ_gSFlVtTFGwXIb7plwaE3qXDuDBHnYIpVvXvP24si6UR4Z-UJyTA-iVwN9_9iWs"/>
            </div>
            <div>
              <h4 className="font-body-lg text-body-lg font-medium text-on-background mb-1">Building a Network</h4>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm line-clamp-3">The story of a local community circle that grew into a regional support network for female entrepreneurs.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
