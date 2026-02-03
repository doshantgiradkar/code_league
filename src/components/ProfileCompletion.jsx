// Profile completion indicator component

import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

const ProfileCompletion = ({ userProfile }) => {
    const calculateCompletion = () => {
        if (!userProfile) return { percentage: 0, completed: [], incomplete: [] };

        const checks = [
            { name: 'Basic Info', complete: userProfile.displayName && userProfile.email },
            { name: 'Skills', complete: userProfile.skills && userProfile.skills.length > 0 },
            { name: 'Education', complete: userProfile.education && userProfile.education.length > 0 },
            { name: 'Experience', complete: userProfile.experience && userProfile.experience.length > 0 },
            { name: 'Projects', complete: userProfile.projects && userProfile.projects.length > 0 },
        ];

        const completed = checks.filter(c => c.complete);
        const incomplete = checks.filter(c => !c.complete);
        const percentage = Math.round((completed.length / checks.length) * 100);

        return { percentage, completed, incomplete };
    };

    const { percentage, completed, incomplete } = calculateCompletion();

    const getColor = () => {
        if (percentage >= 80) return { from: '#10b981', to: '#34d399', text: 'text-green-400' };
        if (percentage >= 50) return { from: '#06b6d4', to: '#22d3ee', text: 'text-cyan-400' };
        if (percentage >= 25) return { from: '#f59e0b', to: '#fbbf24', text: 'text-yellow-400' };
        return { from: '#ef4444', to: '#f87171', text: 'text-red-400' };
    };

    const color = getColor();
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Profile Completion</h3>

            <div className="flex items-center gap-6">
                {/* Progress Circle */}
                <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="transform -rotate-90 w-full h-full">
                        {/* Background circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="45"
                            fill="none"
                            stroke="rgba(51, 65, 85, 0.3)"
                            strokeWidth="10"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx="64"
                            cy="64"
                            r="45"
                            fill="none"
                            stroke={`url(#completion-gradient)`}
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="completion-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={color.from} />
                                <stop offset="100%" stopColor={color.to} />
                            </linearGradient>
                        </defs>
                    </svg>
                    {/* Center percentage */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.3 }}
                            className={`text-3xl font-bold ${color.text}`}
                        >
                            {percentage}%
                        </motion.div>
                    </div>
                </div>

                {/* Checklist */}
                <div className="flex-1 space-y-2">
                    {[...completed, ...incomplete].map((item, index) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-2"
                        >
                            {item.complete ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                                <Circle className="w-5 h-5 text-slate-600" />
                            )}
                            <span className={item.complete ? 'text-slate-300' : 'text-slate-500'}>
                                {item.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {percentage < 100 && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 text-sm text-slate-400"
                >
                    Complete your profile to get better recommendations!
                </motion.p>
            )}
        </div>
    );
};

export default ProfileCompletion;
