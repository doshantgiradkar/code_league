// Job Market Dashboard - visualizations of market trends and salaries

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Briefcase, MapPin, Search, Loader2 } from 'lucide-react';
import { getSkillTrends, getSalaryStats } from '../lib/adzunaClient';
import { LOCATIONS } from '../lib/constants';
import { toast } from 'react-toastify';

const JobMarketDashboard = () => {
    const [skillQuery, setSkillQuery] = useState('React');
    const [location, setLocation] = useState('us');
    const [loading, setLoading] = useState(false);
    const [trends, setTrends] = useState([]);
    const [salary, setSalary] = useState(null);

    const loadMarketData = async () => {
        if (!skillQuery.trim()) return;

        try {
            setLoading(true);
            const [trendsData, salaryData] = await Promise.all([
                getSkillTrends(skillQuery, location),
                getSalaryStats(skillQuery, location),
            ]);

            setTrends(trendsData);

            // Map the API response to the format expected by the UI
            if (salaryData && salaryData.average) {
                setSalary({
                    min: salaryData.min || 0,
                    max: salaryData.max || 0,
                    median: salaryData.median || salaryData.average || 0,
                });
            } else {
                // Fallback if no salary data available
                setSalary({ min: 0, max: 0, median: 0 });
            }
        } catch (error) {
            console.error('Error loading market data:', error);
            toast.error('Failed to load market data');
            // Fallback mock data
            setTrends([
                { month: 'Jan', count: 1200 },
                { month: 'Feb', count: 1350 },
                { month: 'Mar', count: 1500 },
                { month: 'Apr', count: 1400 },
                { month: 'May', count: 1650 },
                { month: 'Jun', count: 1800 },
            ]);
            setSalary({ min: 80000, max: 150000, median: 115000 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMarketData();
    }, []);

    const maxCount = trends.length > 0 ? Math.max(...trends.map(t => t.count)) : 1;

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
                        Job Market Intelligence
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Real-time insights on skills demand and salary benchmarks
                    </p>
                </motion.div>

                {/* Search Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Skill or Job Title
                            </label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    value={skillQuery}
                                    onChange={(e) => setSkillQuery(e.target.value)}
                                    placeholder="e.g., React, Python, Data Scientist"
                                    className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && loadMarketData()}
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-48">
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-white focus:border-cyan-500 focus:outline-none appearance-none"
                                >
                                    {LOCATIONS.map((loc) => (
                                        <option key={loc.value} value={loc.value}>
                                            {loc.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={loadMarketData}
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-violet-600 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-violet-500 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <TrendingUp className="w-5 h-5" />
                                        Analyze
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                {salary && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[
                            { label: 'Minimum Salary', value: `$${salary.min.toLocaleString()}`, icon: DollarSign, color: 'text-orange-400' },
                            { label: 'Median Salary', value: `$${salary.median.toLocaleString()}`, icon: DollarSign, color: 'text-green-400' },
                            { label: 'Maximum Salary', value: `$${salary.max.toLocaleString()}`, icon: DollarSign, color: 'text-cyan-400' },
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
                )}

                {/* Trends Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-cyan-400" />
                        Job Postings Trend
                    </h2>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                        </div>
                    ) : trends.length > 0 ? (
                        <div className="space-y-4">
                            {trends.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="space-y-2"
                                >
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">{item.month}</span>
                                        <span className="text-cyan-400 font-semibold">{item.count} jobs</span>
                                    </div>
                                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-cyan-600 to-violet-600 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.count / maxCount) * 100}%` }}
                                            transition={{ duration: 0.8, delay: index * 0.1 }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-slate-400 py-10">No trend data available</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default JobMarketDashboard;
