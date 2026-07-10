'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Navigate automatically to /auth after 3.8 seconds
    const timer = setTimeout(() => {
      router.push('/auth');
    }, 3800);
    return () => clearTimeout(timer);
  }, [router]);

  const handleSkip = () => {
    router.push('/auth');
  };

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.12,
      }
    }
  };

  const wordVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const taglineWords = ["For", "the", "women,", "by", "the", "women,", "to", "the", "women"];

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 3.3, duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 w-full h-full bg-gradient-to-br from-[#FBEAF0] to-[#F4C0D1] flex flex-col items-center justify-center z-[9999]"
      id="splash-screen"
    >
      <div className="text-center select-none flex flex-col items-center justify-center p-6">
        {/* Woman Silhouette Logo at Center Top */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 drop-shadow-sm"
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4537E" />
                <stop offset="100%" stopColor="#993556" />
              </linearGradient>
              <linearGradient id="flowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2F6" />
                <stop offset="100%" stopColor="#F8BCD0" />
              </linearGradient>
            </defs>
            {/* Silhouette path of a woman facing right */}
            <path 
              d="M45,15 C58,15 67,23 69,32 C70,33 71,33 72,34 C76,37 77,41 75,44 C74,45 73,45 72,45 C75,47 76,50 74,53 C73,55 71,55 69,55 C70,57 69,60 67,61 C64,63 60,63 58,61 C55,67 48,78 48,85 L35,85 C35,76 43,65 41,58 C37,59 33,60 30,58 C25,55 23,48 24,42 C25,32 32,15 45,15 Z" 
              fill="url(#avatarGrad)" 
            />
            {/* Hair bun */}
            <circle cx="31" cy="42" r="14" fill="url(#avatarGrad)" />
            
            {/* Hair flowers details overlay */}
            {/* Flower 1 */}
            <path d="M29,35 L31,38 L34,36 L32,39 L35,41 L32,41 L33,44 L31,42 L29,44 L30,41 L27,41 L30,39 Z" fill="url(#flowerGrad)" stroke="#993556" strokeWidth="0.5" />
            <circle cx="31" cy="40" r="1" fill="#FFFFFF" />
            
            {/* Flower 2 */}
            <path d="M33,43 L35,46 L38,44 L36,47 L39,49 L36,49 L37,52 L35,50 L33,52 L34,49 L31,49 L34,47 Z" fill="url(#flowerGrad)" stroke="#993556" strokeWidth="0.5" />
            <circle cx="35" cy="48" r="1" fill="#FFFFFF" />
          </svg>
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[64px] font-bold text-[#993556] tracking-tight leading-none mb-4"
        >
          HerNova
        </motion.h1>
 
        {/* Tagline using bold uppercase tracking styling */}
        <motion.div 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-[11px] sm:text-[13px] text-[#D4537E] font-black uppercase tracking-[0.25em] mt-3"
        >
          {taglineWords.map((word, idx) => (
            <motion.span 
              key={idx} 
              variants={wordVariants}
              transition={{ delay: 1.2 + idx * 0.08 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Skip button at bottom right */}
      <button 
        onClick={handleSkip}
        className="absolute bottom-8 right-8 text-xs font-semibold text-[#993556]/60 hover:text-[#993556] transition-colors uppercase tracking-widest px-4 py-2 rounded-full border border-[#993556]/20 hover:border-[#993556]/40 bg-white/20 backdrop-blur-sm"
        type="button"
        id="splash-skip-btn"
      >
        Skip
      </button>
    </motion.div>
  );
}
