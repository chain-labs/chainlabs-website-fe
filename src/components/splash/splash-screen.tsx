"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Code, Terminal, Zap, Cpu } from 'lucide-react';

interface SplashScreenProps {
  onComplete?: () => void;
}

const CODE_LINES = [
  "import { AI } from '@chainlabs/core';",
  "const intelligence = new AI();",
  "function transform(ideas) {",
  "  return intelligence.process(ideas);",
  "}",
  "",
  "// Initializing systems...",
  "intelligence.boot();",
  "console.log('Ready for innovation');",
];

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    // Progress animation over 3 seconds
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 100 / 180; // 60fps over 3 seconds
      });
    }, 16.67); // ~60fps

    // Code line animation
    const lineInterval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= CODE_LINES.length) {
          clearInterval(lineInterval);
          return CODE_LINES.length;
        }
        return prev + 1;
      });
    }, 300);

    // Hide splash screen after 3 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 500); // Wait for fade-out animation
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(lineInterval);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  if (!isVisible) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1419]"
        aria-hidden="true"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#0F1419] via-[#1A1F2E] to-[#0F1419] overflow-hidden"
      role="presentation"
      aria-label="Chain Labs loading screen"
    >
      {/* Minimalist grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,_#334155_1px,_transparent_1px),linear-gradient(180deg,_#334155_1px,_transparent_1px)] bg-[size:100px_100px] opacity-[0.03]" />
      
      {/* Floating code elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute text-[#00D4AA] opacity-10 font-mono text-sm select-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          >
            {['{}', '[]', '()', '<>', '/>', '<=', '=>', '&&', '||', '++'][i % 10]}
          </motion.div>
        ))}
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-6">
        
        {/* Chain Labs Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8 flex items-center justify-center gap-6"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(0, 212, 170, 0.3)',
                '0 0 40px rgba(0, 212, 170, 0.5)',
                '0 0 20px rgba(0, 212, 170, 0.3)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#00D4AA] to-[#00A085] rounded-2xl flex items-center justify-center text-[#0F1419] font-bold text-xl md:text-2xl relative"
          >
            <Code className="w-10 h-10 md:w-12 md:h-12" />
          </motion.div>
          
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-left"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white font-display mb-2">
              Chain Labs
            </h1>
            <div className="flex items-center gap-2 text-[#00D4AA] text-sm md:text-base">
              <Terminal className="w-4 h-4" />
              <span className="font-mono">v2.0.1</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Code editor simulation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-2xl bg-[#1A1F2E]/50 backdrop-blur-sm border border-[#334155]/30 rounded-xl p-6 mb-8"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#334155]/30">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="ml-auto text-[#94A3B8] text-xs font-mono">
              main.ts
            </span>
          </div>
          
          {/* Code content */}
          <div className="text-left font-mono text-sm space-y-1">
            {CODE_LINES.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: index < visibleLines ? 1 : 0,
                  x: index < visibleLines ? 0 : -20,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                }}
                className={`${
                  line.includes('//') 
                    ? 'text-[#94A3B8]' 
                    : line.includes('import') || line.includes('const') || line.includes('function') 
                    ? 'text-[#00D4AA]'
                    : line.includes('console.log')
                    ? 'text-[#F59E0B]'
                    : 'text-white'
                }`}
              >
                {line === '' ? '\u00A0' : line}
                {index === visibleLines - 1 && index < CODE_LINES.length - 1 && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-[#00D4AA]"
                  >
                    |
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Status indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Cpu className="w-5 h-5 text-[#00D4AA]" />
              </motion.div>
              <span className="text-sm text-[#94A3B8]">Processing</span>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Zap className="w-5 h-5 text-[#F59E0B]" />
              </motion.div>
              <span className="text-sm text-[#94A3B8]">Optimizing</span>
            </div>
          </div>
          
          <motion.p 
            className="text-lg text-[#00D4AA] font-medium"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Compiling Intelligence...
          </motion.p>
        </motion.div>
      </div>

      {/* Progress bar at bottom */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-[#252B3A]/80"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-[#00D4AA] to-[#00A085] relative overflow-hidden"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};