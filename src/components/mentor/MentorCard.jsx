'use client';

import React from 'react';

export default function MentorCard({ mentor, onConnect }) {
  const name = mentor?.name || 'Elena Rostova';
  const role = mentor?.role || mentor?.title || 'VP of Engineering at FinTech Co.';
  const rating = mentor?.rating || '4.9';
  const reviews = mentor?.reviews || '42';
  const tags = mentor?.tags || mentor?.skills || ['Leadership', 'Tech', 'Negotiation'];
  const bio = mentor?.bio || mentor?.description || 'Helping women transition into technical leadership roles and negotiate their worth with confidence.';
  const nextAvailable = mentor?.nextAvailable || 'Tomorrow';
  const avatar = mentor?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ9VxbCGNbO6LSm1_x7B7sOD1up1UonQFS7dyqk7UWOeCUqonKQjSnW2ePKsAg5CcetfuCZ-2ZRHb8ua3huUqpV_2xOLcNtmq1xdkYawgM0lDXVnFnGrtT90ikT7Jf0TJkzfgQ1GqC4QJt3jq39hG_E4pFeoSx-5kuB8VLzeLuM6ytOHUbfshB53RdlgPRkoLtIupmXMY0CnJP9GaGIo9sDhMVCofiCLTd997SQdicshdXS9rnuRr7nGt76SeVduvIysaThx3r5Rs';

  return (
    <div className="glass-panel rounded-xl p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300 w-full bg-white/10 border border-glass-border">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-container rounded-full mix-blend-multiply filter blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
      <div className="flex items-start gap-4 mb-4">
        <img alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm z-10 relative flex-shrink-0" src={avatar} />
        <div className="z-10 relative">
          <h3 className="font-headline-md text-body-lg font-bold text-on-surface">{name}</h3>
          <p className="font-body-md text-sm text-on-surface-variant">{role}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-tertiary-fixed-dim text-[16px]">star</span>
            <span className="font-label-sm text-xs text-on-surface-variant">{rating} ({reviews} reviews)</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4 z-10 relative">
        {tags.map((tag, idx) => (
          <span key={idx} className="bg-white/10 text-on-surface-variant px-2 py-1 rounded-md font-label-sm text-xs border border-white/10">
            {tag}
          </span>
        ))}
      </div>
      <p className="font-body-md text-sm text-on-surface-variant mb-4 line-clamp-2 z-10 relative">
        {bio}
      </p>
      <div className="flex justify-between items-center z-10 relative mt-auto border-t border-glass-border pt-3">
        <span className="font-label-sm text-xs text-primary font-medium">Next available: {nextAvailable}</span>
        <button 
          onClick={() => onConnect && onConnect(mentor)}
          className="bg-[#FFB300] hover:bg-opacity-90 text-[#3f293b] px-4 py-1.5 rounded-lg font-label-sm text-xs uppercase tracking-wider font-bold shadow-md transition-colors"
        >
          Connect
        </button>
      </div>
    </div>
  );
}
