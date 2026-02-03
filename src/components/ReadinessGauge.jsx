// Circular gauge component for displaying job readiness score

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ReadinessGauge = ({ score = 0, breakdown = {}, className = '' }) => {
    // Determine color based on score
    const getColor = (value) => {
        if (value >= 80) return { from: '#10b981', to: '#34d399', text: 'text-green-400' };
        if (value >= 60) return { from: '#06b6d4', to: '#22d3ee', text: 'text-cyan-400' };
        if (value >= 40) return { from: '#f59e0b', to: '#fbbf24', text: 'text-yellow-400' };
        return { from: '#ef4444', to: '#f87171', text: 'text-red-400' };
    };

    const color = getColor(score);
    const circumference = 2 * Math.PI * 90; // radius = 90
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className={`flex flex-col items-center ${className}`}>
            {/* Gauge Circle */}
            <div className="relative w-64 h-64">
                <svg className="transform -rotate-90 w-full h-full">
                    {/* Background circle */}
                    <circle
                        cx="128"
                        cy="128"
                        r="90"
                        fill="none"
                        stroke="rgba(51, 65, 85, 0.3)"
                        strokeWidth="16"
                    />
                    {/* Progress circle */}
                    <motion.circle
                        cx="128"
                        cy="128"
                        r="90"
                        fill="none"
                        stroke={`url(#gradient-${score})`}
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                    />
                    {/* Gradient definition */}
                    <defs>
                        <linearGradient id={`gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={color.from} />
                            <stop offset="100%" stopColor={color.to} />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center score */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.5, stiffness: 200 }}
                        className="text-center"
                    >
                        <div className={`text-6xl font-bold ${color.text}`}>{Math.round(score)}</div>
                        <div className="text-sm text-slate-400 mt-1">Readiness Score</div>
                    </motion.div>
                </div>
            </div>

            {/* Breakdown */}
            {Object.keys(breakdown).length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 w-full max-w-md space-y-3"
                >
                    <h4 className="text-white font-semibold text-center mb-4">Score Breakdown</h4>
                    {Object.entries(breakdown).map(([key, value], index) => {
                        const itemColor = getColor(value);
                        const label = key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase());

                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 + index * 0.1 }}
                                className="space-y-1"
                            >
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">{label}</span>
                                    <span className={`font-semibold ${itemColor.text}`}>{Math.round(value)}%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{
                                            background: `linear-gradient(90deg, ${itemColor.from}, ${itemColor.to})`,
                                        }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${value}%` }}
                                        transition={{ duration: 1, delay: 1 + index * 0.1 }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
};

export default ReadinessGauge;
