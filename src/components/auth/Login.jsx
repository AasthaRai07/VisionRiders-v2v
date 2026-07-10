'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';

export default function Login({ onBack, onLoginSuccess, onSelectSignUp }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock verification
    setTimeout(() => {
      let registeredUsers = [];
      try {
        const stored = localStorage.getItem('hernova_registered_users');
        if (stored) {
          registeredUsers = JSON.parse(stored);
        }
      } catch (err) {
        console.error('Error reading registered users:', err);
      }

      const matchUser = registeredUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (
        (email.toLowerCase() === 'test@hernova.com' && password === 'password123') ||
        matchUser
      ) {
        const session = { 
          email: email.toLowerCase(), 
          token: 'mock-jwt-token-123',
          fullName: matchUser ? matchUser.fullName : 'Aditi Sharma'
        };
        localStorage.setItem('user_session', JSON.stringify(session));

        // Ensure user profile is set/loaded
        let existingProfile = localStorage.getItem(`hernova_user_profile_${session.email}`);
        if (!existingProfile && session.email === 'test@hernova.com') {
          const defaultProfile = {
            fullName: 'Aditi Sharma',
            email: 'test@hernova.com',
            persona: 'fresher',
            targetRole: 'Product Manager',
            domain: 'FinTech & Consumer Tech',
            resumeUploaded: true,
            resumeFileName: 'Aditi_Sharma_Resume.pdf',
            resumeText: 'Aditi Sharma. Education: B.Tech in Computer Science, IIT Delhi (2020-2024), GPA 9.1/10. Experience: Product Management Intern at FinTech Labs (Summer 2023), where I led the UX redesign of the merchant onboarding portal, conducted 25+ qualitative user interviews, and increased activation rate by 18%. Projects: AI-powered Expense Tracker using React and Python with 1,200 active users. Leadership: Vice President of Entrepreneurship Cell, managed $15,000 budget and organized annual hackathon for 500+ participants.',
            specificData: {
              fresherSkills: ['Product Strategy', 'User Interviews', 'Roadmapping', 'Data Analysis', 'React', 'Python', 'UX Research', 'Agile/Scrum'],
              fresherBlocker: 'Need structured STAR interview practice and executive communication polish'
            }
          };
          localStorage.setItem('hernova_user_profile', JSON.stringify(defaultProfile));
          localStorage.setItem(`hernova_user_profile_${session.email}`, JSON.stringify(defaultProfile));
        } else if (existingProfile) {
          localStorage.setItem('hernova_user_profile', existingProfile);
        }

        setIsLoading(false);
        onLoginSuccess();
      } else {
        setError('Invalid email or password. Try test@hernova.com / password123 or sign up.');
        setIsLoading(false);
      }
    }, 1200);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    setIsResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess('If an account exists for this email, a password reset link has been sent. Please check your inbox.');
      setResetEmail('');
    } catch (err) {
      console.error("Password reset failed", err);
      if (err.code === 'auth/invalid-email') {
        setResetError('Please enter a valid email address.');
      } else if (err.code === 'auth/user-not-found') {
        setResetError('No account found with this email address.');
      } else {
        setResetError(err.message || 'Failed to send reset link. Please try again.');
      }
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      // NOTE: This login_hint parameter suggests/pre-fills the account in Google's chooser,
      // but does NOT force sign-in with that exact email if the user chooses a different one
      // or is not logged in to that Google session in the browser.
      if (email.trim()) {
        provider.setCustomParameters({ login_hint: email.trim() });
      } else {
        provider.setCustomParameters({});
      }
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Store user details in sessionStorage for onboarding extraction
      sessionStorage.setItem('google_auth_info', JSON.stringify({
        fullName: user.displayName || '',
        email: user.email || '',
        isGoogleAuth: true
      }));

      setIsGoogleLoading(false);
      
      // Redirect new Google user to /signup (Persona Selection step)
      router.push('/signup');
    } catch (err) {
      console.error("Google login failed", err);
      setIsGoogleLoading(false);

      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setError('Google sign-in was cancelled.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Firebase Auth. Please verify that localhost is added to the Authorized Domains list in the Firebase Console (Authentication -> Settings).');
      } else if (err.code === 'auth/network-request-failed') {
        setError('A network error occurred. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'Google sign-in failed. Please try again.');
      }
    }
  };

  if (isForgotPassword) {
    return (
      <div className="glass-panel w-full max-w-[420px] rounded-[24px] p-8 animate-fade-up relative overflow-hidden">
        {/* Back button */}
        <button 
          onClick={() => {
            setIsForgotPassword(false);
            setResetError('');
            setResetSuccess('');
          }}
          className="absolute top-4 left-4 text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-label-sm text-label-sm"
          disabled={isResetLoading}
          id="reset-back-btn"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back
        </button>

        <div className="text-center mt-6 mb-8">
          <h2 className="font-serif text-[28px] font-semibold text-on-surface mb-2">Reset Password</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">We'll send you a link to recover your account.</p>
        </div>

        {resetError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 font-body-md text-sm text-center">
            {resetError}
          </div>
        )}

        {resetSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-body-md text-sm text-center">
            {resetSuccess}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleResetPassword}>
          <div className="space-y-2">
            <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="reset-email">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px]">mail</span>
              <input 
                className="glass-input w-full h-12 pl-10 pr-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50" 
                id="reset-email" 
                placeholder="hello@example.com" 
                type="email" 
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required 
                disabled={isResetLoading}
              />
            </div>
          </div>

          <button 
            className="btn-primary w-full h-12 rounded-[14px] font-headline-md text-body-md font-semibold mt-4 flex items-center justify-center gap-2" 
            type="submit"
            disabled={isResetLoading}
            id="reset-submit-btn"
          >
            {isResetLoading ? (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Sending reset link...</span>
              </div>
            ) : (
              <>
                Send Reset Link
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 font-body-md text-on-surface-variant">
          Remember your password?{' '}
          <button 
            className="font-bold text-primary hover:text-[#9b0044] hover:underline decoration-2 underline-offset-4 transition-all bg-transparent border-none p-0 cursor-pointer" 
            onClick={() => {
              setIsForgotPassword(false);
              setResetError('');
              setResetSuccess('');
            }}
            id="back-to-login-btn"
            disabled={isResetLoading}
          >
            Back to Login
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel w-full max-w-[420px] rounded-[24px] p-8 animate-fade-up relative overflow-hidden">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-label-sm text-label-sm"
        id="login-back-btn"
        disabled={isLoading || isGoogleLoading}
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Back
      </button>

      <div className="text-center mt-6 mb-8">
        <h2 className="font-serif text-[28px] font-semibold text-on-surface mb-2">Welcome back</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Your next chapter starts here.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 font-body-md text-sm text-center">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px]">mail</span>
            <input 
              className="glass-input w-full h-12 pl-10 pr-4 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50" 
              id="email" 
              placeholder="hello@example.com" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading || isGoogleLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="password">Password</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px]">lock</span>
            <input 
              className="glass-input w-full h-12 pl-10 pr-10 rounded-[14px] font-body-md text-on-surface placeholder:text-on-surface-variant/50" 
              id="password" 
              placeholder="••••••••" 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={isLoading || isGoogleLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-primary transition-colors flex items-center justify-center p-1 focus:outline-none"
              id="password-toggle-btn"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          <div className="flex justify-end mt-1">
            <a 
              className="font-label-sm text-label-sm text-primary hover:text-[#9b0044] transition-colors" 
              href="#"
              onClick={(e) => { e.preventDefault(); setIsForgotPassword(true); }}
              id="forgot-password-link"
            >
              Forgot password?
            </a>
          </div>
        </div>

        <button 
          className="btn-primary w-full h-12 rounded-[14px] font-headline-md text-body-md font-semibold mt-4 flex items-center justify-center gap-2" 
          type="submit"
          disabled={isLoading || isGoogleLoading}
          id="login-submit-btn"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Logging in...</span>
            </div>
          ) : (
            <>
              Log In
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-glass-border"></div>
          <span className="flex-shrink-0 mx-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">or continue with</span>
          <div className="flex-grow border-t border-glass-border"></div>
        </div>

        <button 
          className="btn-glass w-full h-12 rounded-[14px] font-body-md text-on-surface flex items-center justify-center gap-3 relative" 
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading || isGoogleLoading}
          id="google-login-btn"
        >
          {isGoogleLoading ? (
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              <span>Connecting Google...</span>
            </div>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.78 15.71 17.56V20.33H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"></path>
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.33L15.71 17.56C14.73 18.22 13.48 18.61 12 18.61C9.14 18.61 6.72 16.68 5.83 14.07H2.15V16.92C3.96 20.53 7.69 23 12 23Z" fill="#34A853"></path>
                <path d="M5.83 14.07C5.6 13.41 5.47 12.72 5.47 12C5.47 11.28 5.6 10.59 5.83 9.93V7.08H2.15C1.4 8.57 1 10.23 1 12C1 13.77 1.4 15.43 2.15 16.92L5.83 14.07Z" fill="#FBBC05"></path>
                <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.69 1 3.96 3.47 2.15 7.08L5.83 9.93C6.72 7.32 9.14 5.38 12 5.38Z" fill="#EA4335"></path>
              </svg>
              Google
            </>
          )}
        </button>
      </div>

      <p className="text-center mt-6 font-body-md text-on-surface-variant">
        Don't have an account?{' '}
        <button 
          className="font-bold text-primary hover:text-[#9b0044] hover:underline decoration-2 underline-offset-4 transition-all" 
          onClick={onSelectSignUp}
          id="login-signup-btn"
          disabled={isLoading || isGoogleLoading}
        >
          Sign up
        </button>
      </p>
    </div>
  );
}
