// Skill gaps analysis page

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, AlertTriangle } from 'lucide-react';
import { useSkillGapAnalysis } from '../hooks/useSkillGapAnalysis';
import SkillGapReport from '../components/SkillGapReport';
import { JOB_ROLES } from '../lib/constants';
import { toast } from 'react-toastify';

const SkillGapsPage = () => {
    const [targetRole, setTargetRole] = useState('');
    const { gaps, loading, analyze } = useSkillGapAnalysis();

    const handleAnalyze = async () => {
        if (!targetRole) {
            toast.error('Please select or enter a target role');
            return;
        }

        try {
            await analyze(targetRole);
            toast.success('Skill gap analysis completed!');
        } catch (error) {
            toast.error('Failed to analyze skill gaps');
            console.error(error);
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-4">
                        <AlertTriangle className="w-4 h-4" />
                        AI-Powered Analysis
                    </div>
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent mb-4">
                        Skill Gap Analysis
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Discover what skills you need to reach your career goals
                    </p>
                </motion.div>

                {/* Input Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 mb-12"
                >
                    <label className="block text-slate-400 text-sm mb-2">Target Job Role</label>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="e.g., Senior Full-Stack Developer"
                                list="job-roles"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                            />
                            <datalist id="job-roles">
                                {JOB_ROLES.map(role => (
                                    <option key={role} value={role} />
                                ))}
                            </datalist>
                        </div>
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-violet-600 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-violet-500 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    Analyze
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Results */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <SkillGapReport gaps={gaps} loading={loading} />
                </motion.div>
            </div>
        </div>
    );
};

export default SkillGapsPage;
