// Project portfolio management component

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Code2, ExternalLink, Github } from 'lucide-react';

const ProjectManager = ({ projects = [], onUpdate }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        role: '',
    });

    const handleAdd = () => {
        if (!newProject.name.trim()) return;

        const projectToAdd = {
            ...newProject,
            techList: newProject.technologies.split(',').map(t => t.trim()).filter(Boolean),
            addedAt: new Date().toISOString(),
        };

        onUpdate([...projects, projectToAdd]);

        setNewProject({
            name: '',
            description: '',
            technologies: '',
            githubUrl: '',
            liveUrl: '',
            role: '',
        });
        setShowAddForm(false);
    };

    const handleRemove = (index) => {
        onUpdate(projects.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                                        <Code2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-semibold text-lg mb-1">{project.name}</h4>
                                        {project.role && <p className="text-cyan-400 text-sm">{project.role}</p>}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemove(index)}
                                    className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {project.description && (
                                <p className="text-slate-300 text-sm mb-4 line-clamp-3">{project.description}</p>
                            )}

                            {project.techList && project.techList.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.techList.map((tech, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-cyan-400 text-xs"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-3">
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        <Github className="w-4 h-4" />
                                        Code
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Live Demo
                                    </a>
                                )}
                            </div>
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
                        Add Project
                    </motion.button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 space-y-4"
                    >
                        <h4 className="text-white font-semibold text-lg mb-4">Add Project</h4>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Project Name *</label>
                                <input
                                    type="text"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    placeholder="e.g., E-Commerce Platform"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Your Role</label>
                                <input
                                    type="text"
                                    value={newProject.role}
                                    onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                                    placeholder="e.g., Lead Developer, Solo Project"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Description</label>
                                <textarea
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    placeholder="Describe what the project does and your contributions..."
                                    rows={3}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Technologies (comma-separated)</label>
                                <input
                                    type="text"
                                    value={newProject.technologies}
                                    onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                                    placeholder="e.g., React, Node.js, MongoDB, AWS"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">GitHub URL</label>
                                    <input
                                        type="url"
                                        value={newProject.githubUrl}
                                        onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                                        placeholder="https://github.com/..."
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">Live Demo URL</label>
                                    <input
                                        type="url"
                                        value={newProject.liveUrl}
                                        onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleAdd}
                                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-violet-600 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-violet-500 transition-all"
                            >
                                Add Project
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

            {projects.length === 0 && !showAddForm && (
                <p className="text-center text-slate-500 py-8">
                    No projects added yet. Showcase your best work by adding your projects!
                </p>
            )}
        </div>
    );
};

export default ProjectManager;
