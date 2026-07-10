'use client';

import { useRouter } from 'next/navigation';
import AuthChoice from '@/components/auth/AuthChoice';
import AuthBackground from '@/components/auth/AuthBackground';

export default function AuthPage() {
  const router = useRouter();

  return (
    <div className="h-screen m-0 p-0 overflow-hidden font-body-md text-body-md text-on-surface selection:bg-primary-container selection:text-white">
      <AuthBackground />

      {/* Main Content Area */}
      <main className="h-full flex items-center justify-center p-6 md:p-12 relative z-10">
        <AuthChoice 
          onSelectLogin={() => router.push('/login')} 
          onSelectSignUp={() => router.push('/signup')} 
        />
      </main>
    </div>
  );
}
