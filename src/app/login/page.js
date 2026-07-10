'use client';

import { useRouter } from 'next/navigation';
import Login from '@/components/auth/Login';
import AuthBackground from '@/components/auth/AuthBackground';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <div className="h-screen m-0 p-0 overflow-hidden font-body-md text-body-md text-on-surface selection:bg-primary-container selection:text-white">
      <AuthBackground />

      {/* Main Content Area */}
      <main className="h-full flex items-center justify-center p-6 md:p-12 relative z-10">
        <Login 
          onBack={() => router.push('/auth')} 
          onLoginSuccess={handleLoginSuccess}
          onSelectSignUp={() => router.push('/signup')}
        />
      </main>
    </div>
  );
}
