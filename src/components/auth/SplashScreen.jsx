'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Navigate automatically to /auth after 5.5 seconds (increased from 4.5s to accommodate longer animation)
    const timer = setTimeout(() => {
      router.push('/auth');
    }, 5500);
    return () => clearTimeout(timer);
  }, [router]);

  const handleSkip = () => {
    router.push('/auth');
  };

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.10,
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
      transition={{ delay: 5.0, duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 w-full h-full bg-gradient-to-br from-[#FBEAF0] to-[#F4C0D1] flex flex-col items-center justify-center z-[9999]"
      id="splash-screen"
    >
      <div className="text-center select-none flex flex-col items-center justify-center p-6">
        {/* Title — fades/scales in over 1.2s, pauses ~0.4s, then shifts up to -45px */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9, y: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 1],
            scale: [0.9, 1, 1, 1],
            y: [0, 0, 0, -45]
          }}
          transition={{ 
            duration: 2.2,
            times: [0, 0.5, 0.75, 1],
            ease: ["easeOut", "linear", "easeOut"]
          }}
          className="font-serif text-[64px] font-bold text-[#993556] tracking-tight leading-none mb-4"
        >
          HerNova
        </motion.h1>

        {/* Tagline — drastically larger, cursive reveal starts after HerNova shift completes */}
        <motion.div 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-[#D4537E] font-semibold italic"
          style={{ 
            fontFamily: "'Dancing Script', cursive, sans-serif",
            fontSize: "clamp(42px, 8vw, 90px)",
            lineHeight: "1.15",
            letterSpacing: "-0.01em",
            maxWidth: "95vw"
          }}
        >
          {taglineWords.map((word, idx) => (
            <motion.span 
              key={idx} 
              variants={wordVariants}
              transition={{ delay: 2.3 + idx * 0.08 }}
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
