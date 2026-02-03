// Main learner dashboard with analytics and visualizations

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, FileText, Award } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ReadinessGauge from '../components/ReadinessGauge';
import ProfileCompletion from '../components/ProfileCompletion';
import SkillRadarChart from '../components/SkillRadarChart';

const SkillDashboard = () => {
    const { userProfile } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalSkills: 0,
        resumeScore: 0,
        readinessScore: 0,
        skillGapsCount: 0,
    });

    useEffect(() => {
        if (userProfile) {
            setStats({
                totalSkills: userProfile.skills?.length || 0,
                resumeScore: userProfile.resume?.score || 0,
                readinessScore: 75, // Mock - in production, calculate or fetch
                skillGapsCount: 5, // Mock - would come from skillGaps collection
            });
        }
    }, [userProfile]);

    const quickActions = [
        {
            title: 'Manage Skills',
            description: 'Add or update your skills',
            icon: Award,
            color: 'from-cyan-500 to-cyan-600',
            action: () => navigate('/profile'),
        },
        {
            title: 'Upload Resume',
            description: 'Get AI-powered feedback',
            icon: FileText,
            color: 'from-violet-500 to-violet-600',
            action: () => navigate('/upload-resume'),
        },
        {
            title: 'Analyze Gaps',
            description: 'Find skill gaps',
            icon: TrendingUp,
            color: 'from-orange-500 to-orange-600',
            action: () => navigate('/skill-gaps'),
        },
        {
            title: 'Career Roadmap',
            description: 'Plan your growth',
            icon: Target,
            color: 'from-green-500 to-green-600',
            action: () => navigate('/career-roadmap'),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent mb-2">
                        Welcome back, {userProfile?.displayName || 'User'}!
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Track your progress and achieve your career goals
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Skills', value: stats.totalSkills, icon: Award, color: 'text-cyan-400' },
                        { label: 'Resume Score', value: stats.resumeScore, icon: FileText, color: 'text-violet-400' },
                        { label: 'Readiness', value: `${stats.readinessScore}%`, icon: Target, color: 'text-green-400' },
                        { label: 'Skill Gaps', value: stats.skillGapsCount, icon: TrendingUp, color: 'text-orange-400' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                <span className="text-3xl font-bold text-white">{stat.value}</span>
                            </div>
                            <p className="text-slate-400 text-sm">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Readiness Gauge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Job Readiness</h2>
                        <ReadinessGauge
                            score={stats.readinessScore}
                            breakdown={{
                                skillsMatch: 78,
                                experienceLevel: 65,
                                education: 85,
                                projects: 70,
                                certifications: 60,
                            }}
                        />
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                        <div className="space-y-4">
                            {quickActions.map((action, index) => (
                                <motion.button
                                    key={action.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    onClick={action.action}
                                    className="w-full text-left p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-xl transition-all group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 bg-gradient-to-br ${action.color} rounded-lg`}>
                                            <action.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
                                                {action.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm">{action.description}</p>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Profile Completion */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <ProfileCompletion userProfile={userProfile} />
                    </motion.div>
                </div>

                {/* Skills Radar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-12"
                >
                    <SkillRadarChart skills={userProfile?.skills || []} />
                </motion.div>

                {/* Skills Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Your Skills</h2>
                        <button
                            onClick={() => navigate('/profile')}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
                        >
                            Manage →
                        </button>
                    </div>

                    {userProfile?.skills && userProfile.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {userProfile.skills.slice(0, 10).map((skill, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 + index * 0.05 }}
                                    className="px-4 py-2 bg-slate-800/50 border border-cyan-500/20 rounded-full text-cyan-400 text-sm"
                                >
                                    {skill.name}
                                </motion.div>
                            ))}
                            {userProfile.skills.length > 10 && (
                                <div className="px-4 py-2 text-slate-500 text-sm">
                                    +{userProfile.skills.length - 10} more
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-slate-400">No skills added yet. Start building your profile!</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default SkillDashboard;
