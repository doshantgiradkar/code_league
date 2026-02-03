// User Profile Management Page

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, GraduationCap, Code2, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import SkillsManager from '../components/SkillsManager';
import EducationManager from '../components/EducationManager';
import ExperienceManager from '../components/ExperienceManager';
import ProjectManager from '../components/ProjectManager';
import { toast } from 'react-toastify';

const UserProfile = () => {
    const { userProfile, updateUserProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('skills');

    const [formData, setFormData] = useState({
        displayName: '',
        skills: [],
        education: [],
        experience: [],
        projects: [],
    });

    useEffect(() => {
        if (userProfile) {
            setFormData({
                displayName: userProfile.displayName || '',
                skills: userProfile.skills || [],
                education: userProfile.education || [],
                experience: userProfile.experience || [],
                projects: userProfile.projects || [],
            });
        }
    }, [userProfile]);

    const handleSave = async () => {
        try {
            setLoading(true);
            await updateUserProfile(formData);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'skills', label: 'Skills', icon: Code2 },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'projects', label: 'Projects', icon: User },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent mb-2">
                        Your Profile
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Build your professional profile to get personalized insights
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    {tabs.map((tab, index) => (
                        <motion.button
                            key={tab.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-cyan-600 to-violet-600 text-white'
                                : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800/50'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </motion.button>
                    ))}
                </div>

                {/* Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8"
                >
                    {activeTab === 'skills' && (
                        <SkillsManager
                            skills={formData.skills}
                            onUpdate={(updated) => setFormData({ ...formData, skills: updated })}
                        />
                    )}

                    {activeTab === 'experience' && (
                        <ExperienceManager
                            experience={formData.experience}
                            onUpdate={(updated) => setFormData({ ...formData, experience: updated })}
                        />
                    )}

                    {activeTab === 'education' && (
                        <EducationManager
                            education={formData.education}
                            onUpdate={(updated) => setFormData({ ...formData, education: updated })}
                        />
                    )}

                    {activeTab === 'projects' && (
                        <ProjectManager
                            projects={formData.projects}
                            onUpdate={(updated) => setFormData({ ...formData, projects: updated })}
                        />
                    )}
                </motion.div>

                {/* Save Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 flex justify-end"
                >
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-violet-600 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Profile
                            </>
                        )}
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default UserProfile;
