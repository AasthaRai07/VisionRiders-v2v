import Link from 'next/link';

export default function Sidebar({ activeItem = 'home' }) {
  const navItems = [
    { name: 'Home', icon: 'home', href: '/dashboard', id: 'home' },
    { name: 'Learn', icon: 'school', href: '/learning', id: 'learn' },
    { name: 'Finance', icon: 'payments', href: '/finance', id: 'finance' },
    { name: 'Mentors', icon: 'diversity_3', href: '/mentorship', id: 'mentors' },
    { name: 'Jobs', icon: 'work', href: '/jobs', id: 'jobs' },
    { name: 'Community', icon: 'groups', href: '/community', id: 'community' },
    { name: 'Profile', icon: 'person', href: '/profile', id: 'profile' },
  ];

  return (
    <nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-glass-overlay backdrop-blur-xl border-r border-glass-border shadow-sm flex-col py-stack-lg px-gutter z-50">
      <div className="mb-stack-xl flex items-center justify-between">
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">HerNova</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-80 mt-1">Empowering your future</p>
        </div>
        <img alt="User profile avatar" className="w-10 h-10 rounded-full object-cover border border-glass-border" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD85-POEnnbksBByuY4rJtP88YOB-Z7wAGEw_AIwUyte5ja3_fJ0SgQgHJR6NJj5CIh-7nE2gsEdvGqkQH1C-EXdmwKHTN6N-N1n2VqxxR0VNLOUprHsMcRv_EBRlU7qaqraZ8d1SM1qZ3waA_VhP0ZOu550ODRC-K7fqWH5omMR-4R6xGwGepv-tGBHeY3_SeVcx_z5QhQs2d1UHNHpALvG4bviLjJ9IandXCEC0C07azvxrVMfJdyOHkEAFw3cHgIwNmQpzUEeAI"/>
      </div>
      <ul className="flex flex-col space-y-4 flex-grow">
        {navItems.map((item) => (
          <li key={item.id}>
            <Link 
              href={item.href} 
              className={`flex items-center space-x-3 p-2 rounded-lg font-body-md text-body-md transition-all duration-300 ease-in-out ${
                activeItem === item.id 
                ? "text-primary font-bold relative after:content-['✦'] after:absolute after:-right-2 after:top-0 after:text-[10px] after:text-tertiary-fixed bg-glass-overlay opacity-100"
                : "text-on-surface-variant opacity-70 hover:bg-glass-overlay hover:opacity-100"
              }`}
            >
              <span className={`material-symbols-outlined ${activeItem === item.id ? 'fill' : ''}`}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <button className="w-full bg-[#FFB300] hover:bg-opacity-90 text-[#3f293b] font-body-md text-body-md font-medium py-3 rounded-xl transition-all duration-300 ease-in-out shadow-[0_0_15px_rgba(255,179,0,0.3)] hover:shadow-[0_0_20px_rgba(255,179,0,0.5)]">
          Get Started
        </button>
      </div>
    </nav>
  );
}
