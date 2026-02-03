// Education management component for user profile

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, GraduationCap, Calendar } from 'lucide-react';

const EducationManager = ({ education = [], onUpdate }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEducation, setNewEducation] = useState({
        institution: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: '',
        grade: '',
    });

    const handleAdd = () => {
        if (!newEducation.institution.trim() || !newEducation.degree.trim()) return;

        const educationToAdd = {
            ...newEducation,
            addedAt: new Date().toISOString(),
        };

        onUpdate([...education, educationToAdd]);

        // Reset form
        setNewEducation({
            institution: '',
            degree: '',
            field: '',
            startYear: '',
            endYear: '',
            grade: '',
        });
        setShowAddForm(false);
    };

    const handleRemove = (index) => {
        onUpdate(education.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            {/* Education List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {education.map((edu, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
                                        <GraduationCap className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-semibold text-lg">{edu.degree}</h4>
                                        <p className="text-cyan-400 text-sm mb-1">{edu.institution}</p>
                                        {edu.field && <p className="text-slate-400 text-sm">{edu.field}</p>}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemove(index)}
                                    className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{edu.startYear} - {edu.endYear || 'Present'}</span>
                                </div>
                                {edu.grade && <span className="text-cyan-400">Grade: {edu.grade}</span>}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Button/Form */}
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
                        Add Education
                    </motion.button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 space-y-4"
                    >
                        <h4 className="text-white font-semibold text-lg mb-4">Add Education</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-slate-400 text-sm mb-2">Institution *</label>
                                <input
                                    type="text"
                                    value={newEducation.institution}
                                    onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                                    placeholder="e.g., Stanford University"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Degree *</label>
                                <input
                                    type="text"
                                    value={newEducation.degree}
                                    onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                                    placeholder="e.g., Bachelor of Science"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Field of Study</label>
                                <input
                                    type="text"
                                    value={newEducation.field}
                                    onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                                    placeholder="e.g., Computer Science"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Start Year</label>
                                <input
                                    type="number"
                                    value={newEducation.startYear}
                                    onChange={(e) => setNewEducation({ ...newEducation, startYear: e.target.value })}
                                    placeholder="2018"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">End Year</label>
                                <input
                                    type="number"
                                    value={newEducation.endYear}
                                    onChange={(e) => setNewEducation({ ...newEducation, endYear: e.target.value })}
                                    placeholder="2022 (or leave blank if ongoing)"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-slate-400 text-sm mb-2">Grade / GPA</label>
                                <input
                                    type="text"
                                    value={newEducation.grade}
                                    onChange={(e) => setNewEducation({ ...newEducation, grade: e.target.value })}
                                    placeholder="e.g., 3.8 GPA, First Class"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleAdd}
                                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-violet-600 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-violet-500 transition-all"
                            >
                                Add Education
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

            {education.length === 0 && !showAddForm && (
                <p className="text-center text-slate-500 py-8">
                    No education added yet. Click the button above to add your educational background.
                </p>
            )}
        </div>
    );
};

export default EducationManager;
