import React from 'react';

export default function AuthBackground() {
  return (
    <>
      <style>{`
        @keyframes breath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.9;
          }
        }
        .animate-breath {
          animation: breath 8s ease-in-out infinite;
          will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-breath {
            animation: none !important;
            transform: scale(1) !important;
            opacity: 0.8 !important;
          }
        }
      `}</style>
      
      {/* Flat base background color */}
      <div className="fixed inset-0 w-full h-full -z-20 bg-[#FFF7F9]"></div>
      
      {/* Animated glow container */}
      <div className="fixed inset-0 w-full h-full -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="relative flex items-center justify-center w-[80vw] max-w-[800px] aspect-square animate-breath">
          {/* Pink glow */}
          <div className="absolute w-full h-full rounded-full bg-[#F06292]/30 blur-[100px]"></div>
          {/* Orange glow */}
          <div className="absolute w-3/4 h-3/4 rounded-full bg-[#FF9800]/30 blur-[80px]"></div>
          {/* Warm gold glow */}
          <div className="absolute w-1/2 h-1/2 rounded-full bg-[#FFB300]/30 blur-[60px]"></div>
        </div>
      </div>
    </>
  );
}
