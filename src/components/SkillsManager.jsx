// Interactive skills management component with autocomplete

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Star } from 'lucide-react';
import { SKILL_CATEGORIES, PROFICIENCY_LEVELS } from '../lib/constants';

const SkillsManager = ({ skills = [], onUpdate }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newSkill, setNewSkill] = useState({
        name: '',
        category: SKILL_CATEGORIES.OTHER,
        proficiency: 3,
    });

    const handleAddSkill = () => {
        if (!newSkill.name.trim()) return;

        const skillToAdd = {
            ...newSkill,
            name: newSkill.name.trim(),
            endorsements: 0,
            addedAt: new Date().toISOString(),
        };

        onUpdate([...skills, skillToAdd]);

        // Reset form
        setNewSkill({
            name: '',
            category: SKILL_CATEGORIES.OTHER,
            proficiency: 3,
        });
        setShowAddForm(false);
    };

    const handleRemoveSkill = (index) => {
        const updated = skills.filter((_, i) => i !== index);
        onUpdate(updated);
    };

    const handleUpdateProficiency = (index, newProficiency) => {
        const updated = skills.map((skill, i) =>
            i === index ? { ...skill, proficiency: newProficiency } : skill
        );
        onUpdate(updated);
    };

    return (
        <div className="space-y-6">
            {/* Skills List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {skills.map((skill, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-cyan-500/30 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h4 className="text-white font-semibold text-lg">{skill.name}</h4>
                                    <p className="text-slate-500 text-sm">{skill.category}</p>
                                </div>
                                <button
                                    onClick={() => handleRemoveSkill(index)}
                                    className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Proficiency Stars */}
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => handleUpdateProficiency(index, level)}
                                        className="transition-all hover:scale-110"
                                    >
                                        <Star
                                            className={`w-5 h-5 ${level <= skill.proficiency
                                                    ? 'fill-cyan-500 text-cyan-500'
                                                    : 'text-slate-600'
                                                }`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-sm text-slate-400">
                                    {PROFICIENCY_LEVELS[Object.keys(PROFICIENCY_LEVELS).find(
                                        key => PROFICIENCY_LEVELS[key].value === skill.proficiency
                                    )]?.label}
                                </span>
                            </div>

                            {skill.endorsements > 0 && (
                                <p className="text-xs text-cyan-400 mt-2">
                                    {skill.endorsements} endorsement{skill.endorsements !== 1 ? 's' : ''}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Skill Button/Form */}
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
                        Add New Skill
                    </motion.button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 space-y-4"
                    >
                        <h4 className="text-white font-semibold text-lg mb-4">Add New Skill</h4>

                        {/* Skill Name */}
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Skill Name</label>
                            <input
                                type="text"
                                value={newSkill.name}
                                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                placeholder="e.g., React.js, Python, Leadership"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                                autoFocus
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Category</label>
                            <select
                                value={newSkill.category}
                                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                            >
                                {Object.values(SKILL_CATEGORIES).map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Proficiency */}
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Proficiency Level</label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setNewSkill({ ...newSkill, proficiency: level })}
                                        className="transition-all hover:scale-110"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${level <= newSkill.proficiency
                                                    ? 'fill-cyan-500 text-cyan-500'
                                                    : 'text-slate-600'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-slate-500 text-sm mt-2">
                                {PROFICIENCY_LEVELS[Object.keys(PROFICIENCY_LEVELS).find(
                                    key => PROFICIENCY_LEVELS[key].value === newSkill.proficiency
                                )]?.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleAddSkill}
                                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-violet-600 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-violet-500 transition-all"
                            >
                                Add Skill
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

            {skills.length === 0 && !showAddForm && (
                <p className="text-center text-slate-500 py-8">
                    No skills added yet. Click the button above to add your first skill.
                </p>
            )}
        </div>
    );
};

export default SkillsManager;
