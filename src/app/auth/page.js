'use client';

import { useRouter } from 'next/navigation';
import AuthChoice from '@/components/auth/AuthChoice';

export default function AuthPage() {
  const router = useRouter();

  return (
    <div className="h-screen m-0 p-0 overflow-hidden font-body-md text-body-md text-on-surface selection:bg-primary-container selection:text-white">
      {/* Flat Background */}
      <div className="fixed inset-0 w-full h-full -z-10 bg-[#FFF7F9]"></div>

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
