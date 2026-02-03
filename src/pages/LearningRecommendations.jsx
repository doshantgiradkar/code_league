// Learning Recommendations page - personalized course and resource recommendations

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Award, DollarSign, Clock, ExternalLink, Filter, Loader2, Sparkles } from 'lucide-react';
import { RESOURCE_TYPES } from '../lib/constants';
import { toast } from 'react-toastify';

const LearningRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState('all');
    const [targetRole, setTargetRole] = useState('');

    useEffect(() => {
        // Load recommendations on component mount with default query
        if (targetRole.trim()) {
            loadRecommendations();
        }
    }, []);

    const loadRecommendations = async () => {
        if (!targetRole.trim()) {
            toast.error('Please enter a search query');
            return;
        }

        try {
            setLoading(true);
            
            // Fetch learning resources based on target role
            const API_BASE_URL = 'http://localhost:3001/api/gemini';
            const response = await fetch(`${API_BASE_URL}/learning-resources`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchQuery: targetRole,
                    targetRole: targetRole,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch resources');
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error('Failed to fetch learning resources');
            }

            setRecommendations(result.data || []);
            toast.success('Learning resources loaded!');
        } catch (error) {
            console.error('Error loading recommendations:', error);
            toast.error(error.message || 'Failed to load learning resources');

            // Fallback to demo data
            const demoRecommendations = [
                {
                    title: 'Complete React Developer Course',
                    type: 'Online Course',
                    provider: 'Udemy',
                    duration: '40 hours',
                    costEstimate: '$19.99',
                    skillsCovered: ['React', 'Hooks', 'Context API', 'Redux'],
                    relevance: 'Perfect for mastering modern React patterns and state management',
                    difficulty: 'Intermediate',
                    url: 'https://www.udemy.com/course/react-the-complete-guide/'
                },
                {
                    title: 'TypeScript Deep Dive',
                    type: 'Book',
                    provider: 'Basarat Ali Syed',
                    duration: '20 hours',
                    costEstimate: 'Free',
                    skillsCovered: ['TypeScript', 'Type System', 'Advanced Types'],
                    relevance: 'Comprehensive guide to TypeScript from basics to advanced concepts',
                    difficulty: 'Advanced',
                    url: 'https://basarat.gitbook.io/typescript/'
                },
                {
                    title: 'System Design Interview Guide',
                    type: 'Certification',
                    provider: 'Educative',
                    duration: '30 hours',
                    costEstimate: '$79',
                    skillsCovered: ['System Design', 'Scalability', 'Architecture'],
                    relevance: 'Essential for senior-level positions and architectural decisions',
                    difficulty: 'Advanced',
                    url: 'https://www.educative.io/courses/grokking-the-system-design-interview'
                },
                {
                    title: 'Docker & Kubernetes: The Complete Guide',
                    type: 'Online Course',
                    provider: 'Udemy',
                    duration: '22 hours',
                    costEstimate: '$19.99',
                    skillsCovered: ['Docker', 'Kubernetes', 'Container Orchestration'],
                    relevance: 'Industry-standard tools for modern DevOps and deployment',
                    difficulty: 'Intermediate',
                    url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/'
                },
                {
                    title: 'Build a Production-Ready REST API',
                    type: 'Project',
                    provider: 'GitHub',
                    duration: '15 hours',
                    costEstimate: 'Free',
                    skillsCovered: ['Node.js', 'Express', 'PostgreSQL', 'Authentication'],
                    relevance: 'Practical project to build real-world backend skills',
                    difficulty: 'Intermediate',
                    url: 'https://github.com/topics/rest-api-tutorial'
                },
                {
                    title: 'AWS Certified Solutions Architect',
                    type: 'Certification',
                    provider: 'AWS',
                    duration: '40-80 hours',
                    costEstimate: '$150 (exam fee)',
                    skillsCovered: ['AWS', 'Cloud Architecture', 'Security', 'Scalability'],
                    relevance: 'Highly valued certification for cloud infrastructure roles',
                    difficulty: 'Advanced',
                    url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/'
                }
            ];

            setRecommendations(demoRecommendations);
        } finally {
            setLoading(false);
        }
    };

    const getMockRecommendations = () => [
        {
            title: 'Advanced React Patterns',
            type: RESOURCE_TYPES.COURSE,
            provider: 'Frontend Masters',
            duration: '8 hours',
            cost: '$39/month',
            relevance: 'Addresses skill gap in advanced React techniques',
            url: 'https://frontendmasters.com',
        },
        {
            title: 'AWS Certified Solutions Architect',
            type: RESOURCE_TYPES.CERTIFICATION,
            provider: 'Amazon Web Services',
            duration: '3 months',
            cost: '$300',
            relevance: 'Essential for cloud architecture roles',
            url: 'https://aws.amazon.com/certification',
        },
        {
            title: 'Clean Code',
            type: RESOURCE_TYPES.BOOK,
            provider: 'Robert C. Martin',
            duration: '40 hours',
            cost: '$35',
            relevance: 'Improves code quality and best practices',
            url: 'https://www.amazon.com',
        },
        {
            title: 'Build a Full-Stack E-Commerce App',
            type: RESOURCE_TYPES.PROJECT,
            provider: 'Self-guided',
            duration: '2 weeks',
            cost: 'Free',
            relevance: 'Hands-on practice with real-world application',
            url: '#',
        },
    ];

    const filteredRecommendations = selectedType === 'all'
        ? recommendations
        : recommendations.filter(r => r.type === selectedType);

    const getTypeColor = (type) => {
        const colors = {
            [RESOURCE_TYPES.COURSE]: 'from-cyan-500 to-blue-600',
            [RESOURCE_TYPES.CERTIFICATION]: 'from-violet-500 to-purple-600',
            [RESOURCE_TYPES.BOOK]: 'from-orange-500 to-red-600',
            [RESOURCE_TYPES.PROJECT]: 'from-green-500 to-emerald-600',
            [RESOURCE_TYPES.TUTORIAL]: 'from-yellow-500 to-orange-600',
            [RESOURCE_TYPES.BOOTCAMP]: 'from-pink-500 to-rose-600',
            [RESOURCE_TYPES.WORKSHOP]: 'from-indigo-500 to-blue-600',
        };
        return colors[type] || 'from-slate-500 to-slate-600';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-8 h-8 text-cyan-400" />
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent">
                            Learning Recommendations
                        </h1>
                    </div>
                    <p className="text-slate-400 text-lg">
                        Personalized courses, certifications, and resources to close your skill gaps
                    </p>
                </motion.div>

                {/* Target Role Input */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6"
                >
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Target Role
                            </label>
                            <input
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="e.g., Full-Stack Developer, Data Scientist"
                                className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                            />
                        </div>
                        <button
                            onClick={loadRecommendations}
                            disabled={loading}
                            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-violet-600 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-violet-500 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Get Recommendations
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 mb-8 overflow-x-auto pb-2"
                >
                    <button
                        onClick={() => setSelectedType('all')}
                        className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${selectedType === 'all'
                            ? 'bg-gradient-to-r from-cyan-600 to-violet-600 text-white'
                            : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800/50'
                            }`}
                    >
                        All
                    </button>
                    {Object.values(RESOURCE_TYPES).map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${selectedType === type
                                ? 'bg-gradient-to-r from-cyan-600 to-violet-600 text-white'
                                : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800/50'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </motion.div>

                {/* Recommendations Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredRecommendations.map((rec, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group"
                                >
                                    {/* Type Badge */}
                                    <div className="flex gap-2 mb-4">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${getTypeColor(rec.type)} text-white text-sm font-semibold`}>
                                            <BookOpen className="w-4 h-4" />
                                            {rec.type}
                                        </div>
                                        {rec.difficulty && (
                                            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm font-semibold ${
                                                rec.difficulty === 'Beginner' ? 'bg-green-600/50' :
                                                rec.difficulty === 'Intermediate' ? 'bg-yellow-600/50' :
                                                'bg-red-600/50'
                                            }`}>
                                                {rec.difficulty}
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                        {rec.title}
                                    </h3>

                                    {/* Provider */}
                                    <p className="text-cyan-400 text-sm mb-4">{rec.provider}</p>

                                    {/* Relevance */}
                                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                                        {rec.relevance}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="flex flex-wrap gap-4 mb-6 text-sm text-slate-400">
                                        {rec.duration && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {rec.duration}
                                            </div>
                                        )}
                                        {(rec.costEstimate || rec.cost) && (
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                {rec.costEstimate || rec.cost}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <a
                                        href={rec.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800/50 hover:bg-cyan-600/20 border border-slate-700/50 hover:border-cyan-500/50 rounded-xl text-slate-300 hover:text-cyan-400 font-semibold transition-all"
                                    >
                                        <span>View Resource</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {!loading && filteredRecommendations.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">No recommendations found for this filter.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default LearningRecommendations;
