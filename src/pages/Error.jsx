import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, AlertTriangle, Sparkles, Compass } from 'lucide-react';

const Error = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: {
      scale: 1.02,
      boxShadow: "0 0 20px rgba(6, 182, 212, 0.25)",
      transition: { type: "spring", stiffness: 400, damping: 15 }
    },
    tap: { scale: 0.98 }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glitchVariants = {
    animate: {
      x: [0, -2, 2, -2, 0],
      opacity: [1, 0.8, 1, 0.8, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(120,119,198,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(120,119,198,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent)'
          }}
        />
        
        {/* Glowing Orbs */}
        <motion.div
          variants={pulseVariants}
          animate="pulse"
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full"
          style={{
            background: 'rgb(6 182 212 / 0.05)',
            filter: 'blur(80px)'
          }}
        />
        <motion.div
          variants={pulseVariants}
          animate="pulse"
          className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full"
          style={{
            background: 'rgb(139 92 246 / 0.05)',
            filter: 'blur(80px)',
            animationDelay: '1s'
          }}
        />

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 backdrop-blur-xl border border-red-500/20">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-300">Error Encountered</span>
          </div>
        </motion.div>

        {/* 404 Number with Glitch Effect */}
        <motion.div variants={itemVariants} className="mb-8 relative">
          {/* Background 404 (blurred) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ filter: 'blur(20px)' }}
          >
            <span 
              className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent opacity-20"
              style={{ lineHeight: 1, letterSpacing: '-0.02em' }}
            >
              404
            </span>
          </motion.div>

          {/* Foreground 404 with glitch */}
          <motion.div
            variants={glitchVariants}
            animate="animate"
            className="relative"
          >
            <h1 
              className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent"
              style={{ lineHeight: 1, letterSpacing: '-0.02em' }}
            >
              404
            </h1>
          </motion.div>

          {/* Floating Icon */}
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <Compass className="w-16 h-16 md:w-24 md:h-24 text-cyan-400/30" />
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 
            className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent"
            style={{ lineHeight: 1.2, letterSpacing: '-0.01em' }}
          >
            Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Oops! The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, we'll help you find your way back.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.a
            href="/"
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            className="w-full sm:w-auto py-4 px-8 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            <span>Go to Homepage</span>
          </motion.a>

          <motion.button
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto py-4 px-8 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-slate-300 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </motion.button>

          <motion.a
            href="/search"
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            className="w-full sm:w-auto py-4 px-8 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-slate-300 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </motion.a>
        </motion.div>

        {/* Error Code Info */}
        <motion.div variants={itemVariants} className="mt-12">
          <p className="text-sm text-slate-500">
            Error Code: <span className="text-cyan-400 font-mono">404_NOT_FOUND</span>
          </p>
          <p className="text-xs text-slate-600 mt-2">
            If you believe this is a mistake, please contact our support team
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Error;