// Work experience management component

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Briefcase, Calendar, MapPin } from 'lucide-react';

const ExperienceManager = ({ experience = [], onUpdate }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newExperience, setNewExperience] = useState({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
    });

    const handleAdd = () => {
        if (!newExperience.title.trim() || !newExperience.company.trim()) return;

        const experienceToAdd = {
            ...newExperience,
            addedAt: new Date().toISOString(),
        };

        onUpdate([...experience, experienceToAdd]);

        setNewExperience({
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
        });
        setShowAddForm(false);
    };

    const handleRemove = (index) => {
        onUpdate(experience.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <AnimatePresence>
                    {experience.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                                        <Briefcase className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-semibold text-lg">{exp.title}</h4>
                                        <p className="text-cyan-400 text-sm mb-1">{exp.company}</p>
                                        {exp.location && (
                                            <div className="flex items-center gap-1 text-slate-400 text-sm">
                                                <MapPin className="w-4 h-4" />
                                                <span>{exp.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemove(index)}
                                    className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                                <Calendar className="w-4 h-4" />
                                <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                            </div>

                            {exp.description && (
                                <p className="text-slate-300 text-sm leading-relaxed">{exp.description}</p>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {!showAddForm ? (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddForm(true)}
                        className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all flex items-center justify-center gap-2 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Add Experience
                    </motion.button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 space-y-4"
                    >
                        <h4 className="text-white font-semibold text-lg mb-4">Add Work Experience</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-slate-400 text-sm mb-2">Job Title *</label>
                                <input
                                    type="text"
                                    value={newExperience.title}
                                    onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                                    placeholder="e.g., Senior Software Engineer"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Company *</label>
                                <input
                                    type="text"
                                    value={newExperience.company}
                                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                                    placeholder="e.g., Google"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Location</label>
                                <input
                                    type="text"
                                    value={newExperience.location}
                                    onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                                    placeholder="e.g., San Francisco, CA"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Start Date</label>
                                <input
                                    type="month"
                                    value={newExperience.startDate}
                                    onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">End Date</label>
                                <input
                                    type="month"
                                    value={newExperience.endDate}
                                    onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                                    disabled={newExperience.current}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none disabled:opacity-50"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newExperience.current}
                                        onChange={(e) => setNewExperience({ ...newExperience, current: e.target.checked, endDate: '' })}
                                        className="w-4 h-4 rounded border-slate-700 bg-slate-800/30 text-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                    />
                                    <span className="text-sm text-slate-400">I currently work here</span>
                                </label>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-slate-400 text-sm mb-2">Description</label>
                                <textarea
                                    value={newExperience.description}
                                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                                    placeholder="Describe your responsibilities and achievements..."
                                    rows={4}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleAdd}
                                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-violet-600 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-violet-500 transition-all"
                            >
                                Add Experience
                            </button>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="px-6 py-3 bg-slate-700/50 text-slate-300 rounded-lg font-semibold hover:bg-slate-700 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {experience.length === 0 && !showAddForm && (
                <p className="text-center text-slate-500 py-8">
                    No work experience added yet. Click the button above to add your professional experience.
                </p>
            )}
        </div>
    );
};

export default ExperienceManager;
