// Skill gap report component

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { GAP_PRIORITIES } from '../lib/constants';

const SkillGapReport = ({ gaps = [], loading = false }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <motion.div
                    className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
            </div>
        );
    }

    if (gaps.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-400">No skill gaps identified. Great job!</p>
            </div>
        );
    }

    // Group gaps by priority
    const groupedGaps = {
        critical: gaps.filter(g => g.priority === 'critical'),
        important: gaps.filter(g => g.priority === 'important'),
        'nice-to-have': gaps.filter(g => g.priority === 'nice-to-have'),
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'from-red-500 to-red-600';
            case 'important': return 'from-orange-500 to-orange-600';
            case 'nice-to-have': return 'from-cyan-500 to-cyan-600';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    const getPriorityBadgeColor = (priority) => {
        switch (priority) {
            case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'important': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'nice-to-have': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    return (
        <div className="space-y-8">
            {Object.entries(groupedGaps).map(([priority, priorityGaps]) => {
                if (priorityGaps.length === 0) return null;

                return (
                    <motion.div
                        key={priority}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {/* Priority Header */}
                        <div className="flex items-center gap-3">
                            <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${getPriorityColor(priority)}`} />
                            <h3 className="text-xl font-semibold text-white capitalize">
                                {GAP_PRIORITIES[priority.toUpperCase().replace('-', '_')]?.label || priority}
                            </h3>
                            <span className="text-slate-500">({priorityGaps.length})</span>
                        </div>

                        {/* Gap Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence>
                                {priorityGaps.map((gap, index) => (
                                    <motion.div
                                        key={gap.skillName}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all group"
                                    >
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <h4 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                                {gap.skillName}
                                            </h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityBadgeColor(gap.priority)}`}>
                                                {GAP_PRIORITIES[gap.priority.toUpperCase().replace('-', '_')]?.label}
                                            </span>
                                        </div>

                                        {/* Reasoning */}
                                        <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                                            {gap.reasoning}
                                        </p>

                                        {/* Metrics */}
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1 text-slate-500">
                                                <Clock className="w-4 h-4" />
                                                <span>{gap.timeToLearn}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-cyan-400">
                                                <TrendingUp className="w-4 h-4" />
                                                <span>{gap.marketDemand}% demand</span>
                                            </div>
                                        </div>

                                        {/* Progress bar for market demand */}
                                        <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full bg-gradient-to-r ${getPriorityColor(gap.priority)}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${gap.marketDemand}%` }}
                                                transition={{ duration: 1, delay: 0.3 + index * 0.05 }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default SkillGapReport;
