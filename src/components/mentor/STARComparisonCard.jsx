'use client';

import React from 'react';

export default function STARComparisonCard({ originalAnswer, optimizedAnswer, role }) {
  const orig = originalAnswer || "...I talked to users and realized the onboarding was confusing, so we paused new feature development to fix it.";
  
  return (
    <div className="flex flex-col gap-3 w-full my-2">
      {role && (
        <div className="text-xs font-semibold uppercase tracking-wider text-[#FFB300] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">psychology</span>
          STAR Method Breakdown for {role}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Original Answer */}
        <div className="glass-panel p-5 rounded-xl border-dashed border-white/20 opacity-80 bg-white/5">
          <h4 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-3 font-semibold">Your Original Answer</h4>
          <p className="text-body-md text-sm text-on-surface-variant italic">"{orig}"</p>
        </div>
        
        {/* Optimized Answer */}
        <div className="glass-panel p-5 rounded-xl border border-[#FFB300]/50 bg-white/10 relative overflow-hidden group shadow-md">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#FFB300]/20 rounded-full blur-xl group-hover:bg-[#FFB300]/30 transition-all"></div>
          <h4 className="font-label-sm text-xs text-primary uppercase tracking-wider mb-3 flex items-center gap-2 font-bold">
            <span className="material-symbols-outlined text-sm">auto_awesome</span> AI-Optimized Answer
          </h4>
          {optimizedAnswer ? (
            <p className="text-body-md text-sm text-on-surface relative z-10 font-medium">
              "{optimizedAnswer}"
            </p>
          ) : (
            <p className="text-body-md text-sm text-on-surface relative z-10 font-medium">
              "I <span className="bg-[#FFB300]/30 px-1 rounded relative inline-block text-white">initiated qualitative user interviews<span className="absolute -top-1 -right-1 text-[8px] text-[#FFB300]">✦</span></span> which revealed a 40% drop-off in onboarding. I <span className="bg-[#FFB300]/30 px-1 rounded relative inline-block text-white">realigned the engineering roadmap<span className="absolute -top-1 -right-1 text-[8px] text-[#FFB300]">✦</span></span> to prioritize UX, resulting in a 25% increase in retention."
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
