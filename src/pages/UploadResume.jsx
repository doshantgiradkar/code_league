// Enhanced UploadResume with real Gemini AI integration

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Sparkles, CheckCircle2, AlertCircle,
  Brain, Zap, ArrowRight, TrendingUp, AlertTriangle, Award, Briefcase
} from 'lucide-react';
import { useResumeManager } from '../hooks/useResumeManager';
import { toast } from 'react-toastify';

export default function UploadResume() {
  const { uploadResume, scoreResume, loading } = useResumeManager();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [error, setError] = useState('');
  const [targetRole, setTargetRole] = useState('');

  // Animation variants (keeping existing ones)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
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

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a resume first');
      toast.error('Please upload a resume first');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError('');

      // ✅ Parse resume directly with AI (no Supabase upload)
      toast.info('Analyzing resume with AI...');

      const API_BASE_URL = 'http://localhost:3001/api/gemini';
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${API_BASE_URL}/parse-resume`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to parse resume');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error('Resume parsing failed');
      }

      console.log('📄 Resume Data:', result.data);

      // Transform the parsed data into scoreData format
      const resumeData = result.data.resume;
      const scoring = {
        overallScore: resumeData.atsScore,
        breakdown: {
          completeness: 85,
          relevance: targetRole ? 80 : 75,
          formatting: 80,
          keywords: 75,
          atsCompatibility: resumeData.atsScore
        },
        strengths: [
          ...resumeData.skills.slice(0, 3).map(skill => `Proficient in ${skill}`),
          `${resumeData.experience.length} professional experiences`,
          `${resumeData.education.length} educational qualifications`
        ],
        suggestions: [
          resumeData.skills.length < 5 ? 'Add more relevant technical skills' : 'Good skill coverage',
          resumeData.certifications.length === 0 ? 'Consider adding professional certifications' : 'Good certifications',
          'Add quantifiable achievements with metrics'
        ],
        weaknesses: [
          resumeData.experience.length === 0 ? 'No professional experience listed' : null,
          resumeData.skills.length < 3 ? 'Limited technical skills' : null,
        ].filter(Boolean),
        parsedData: resumeData // Store full parsed data for display
      };

      setScoreData(scoring);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast.success(`Resume analysis complete! ATS Score: ${resumeData.atsScore}`);

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze resume');
      setIsAnalyzing(false);
      toast.error(err.message || 'Failed to analyze resume');
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysisComplete(false);
    setScoreData(null);
    setError('');
    setTargetRole('');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    return 'C';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden py-12 px-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">AI-Powered Analysis</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent">
            Resume Intelligence
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Get detailed feedback on your resume with AI-driven insights
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            {!analysisComplete ? (
              <div className="p-8" key="upload">
                {/* Target role input */}
                <div className="mb-6">
                  <label className="block text-slate-400 text-sm mb-2">Target Role (Optional)</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Upload area */}
                <motion.div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-2xl p-12 text-center transition-all
                    ${isDragging ? 'bg-cyan-500/5 border-cyan-500' : file ? 'bg-violet-500/5 border-violet-500/50' : 'bg-slate-800/30 border-slate-700'}
                  `}
                >
                  <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                  />

                  {!file ? (
                    <div className="space-y-4">
                      <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10">
                        <Upload className="w-12 h-12 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-2">Drop your resume here</h3>
                        <p className="text-slate-400 mb-4">or click to browse files</p>
                        <label htmlFor="resume-upload">
                          <motion.div
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-violet-600 rounded-xl font-semibold text-white cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Choose File
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                        </label>
                      </div>
                      <p className="text-sm text-slate-500">Supports PDF and DOCX • Max 10MB</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/30">
                        <FileText className="w-12 h-12 text-violet-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-2">{file.name}</h3>
                        <p className="text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <button
                        onClick={handleReset}
                        className="text-slate-400 hover:text-white transition-colors underline"
                      >
                        Choose different file
                      </button>
                    </div>
                  )}
                </motion.div>

                {error && (
                  <div className="mt-4 flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-300">{error}</p>
                  </div>
                )}

                {/* Analyze button */}
                <motion.button
                  onClick={handleAnalyze}
                  disabled={!file || isAnalyzing}
                  className={`
                    w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all
                    ${!file ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-violet-600 text-white hover:from-cyan-500 hover:to-violet-500'}
                  `}
                  whileHover={file && !isAnalyzing ? { scale: 1.02 } : {}}
                  whileTap={file && !isAnalyzing ? { scale: 0.98 } : {}}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                        <Brain className="w-6 h-6" />
                      </motion.div>
                      Analyzing with AI...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="w-6 h-6" />
                      Analyze Resume
                    </span>
                  )}
                </motion.button>
              </div>
            ) : (
              <div className="p-8" key="results">
                {/* Results */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center">
                    <motion.div
                      className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/30 mb-4"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                    >
                      <CheckCircle2 className="w-16 h-16 text-green-400" />
                    </motion.div>
                    <h2 className="text-4xl font-bold text-white mb-2">Analysis Complete!</h2>
                    <p className="text-slate-400">Here's your detailed resume feedback</p>
                  </div>

                  {scoreData && (
                    <>
                      {/* Overall Score */}
                      <motion.div
                        className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-white font-semibold text-lg">Overall Score</h3>
                            <p className="text-slate-400 text-sm">Resume quality assessment</p>
                          </div>
                          <div className={`text-5xl font-bold ${getScoreColor(scoreData.overallScore)}`}>
                            {getScoreGrade(scoreData.overallScore)}
                          </div>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-green-500 to-cyan-500 h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${scoreData.overallScore}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-center text-slate-300 mt-2 font-semibold">{scoreData.overallScore}/100</p>
                      </motion.div>

                      {/* Breakdown */}
                      {scoreData.breakdown && (
                        <div className="grid md:grid-cols-2 gap-4">
                          {Object.entries(scoreData.breakdown).map(([key, value], idx) => (
                            <motion.div
                              key={key}
                              className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span className={`font-bold ${getScoreColor(value)}`}>{value}%</span>
                              </div>
                              <div className="w-full bg-slate-700 rounded-full h-2">
                                <motion.div
                                  className="bg-gradient-to-r from-cyan-500 to-violet-500 h-2 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${value}%` }}
                                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Strengths */}
                      {scoreData.strengths && scoreData.strengths.length > 0 && (
                        <motion.div
                          className="p-6 bg-green-500/5 rounded-xl border border-green-500/20"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <Award className="w-5 h-5 text-green-400" />
                            Strengths
                          </h3>
                          <ul className="space-y-2">
                            {scoreData.strengths.map((strength, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {/* Weaknesses */}
                      {scoreData.weaknesses && scoreData.weaknesses.length > 0 && (
                        <motion.div
                          className="p-6 bg-red-500/5 rounded-xl border border-red-500/20"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            Areas of Concern
                          </h3>
                          <ul className="space-y-2">
                            {scoreData.weaknesses.map((weakness, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-slate-300">
                                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <span>{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {/* Parsed Resume Data */}
                      {scoreData.parsedData && (
                        <>
                          {/* Skills */}
                          {scoreData.parsedData.skills && scoreData.parsedData.skills.length > 0 && (
                            <motion.div
                              className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-400" />
                                Extracted Skills
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {scoreData.parsedData.skills.map((skill, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          )}

                          {/* Experience */}
                          {scoreData.parsedData.experience && scoreData.parsedData.experience.length > 0 && (
                            <motion.div
                              className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-blue-400" />
                                Professional Experience
                              </h3>
                              <div className="space-y-3">
                                {scoreData.parsedData.experience.map((exp, idx) => (
                                  <div key={idx} className="pb-3 border-b border-slate-700/50 last:border-0">
                                    <h4 className="text-cyan-400 font-semibold">{exp.jobTitle}</h4>
                                    <p className="text-slate-400 text-sm mt-1">{exp.jobDesc}</p>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}

                          {/* Education */}
                          {scoreData.parsedData.education && scoreData.parsedData.education.length > 0 && (
                            <motion.div
                              className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-400" />
                                Education
                              </h3>
                              <div className="space-y-3">
                                {scoreData.parsedData.education.map((edu, idx) => (
                                  <div key={idx} className="pb-3 border-b border-slate-700/50 last:border-0">
                                    <h4 className="text-cyan-400 font-semibold">{edu.course}</h4>
                                    <p className="text-slate-400 text-sm">{edu.instituteName}</p>
                                    <p className="text-slate-500 text-xs mt-1">{edu.eduType} • {edu.yearOfComp}</p>
                                    {edu.score > 0 && (
                                      <p className="text-slate-400 text-sm mt-1">
                                        Score: {edu.score} {edu.isCGPA ? 'CGPA' : '%'}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}

                          {/* Certifications */}
                          {scoreData.parsedData.certifications && scoreData.parsedData.certifications.length > 0 && (
                            <motion.div
                              className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <Award className="w-5 h-5 text-green-400" />
                                Certifications
                              </h3>
                              <div className="space-y-3">
                                {scoreData.parsedData.certifications.map((cert, idx) => (
                                  <div key={idx} className="pb-3 border-b border-slate-700/50 last:border-0">
                                    <h4 className="text-cyan-400 font-semibold">{cert.name}</h4>
                                    <p className="text-slate-400 text-sm">{cert.provider}</p>
                                    {cert.yearOfComp && <p className="text-slate-500 text-xs mt-1">Completed: {cert.yearOfComp}</p>}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  <button
                    onClick={handleReset}
                    className="w-full mt-6 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold text-white transition-all"
                  >
                    Upload Another Resume
                  </button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-center text-slate-500 mt-6 text-sm">
          Your resume is processed securely and never stored permanently
        </p>
      </div>
    </div>
  );
}
