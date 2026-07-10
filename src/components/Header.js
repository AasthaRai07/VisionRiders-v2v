export default function Header() {
  return (
    <header className="hidden md:flex fixed top-0 right-0 left-64 h-20 bg-transparent backdrop-blur-md border-b border-glass-border justify-between items-center px-margin-desktop z-40">
      <div className="flex-grow flex items-center">
        {/* Search Input for Header */}
        <div className="relative w-full max-w-md hidden">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input className="w-full bg-glass-overlay border border-glass-border rounded-xl py-2 pl-10 pr-4 text-body-md font-body-md text-on-surface focus:outline-none focus:border-tertiary-fixed-dim focus:ring-1 focus:ring-tertiary-fixed-dim transition-all placeholder-on-surface-variant" placeholder="Search..." type="text"/>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-on-surface-variant hover:text-primary transition-colors scale-95 active:scale-90 p-2 relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-glass-border">
          <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU-8nPUKPdxKPWaYbRnYyexjOKooYJbKATWI04oWWB7dsMlx2_6D7ba0xesdCI5fKhB9hnw1-5dQS3ruAnQQDuIZS5edMs1oKWm3CGUSwGpGP8E0gm6Z7HYG3lW4cA-HXUSYILwSdCcOr0WkqP-aCTzKxi92M6TUDc2kC0qNDPCGaVsXzCoiMlAwoR2z8CpBmvbY2bzSpuYy_iCcWRk4ZeVxARgta7ffrmdTKsSs_b8taxA8hRtSVVXbln2CPi9-7-4FRB23DPYAw"/>
        </div>
      </div>
    </header>
  );
}
