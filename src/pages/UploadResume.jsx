import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Sparkles, CheckCircle2, AlertCircle, Brain, Zap, ArrowRight } from 'lucide-react';

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [error, setError] = useState('');

  // Framer Motion Variants
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay: 0.2
      }
    }
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

  const uploadAreaVariants = {
    idle: { scale: 1, borderColor: "rgb(51, 65, 85)" },
    dragging: {
      scale: 1.02,
      borderColor: "rgb(34, 211, 238)",
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    hasFile: {
      borderColor: "rgba(139, 92, 246, 0.5)",
      transition: { duration: 0.3 }
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

  const iconFloat = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const shimmer = {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.docx'))) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please upload a PDF or DOCX file');
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleAnalyze = () => {
    if (!file) {
      setError('Please upload a resume first');
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const handleReset = () => {
    setFile(null);
    setAnalysisComplete(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
          variants={pulseVariants}
          animate="pulse"
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"
          variants={pulseVariants}
          animate="pulse"
          transition={{ duration: 6, delay: 1, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,119,198,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,119,198,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="relative z-10 container mx-auto px-6 py-16 max-w-5xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm"
            variants={itemVariants}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300 tracking-wide">AI-Powered Analysis</span>
          </motion.div>

          <motion.h1
            className="text-7xl md:text-8xl font-bold mb-6 tracking-tight"
            variants={itemVariants}
          >
            <motion.span
              className="bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent leading-tight block"
              style={{ backgroundSize: "200% auto" }}
              variants={shimmer}
              animate="animate"
            >
              Resume
            </motion.span>
            <motion.span
              className="bg-gradient-to-r from-violet-200 via-cyan-100 to-white bg-clip-text text-transparent leading-tight block"
              style={{ backgroundSize: "200% auto" }}
              variants={shimmer}
              animate="animate"
            >
              Intelligence
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed"
            variants={itemVariants}
          >
            Transform your resume with AI-driven insights. Upload, analyze, and optimize your career story in seconds.
          </motion.p>
        </motion.div>

        {/* Main card */}
        <motion.div
          className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 shadow-2xl overflow-hidden"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {!analysisComplete ? (
            <motion.div className="p-8 md:p-12" key="upload">
              {/* Upload area */}
              <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                  ${isDragging
                    ? 'bg-cyan-500/5'
                    : file
                    ? 'bg-violet-500/5'
                    : 'bg-slate-800/30'
                  }
                `}
                variants={uploadAreaVariants}
                animate={isDragging ? "dragging" : file ? "hasFile" : "idle"}
              >
                <input
                  type="file"
                  id="resume-upload"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />

                {!file ? (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <motion.div
                      className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-slate-700/50"
                      variants={iconFloat}
                      animate="animate"
                    >
                      <Upload className="w-12 h-12 text-cyan-400" />
                    </motion.div>

                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-3">
                        Drop your resume here
                      </h3>
                      <p className="text-slate-400 mb-6 text-lg">
                        or click to browse files
                      </p>

                      <label htmlFor="resume-upload">
                        <motion.div
                          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 rounded-xl font-semibold text-white cursor-pointer transition-all duration-300"
                          whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(6, 182, 212, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Choose File
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </label>
                    </div>

                    <p className="text-sm text-slate-500">
                      Supports PDF and DOCX • Max 10MB
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <motion.div
                      className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/30"
                      initial={{ rotate: -10, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <FileText className="w-12 h-12 text-violet-400" />
                    </motion.div>

                    <div>
                      <motion.h3
                        className="text-2xl font-semibold text-white mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {file.name}
                      </motion.h3>
                      <motion.p
                        className="text-slate-400 text-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {(file.size / 1024).toFixed(2)} KB
                      </motion.p>
                    </div>

                    <motion.button
                      onClick={handleReset}
                      className="text-slate-400 hover:text-white transition-colors underline underline-offset-4"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Choose different file
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="mt-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-300">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action button */}
              <div className="mt-8">
                <motion.button
                  onClick={handleAnalyze}
                  disabled={!file || isAnalyzing}
                  className={`
                    w-full py-5 rounded-xl font-bold text-lg transition-all duration-300
                    ${!file
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      : isAnalyzing
                      ? 'bg-gradient-to-r from-cyan-600 to-violet-600 text-white'
                      : 'bg-gradient-to-r from-cyan-600 to-violet-600 text-white'
                    }
                  `}
                  variants={buttonVariants}
                  whileHover={file && !isAnalyzing ? "hover" : "idle"}
                  whileTap={file && !isAnalyzing ? "tap" : "idle"}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Brain className="w-6 h-6" />
                      </motion.div>
                      <span>Analyzing with AI...</span>
                      <div className="flex gap-1">
                        {[0, 0.2, 0.4].map((delay, i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay }}
                          />
                        ))}
                      </div>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="w-6 h-6" />
                      Analyze Resume
                    </span>
                  )}
                </motion.button>
              </div>

              {/* Features */}
              <motion.div
                className="grid md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-slate-800"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  { icon: Brain, title: 'AI Analysis', desc: 'Deep learning insights' },
                  { icon: Zap, title: 'Instant Results', desc: 'Get feedback in seconds' },
                  { icon: Sparkles, title: 'Smart Suggestions', desc: 'Personalized improvements' }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className="text-center group"
                    variants={itemVariants}
                  >
                    <motion.div
                      className="inline-flex p-4 rounded-xl bg-slate-800/50 group-hover:bg-slate-800 transition-colors mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="w-6 h-6 text-cyan-400" />
                    </motion.div>
                    <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                    <p className="text-slate-500 text-sm">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className="p-8 md:p-12"
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Success state */}
              <div className="text-center space-y-6">
                <motion.div
                  className="inline-flex p-8 rounded-3xl bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/30"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.1 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-green-400" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Analysis Complete!
                  </h2>
                  <p className="text-xl text-slate-400 max-w-md mx-auto">
                    Your resume has been analyzed. Here's what we found:
                  </p>
                </motion.div>

                {/* Mock results */}
                <motion.div
                  className="grid md:grid-cols-2 gap-6 mt-12 text-left"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, borderColor: "rgb(34, 211, 238, 0.3)" }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-green-400">A+</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Overall Score</h3>
                        <p className="text-sm text-slate-400">Excellent resume</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "92%" }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, borderColor: "rgb(139, 92, 246, 0.3)" }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-violet-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">ATS Compatibility</h3>
                        <p className="text-sm text-slate-400">High match rate</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-violet-500 to-pink-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "88%" }}
                        transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 md:col-span-2"
                    variants={itemVariants}
                  >
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-cyan-400" />
                      Key Insights
                    </h3>
                    <ul className="space-y-3">
                      {[
                        'Strong technical skills section with relevant keywords',
                        'Experience descriptions could include more quantifiable achievements',
                        'Consider adding a professional summary at the top'
                      ].map((insight, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-start gap-3 text-slate-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + (idx * 0.1) }}
                        >
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1 + (idx * 0.1), type: "spring" }}
                          />
                          <span>{insight}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>

                <motion.button
                  onClick={handleReset}
                  className="mt-8 px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold text-white transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Upload Another Resume
                </motion.button>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="text-center text-slate-500 mt-8 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Your resume is processed securely and never stored on our servers
        </motion.p>
      </div>
    </div>
  );
}
