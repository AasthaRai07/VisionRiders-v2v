'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="h-screen m-0 p-0 overflow-hidden font-body-md text-body-md text-on-surface selection:bg-primary-container selection:text-white">
      <style dangerouslySetInnerHTML={{__html: `
        .glass-panel {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 8px 32px 0 rgba(194, 24, 91, 0.05);
        }
        
        .glass-input {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.5);
            transition: all 0.3s ease;
        }
        
        .glass-input:focus {
            outline: none;
            border-color: #FFB300;
            box-shadow: 0 0 0 3px rgba(255, 179, 0, 0.2);
            background: rgba(255, 255, 255, 0.3);
        }

        .btn-primary {
            background-color: #C2185B;
            color: #ffffff;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            box-shadow: 0 0 15px rgba(255, 179, 0, 0.3);
            transform: translateY(-1px);
        }

        .btn-glass {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.8);
            transition: all 0.3s ease;
        }
        
        .btn-glass:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: #ffffff;
        }

        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-up {
            animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .form-section {
            transition: opacity 0.4s ease, transform 0.4s ease;
        }
        
        .form-hidden {
            opacity: 0;
            transform: translateX(20px);
            pointer-events: none;
            position: absolute;
            visibility: hidden;
        }
        
        .form-visible {
            opacity: 1;
            transform: translateX(0);
            position: relative;
            visibility: visible;
        }
      `}} />

      {/* Background Shader */}
      <div className="fixed inset-0 w-full h-full -z-10 bg-gradient-to-br from-[#FFF3F6] to-[#F3E5F5]">
        <div className="absolute inset-0 bg-white/40 mix-blend-overlay"></div>
      </div>

      {/* Main Content Area */}
      <main className="h-full flex items-center justify-center p-6 md:p-12 relative z-10">
        {/* Login Card */}
        <div className="glass-panel w-full max-w-[420px] rounded-[24px] p-8 animate-fade-up opacity-0 relative overflow-hidden">
          {/* Logo / Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-container/10 mb-2 backdrop-blur-sm border border-glass-border">
              <span className="material-symbols-outlined text-primary text-[28px]" style={{fontVariationSettings: "'FILL' 1"}}>stars</span>
            </div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">HerNova</h1>
          </div>

          {/* Dynamic Form Container */}
          <div className="relative overflow-hidden min-h-[400px]">
            {/* LOGIN FORM */}
            <div className={`form-section w-full ${isLogin ? 'form-visible' : 'form-hidden'}`}>
              <div className="text-center mb-8">
                <h2 className="font-serif text-[28px] font-semibold text-on-surface mb-2">Welcome back</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Your next chapter starts here.</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px]">mail</span>
                    <input className="glass-input w-full h-12 pl-10 pr-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50" id="email" placeholder="hello@example.com" type="email" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="password">Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px]">lock</span>
                    <input className="glass-input w-full h-12 pl-10 pr-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50" id="password" placeholder="••••••••" type="password" required />
                  </div>
                  <div className="flex justify-end mt-1">
                    <a className="font-label-sm text-label-sm text-primary hover:text-[#9b0044] transition-colors" href="#">Forgot password?</a>
                  </div>
                </div>

                <button className="btn-primary w-full h-12 rounded-[14px] font-headline-md text-body-md font-semibold mt-4 flex items-center justify-center gap-2" type="submit">
                  Log In
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </form>

              <div className="mt-8 space-y-4">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-glass-border"></div>
                  <span className="flex-shrink-0 mx-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">or continue with</span>
                  <div className="flex-grow border-t border-glass-border"></div>
                </div>

                <button className="btn-glass w-full h-12 rounded-[14px] font-body-md text-on-surface flex items-center justify-center gap-3" type="button">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.78 15.71 17.56V20.33H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"></path>
                    <path d="M12 23C14.97 23 17.46 22.02 19.28 20.33L15.71 17.56C14.73 18.22 13.48 18.61 12 18.61C9.14 18.61 6.72 16.68 5.83 14.07H2.15V16.92C3.96 20.53 7.69 23 12 23Z" fill="#34A853"></path>
                    <path d="M5.83 14.07C5.6 13.41 5.47 12.72 5.47 12C5.47 11.28 5.6 10.59 5.83 9.93V7.08H2.15C1.4 8.57 1 10.23 1 12C1 13.77 1.4 15.43 2.15 16.92L5.83 14.07Z" fill="#FBBC05"></path>
                    <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.69 1 3.96 3.47 2.15 7.08L5.83 9.93C6.72 7.32 9.14 5.38 12 5.38Z" fill="#EA4335"></path>
                  </svg>
                  Google
                </button>
              </div>

              <p className="text-center mt-8 font-body-md text-on-surface-variant">
                Don't have an account?{' '}
                <button className="font-bold text-primary hover:text-[#9b0044] hover:underline decoration-2 underline-offset-4 transition-all" onClick={() => setIsLogin(false)}>Sign up</button>
              </p>
            </div>

            {/* SIGN UP FORM */}
            <div className={`form-section w-full absolute top-0 left-0 h-full flex flex-col justify-between ${!isLogin ? 'form-visible' : 'form-hidden'}`}>
              <div>
                <div className="text-center mb-8">
                  <h2 className="font-serif text-[28px] font-semibold text-on-surface mb-2">Join HerNova</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Begin your journey today.</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="name">Full Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px]">person</span>
                      <input className="glass-input w-full h-12 pl-10 pr-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50" id="name" placeholder="Jane Doe" type="text" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="signup-email">Email Address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px]">mail</span>
                      <input className="glass-input w-full h-12 pl-10 pr-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50" id="signup-email" placeholder="hello@example.com" type="email" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="signup-password">Password</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px]">lock</span>
                      <input className="glass-input w-full h-12 pl-10 pr-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50" id="signup-password" placeholder="••••••••" type="password" required />
                    </div>
                  </div>

                  <button className="bg-[#FFB300] hover:bg-[#FFB300]/90 text-[#320047] w-full h-12 rounded-[14px] font-headline-md text-body-md font-bold mt-4 flex items-center justify-center gap-2 shadow-md transition-all" type="submit">
                    Create Account
                  </button>
                </form>
              </div>

              <p className="text-center mt-8 font-body-md text-on-surface-variant">
                Already have an account?{' '}
                <button className="font-bold text-primary hover:text-[#9b0044] hover:underline decoration-2 underline-offset-4 transition-all" onClick={() => setIsLogin(true)}>Log in</button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
