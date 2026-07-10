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
        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[64px] font-bold text-[#993556] tracking-tight leading-none mb-4"
        >
          HerNova
        </motion.h1>

        {/* Tagline using cursive styling */}
        <motion.div 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-[26px] text-[#D4537E] font-medium italic"
          style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}
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
