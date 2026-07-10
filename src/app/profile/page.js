'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useState } from 'react';

export default function ProfileSettings() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [digestEnabled, setDigestEnabled] = useState(true);

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        .score-ring {
            background: conic-gradient(from 0deg, theme('colors.tertiary-fixed-dim') 75%, transparent 75%);
            border-radius: 50%;
        }
      `}} />
      
      <Sidebar activeItem="profile" />
      <Header />
      
      <main className="md:ml-64 pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop pb-32 max-w-container-max mx-auto relative z-10 w-full">
        {/* Header Section */}
        <header className="flex flex-col items-center mb-stack-xl relative text-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-stack-md">
            <div className="absolute inset-0 rounded-full score-ring p-1 shadow-[0_0_20px_rgba(255,186,56,0.3)]">
              <div className="w-full h-full rounded-full bg-surface flex items-center justify-center p-1">
                <img className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1DzQkx0PsfN6ekGqSXbugjtniWgsn40DxeNMbDUPEMizw8sKu1Ej2a5zQOS0jUgj2AcPhX_z79bgEzOSmaVgSD5jtvTR9xY49gSdjz8HXKao5yz0wDOvJPPzWEIV93APWboI45mybkKzVz1yqNLRnnBcCtncqb6wqFaSmmOrHe0_7G7a7PCHODfiqBOqtVNcTVyrVV6sqQmWeQauXxUr_rP5Fqor5WEjX9PbRtHU_Lpf7bgzRUVxZ3TnUfsUIADb009hSVf6dSt0"/>
              </div>
            </div>
          </div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-on-surface mb-2">Aditi Sharma</h2>
          <div className="glass-panel px-4 py-1.5 rounded-full mb-6 inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary-fixed-dim text-sm" style={{fontVariationSettings: "'FILL' 1"}}>stars</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">ElevateHer Track</span>
          </div>
          <button className="px-6 py-2 rounded-full border border-glass-border bg-glass-overlay text-on-surface-variant hover:text-tertiary-fixed-dim hover:border-tertiary-fixed-dim hover:shadow-[0_0_15px_rgba(255,186,56,0.3)] transition-all duration-300 font-body-md text-body-md">
              Edit Profile
          </button>
        </header>

        {/* Settings Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Column 1 */}
          <div className="space-y-6">
            {/* Account Details */}
            <section className="glass-panel rounded-xl overflow-hidden p-6">
              <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-stack-md flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">person</span>
                Account Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-glass-border/50 group">
                  <div>
                    <p className="text-sm text-outline-variant">Name</p>
                    <p className="font-body-md text-body-md text-on-surface">Aditi Sharma</p>
                  </div>
                  <button className="text-outline-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-glass-border/50 group">
                  <div>
                    <p className="text-sm text-outline-variant">Email</p>
                    <p className="font-body-md text-body-md text-on-surface">aditi.s@example.com</p>
                  </div>
                  <button className="text-outline-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-glass-border/50 group">
                  <div>
                    <p className="text-sm text-outline-variant">Password</p>
                    <p className="font-body-md text-body-md text-on-surface">••••••••</p>
                  </div>
                  <button className="text-outline-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </div>
                <div className="flex justify-between items-center py-2 group">
                  <div>
                    <p className="text-sm text-outline-variant">Phone</p>
                    <p className="font-body-md text-body-md text-on-surface">+1 (555) 123-4567</p>
                  </div>
                  <button className="text-outline-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Privacy & Safety */}
            <section className="glass-panel rounded-xl overflow-hidden p-6">
              <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-stack-md flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">security</span>
                Privacy &amp; Safety
              </h3>
              <ul className="space-y-1">
                <li>
                  <a className="flex items-center justify-between py-3 hover:bg-white/5 rounded-lg -mx-2 px-2 transition-colors" href="#">
                    <span className="font-body-md text-body-md text-on-surface-variant">Manage Trusted Contacts</span>
                    <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
                  </a>
                </li>
                <li>
                  <a className="flex items-center justify-between py-3 hover:bg-white/5 rounded-lg -mx-2 px-2 transition-colors" href="#">
                    <span className="font-body-md text-body-md text-on-surface-variant">Location Sharing Permissions</span>
                    <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
                  </a>
                </li>
                <li>
                  <a className="flex items-center justify-between py-3 hover:bg-white/5 rounded-lg -mx-2 px-2 transition-colors" href="#">
                    <span className="font-body-md text-body-md text-on-surface-variant">Account Visibility</span>
                    <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
                  </a>
                </li>
              </ul>
            </section>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            {/* Notification Preferences */}
            <section className="glass-panel rounded-xl overflow-hidden p-6">
              <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-stack-md flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">notifications</span>
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="font-body-md text-body-md text-on-surface-variant">Push Notifications</span>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in cursor-pointer" onClick={() => setPushEnabled(!pushEnabled)}>
                    <input checked={pushEnabled} readOnly className={`absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 transition-transform duration-300 ${pushEnabled ? 'translate-x-6 border-primary' : 'border-glass-border'}`} type="checkbox"/>
                    <label className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${pushEnabled ? 'bg-primary' : 'bg-glass-border'}`}></label>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-body-md text-body-md text-on-surface-variant">Email Updates</span>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in cursor-pointer" onClick={() => setEmailEnabled(!emailEnabled)}>
                    <input checked={emailEnabled} readOnly className={`absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 transition-transform duration-300 ${emailEnabled ? 'translate-x-6 border-primary' : 'border-glass-border'}`} type="checkbox"/>
                    <label className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${emailEnabled ? 'bg-primary' : 'bg-glass-border'}`}></label>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-body-md text-body-md text-on-surface-variant">Weekly Digest</span>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in cursor-pointer" onClick={() => setDigestEnabled(!digestEnabled)}>
                    <input checked={digestEnabled} readOnly className={`absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 transition-transform duration-300 ${digestEnabled ? 'translate-x-6 border-primary' : 'border-glass-border'}`} type="checkbox"/>
                    <label className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${digestEnabled ? 'bg-primary' : 'bg-glass-border'}`}></label>
                  </div>
                </div>
              </div>
            </section>

            {/* Learning History & Saved Items Combo */}
            <section className="glass-panel rounded-xl overflow-hidden p-6 space-y-6">
              <div>
                <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-stack-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">history_edu</span>
                  Learning History
                </h3>
                <ul className="space-y-1">
                  <li>
                    <a className="flex items-center gap-3 py-2 hover:text-primary transition-colors text-on-surface-variant group" href="#">
                      <span className="material-symbols-outlined text-outline-variant group-hover:text-primary text-sm">menu_book</span>
                      <span className="font-body-md text-body-md">Completed Courses</span>
                    </a>
                  </li>
                  <li>
                    <a className="flex items-center gap-3 py-2 hover:text-primary transition-colors text-on-surface-variant group" href="#">
                      <span className="material-symbols-outlined text-outline-variant group-hover:text-primary text-sm">workspace_premium</span>
                      <span className="font-body-md text-body-md">Certificates Earned</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="border-t border-glass-border/50 pt-6">
                <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-stack-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">bookmark</span>
                  Saved Items
                </h3>
                <ul className="space-y-1">
                  <li>
                    <a className="flex items-center gap-3 py-2 hover:text-primary transition-colors text-on-surface-variant group" href="#">
                      <span className="material-symbols-outlined text-outline-variant group-hover:text-primary text-sm">work_outline</span>
                      <span className="font-body-md text-body-md">Saved Jobs</span>
                    </a>
                  </li>
                  <li>
                    <a className="flex items-center gap-3 py-2 hover:text-primary transition-colors text-on-surface-variant group" href="#">
                      <span className="material-symbols-outlined text-outline-variant group-hover:text-primary text-sm">person_add</span>
                      <span className="font-body-md text-body-md">Bookmarked Mentors</span>
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            {/* Help & Log Out */}
            <section className="glass-panel rounded-xl overflow-hidden p-6">
              <ul className="space-y-1 mb-6">
                <li>
                  <a className="flex items-center justify-between py-2 hover:text-primary transition-colors text-on-surface-variant group" href="#">
                    <span className="font-body-md text-body-md flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-outline-variant group-hover:text-primary">help_outline</span>
                      Help Center
                    </span>
                  </a>
                </li>
                <li>
                  <a className="flex items-center justify-between py-2 hover:text-primary transition-colors text-on-surface-variant group" href="#">
                    <span className="font-body-md text-body-md flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-outline-variant group-hover:text-primary">mail</span>
                      Contact Us
                    </span>
                  </a>
                </li>
                <li>
                  <a className="flex items-center justify-between py-2 hover:text-primary transition-colors text-on-surface-variant group" href="#">
                    <span className="font-body-md text-body-md flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-outline-variant group-hover:text-primary">policy</span>
                      Privacy Policy
                    </span>
                  </a>
                </li>
              </ul>
              <button className="w-full py-3 rounded-lg border border-[#d6a5b2] text-[#9c5f6e] hover:bg-[#fff0f4] transition-colors font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">logout</span>
                Log Out
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
