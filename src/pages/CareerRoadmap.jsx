// Career roadmap page with timeline visualization - Enhanced UI

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Target, Calendar, CheckCircle2, Circle, Loader2, Sparkles, TrendingUp, BookOpen, Award } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { generateCareerRoadmap } from '../lib/geminiClient';
import { toast } from 'react-toastify';


const CareerRoadmap = () => {
    const { user, userProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [milestones, setMilestones] = useState([]);
    const [targetRole, setTargetRole] = useState('');
    const [timeframe, setTimeframe] = useState('12 months');

    const generateRoadmap = async () => {
        if (!user || !userProfile) {
            toast.error('Please log in to generate your roadmap');
            return;
        }

        if (!targetRole) {
            toast.error('Please enter a target role');
            return;
        }

        try {
            setLoading(true);
            const roadmapData = await generateCareerRoadmap({
                currentSkills: userProfile.skills || [],
                targetRole,
                timeframe,
                experienceLevel: userProfile.experienceLevel || 'Intermediate',
            });
            setMilestones(roadmapData);
            toast.success('Career roadmap generated!');
        } catch (error) {
            console.error('Roadmap generation error:', error);

            // Fallback to demo data on error
            if (error.message?.includes('404') || error.message?.includes('API')) {
                toast.warning('Using demo roadmap - AI service configuration needed');

                const demoRoadmap = [
                    {
                        title: 'Master Core Fundamentals',
                        description: 'Build a strong foundation in essential technologies and best practices',
                        skills: ['Advanced JavaScript', 'TypeScript', 'Design Patterns', 'Testing (Jest, React Testing Library)'],
                        estimatedDuration: '2 months',
                        prerequisites: ['Basic JavaScript', 'HTML/CSS'],
                        resources: ['JavaScript: The Definitive Guide', 'TypeScript Documentation', 'Frontend Masters']
                    },
                    {
                        title: 'Full-Stack Framework Expertise',
                        description: 'Gain deep knowledge of modern full-stack frameworks and tools',
                        skills: ['React Advanced Patterns', 'Node.js/Express', 'Next.js', 'GraphQL'],
                        estimatedDuration: '3 months',
                        prerequisites: ['JavaScript fundamentals', 'React basics'],
                        resources: ['React Documentation', 'Node.js Best Practices', 'Next.js Tutorial']
                    },
                    {
                        title: 'System Design & Architecture',
                        description: 'Learn to design scalable, maintainable systems',
                        skills: ['Microservices Architecture', 'Database Design', 'Caching Strategies', 'API Design'],
                        estimatedDuration: '2 months',
                        prerequisites: ['Backend development experience'],
                        resources: ['System Design Primer', 'Designing Data-Intensive Applications']
                    },
                    {
                        title: 'DevOps & Cloud Infrastructure',
                        description: 'Master modern deployment and infrastructure management',
                        skills: ['Docker', 'Kubernetes', 'AWS/Azure', 'CI/CD Pipelines'],
                        estimatedDuration: '3 months',
                        prerequisites: ['Linux basics', 'Command line proficiency'],
                        resources: ['Docker Documentation', 'Kubernetes in Action', 'AWS Solutions Architect']
                    },
                    {
                        title: 'Leadership & Mentorship',
                        description: 'Develop soft skills and leadership capabilities',
                        skills: ['Code Review', 'Technical Writing', 'Team Collaboration', 'Project Management'],
                        estimatedDuration: '2 months',
                        prerequisites: ['Team experience'],
                        resources: ['The Manager\'s Path', 'Effective Engineer', 'Clean Code']
                    }
                ];

                setMilestones(demoRoadmap);
            } else {
                toast.error('Failed to generate roadmap');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16 px-6 relative overflow-hidden">
            {/* Ambient background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/3 to-violet-500/3 rounded-full blur-3xl" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-6 shadow-lg shadow-cyan-500/10"
                    >
                        <Map className="w-4 h-4" />
                        <span>Career Planning</span>
                        <Sparkles className="w-3.5 h-3.5" />
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-7xl font-bold bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent mb-6 tracking-tight"
                    >
                        Your Career Roadmap
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed"
                    >
                        Generate a personalized step-by-step plan to achieve your career goals with AI-powered insights
                    </motion.p>
                </motion.div>

                {/* Input Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 mb-16 shadow-2xl shadow-black/20 relative overflow-hidden group"
                >
                    {/* Decorative gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 group/input">
                                <label className="flex items-center gap-2 text-slate-300 text-sm font-medium mb-3">
                                    <Target className="w-4 h-4 text-cyan-400" />
                                    Target Role
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        placeholder="e.g., Senior Full-Stack Developer"
                                        className="w-full bg-slate-800/70 border border-slate-600/50 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all shadow-inner"
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-violet-500/10 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                            </div>
                            
                            <div className="group/select">
                                <label className="flex items-center gap-2 text-slate-300 text-sm font-medium mb-3">
                                    <Calendar className="w-4 h-4 text-violet-400" />
                                    Timeframe
                                </label>
                                <div className="relative">
                                    <select
                                        value={timeframe}
                                        onChange={(e) => setTimeframe(e.target.value)}
                                        className="w-full bg-slate-800/70 border border-slate-600/50 rounded-xl px-5 py-4 text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all appearance-none cursor-pointer shadow-inner"
                                    >
                                        <option value="6 months">6 Months</option>
                                        <option value="12 months">12 Months</option>
                                        <option value="18 months">18 Months</option>
                                        <option value="24 months">24 Months</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            onClick={generateRoadmap}
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            className="mt-8 w-full py-5 bg-gradient-to-r from-cyan-600 via-cyan-500 to-violet-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 text-lg relative overflow-hidden group/button"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 opacity-0 group-hover/button:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex items-center gap-2.5">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Generating Roadmap...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>Generate Roadmap</span>
                                        <TrendingUp className="w-5 h-5" />
                                    </>
                                )}
                            </div>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Timeline */}
                <AnimatePresence mode="wait">
                    {milestones.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative"
                        >
                            {/* Vertical line with gradient */}
                            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-violet-500 to-transparent rounded-full shadow-lg shadow-cyan-500/20" />

                            {/* Milestones */}
                            <div className="space-y-10">
                                {milestones.map((milestone, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ 
                                            delay: index * 0.15,
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 15
                                        }}
                                        className="relative pl-20 group/milestone"
                                    >
                                        {/* Timeline dot with pulse animation */}
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.15 + 0.2, type: "spring" }}
                                            className="absolute left-[18px] top-7 w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 border-4 border-slate-900 z-10 shadow-lg shadow-cyan-500/30"
                                        >
                                            <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20" />
                                        </motion.div>

                                        {/* Milestone number badge */}
                                        <div className="absolute left-5 top-5 w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center z-20">
                                            <span className="text-sm font-bold bg-gradient-to-br from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                                                {index + 1}
                                            </span>
                                        </div>

                                        {/* Milestone card */}
                                        <motion.div 
                                            whileHover={{ scale: 1.01, x: 4 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                            className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-7 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10 transition-all relative overflow-hidden"
                                        >
                                            {/* Decorative corner gradient */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 blur-2xl opacity-0 group-hover/milestone:opacity-100 transition-opacity duration-500" />
                                            
                                            <div className="relative z-10">
                                                <div className="flex items-start justify-between mb-4 gap-4">
                                                    <h3 className="text-2xl font-bold text-white leading-tight flex-1">
                                                        {milestone.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full text-slate-300 text-sm font-medium shadow-inner shrink-0">
                                                        <Calendar className="w-4 h-4 text-cyan-400" />
                                                        {milestone.estimatedDuration}
                                                    </div>
                                                </div>

                                                <p className="text-slate-300 mb-6 leading-relaxed text-base">
                                                    {milestone.description}
                                                </p>

                                                {/* Skills to develop */}
                                                {milestone.skills && milestone.skills.length > 0 && (
                                                    <div className="mb-6">
                                                        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3">
                                                            <Award className="w-4 h-4 text-cyan-400" />
                                                            Skills to Develop
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2.5">
                                                            {milestone.skills.map((skill, i) => (
                                                                <motion.span
                                                                    key={i}
                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    transition={{ delay: index * 0.15 + 0.3 + i * 0.05 }}
                                                                    className="px-4 py-2 bg-gradient-to-r from-cyan-500/15 to-violet-500/15 border border-cyan-500/30 rounded-lg text-cyan-300 text-sm font-medium hover:border-cyan-400/50 hover:bg-cyan-500/20 transition-all cursor-default shadow-sm"
                                                                >
                                                                    {skill}
                                                                </motion.span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Prerequisites */}
                                                {milestone.prerequisites && milestone.prerequisites.length > 0 && (
                                                    <div className="mb-6">
                                                        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                            Prerequisites
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {milestone.prerequisites.map((prereq, i) => (
                                                                <motion.li
                                                                    key={i}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: index * 0.15 + 0.4 + i * 0.05 }}
                                                                    className="flex items-center gap-3 text-sm text-slate-300 bg-slate-700/30 px-4 py-2.5 rounded-lg border border-slate-600/30"
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                                                    <span>{prereq}</span>
                                                                </motion.li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Resources */}
                                                {milestone.resources && milestone.resources.length > 0 && (
                                                    <div>
                                                        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3">
                                                            <BookOpen className="w-4 h-4 text-violet-400" />
                                                            Recommended Resources
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {milestone.resources.map((resource, i) => (
                                                                <motion.li
                                                                    key={i}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: index * 0.15 + 0.5 + i * 0.05 }}
                                                                    className="flex items-center gap-3 text-sm text-slate-300 hover:text-violet-300 transition-colors group/resource"
                                                                >
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 group-hover/resource:bg-violet-300 transition-colors shrink-0" />
                                                                    <span>{resource}</span>
                                                                </motion.li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Success message at the end */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: milestones.length * 0.15 + 0.5 }}
                                className="mt-12 text-center"
                            >
                                <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl">
                                    <Award className="w-5 h-5 text-emerald-400" />
                                    <span className="text-slate-300 font-medium">
                                        Your personalized roadmap to <span className="text-emerald-400 font-semibold">{targetRole}</span> is ready!
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {milestones.length === 0 && !loading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="inline-flex flex-col items-center gap-4 px-8 py-10 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                <Map className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-400 text-lg">
                                Enter your target role and generate your personalized career roadmap
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CareerRoadmap;