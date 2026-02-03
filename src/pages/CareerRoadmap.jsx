// Career roadmap page with timeline visualization

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Target, Calendar, CheckCircle2, Circle, Loader2 } from 'lucide-react';
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-4">
                        <Map className="w-4 h-4" />
                        Career Planning
                    </div>
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent mb-4">
                        Your Career Roadmap
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Generate a personalized step-by-step plan to achieve your career goals
                    </p>
                </motion.div>

                {/* Input Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 mb-12"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-slate-400 text-sm mb-2">Target Role</label>
                            <input
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="e.g., Senior Full-Stack Developer"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Timeframe</label>
                            <select
                                value={timeframe}
                                onChange={(e) => setTimeframe(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                            >
                                <option value="6 months">6 Months</option>
                                <option value="12 months">12 Months</option>
                                <option value="18 months">18 Months</option>
                                <option value="24 months">24 Months</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={generateRoadmap}
                        disabled={loading}
                        className="mt-6 w-full py-4 bg-gradient-to-r from-cyan-600 to-violet-600 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-violet-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating Roadmap...
                            </>
                        ) : (
                            <>
                                <Target className="w-5 h-5" />
                                Generate Roadmap
                            </>
                        )}
                    </button>
                </motion.div>

                {/* Timeline */}
                <AnimatePresence>
                    {milestones.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative"
                        >
                            {/* Vertical line */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-violet-500 to-transparent" />

                            {/* Milestones */}
                            <div className="space-y-8">
                                {milestones.map((milestone, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative pl-20"
                                    >
                                        {/* Timeline dot */}
                                        <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 border-4 border-slate-900 z-10" />

                                        {/* Milestone card */}
                                        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-xl font-semibold text-white">{milestone.title}</h3>
                                                <div className="flex items-center gap-1 text-slate-400 text-sm">
                                                    <Calendar className="w-4 h-4" />
                                                    {milestone.estimatedDuration}
                                                </div>
                                            </div>

                                            <p className="text-slate-400 mb-4">{milestone.description}</p>

                                            {/* Skills to develop */}
                                            {milestone.skills && milestone.skills.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-slate-300 mb-2">Skills to Develop:</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {milestone.skills.map((skill, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Prerequisites */}
                                            {milestone.prerequisites && milestone.prerequisites.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-slate-300 mb-2">Prerequisites:</h4>
                                                    <ul className="text-sm text-slate-400 space-y-1">
                                                        {milestone.prerequisites.map((prereq, i) => (
                                                            <li key={i} className="flex items-center gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                                {prereq}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Resources */}
                                            {milestone.resources && milestone.resources.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-slate-300 mb-2">Recommended Resources:</h4>
                                                    <ul className="text-sm text-slate-400 space-y-1">
                                                        {milestone.resources.map((resource, i) => (
                                                            <li key={i} className="flex items-center gap-2">
                                                                <Circle className="w-2 h-2 fill-violet-400 text-violet-400" />
                                                                {resource}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {milestones.length === 0 && !loading && (
                    <div className="text-center py-12 text-slate-500">
                        Enter your target role and generate your personalized career roadmap
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareerRoadmap;
