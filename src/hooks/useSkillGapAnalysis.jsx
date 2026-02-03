// Hook for skill gap analysis using Gemini and job market data

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { detectSkillGaps } from '../lib/geminiClient';
import { getTrendingSkills } from '../lib/adzunaClient';
import { setDocument, getDocument } from '../firebase/helperFunction';
import { COLLECTIONS } from '../lib/constants';
import { toast } from 'react-toastify';

export const useSkillGapAnalysis = (targetRole = '') => {
    const { user, userProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [gaps, setGaps] = useState([]);
    const [error, setError] = useState(null);
    const [lastAnalysis, setLastAnalysis] = useState(null);

    // Load cached analysis on mount
    useEffect(() => {
        const loadCachedAnalysis = async () => {
            if (!user) return;

            try {
                const cached = await getDocument(COLLECTIONS.SKILL_GAPS, user.uid);
                if (cached) {
                    setGaps(cached.gaps || []);
                    setLastAnalysis(cached.generatedAt);
                }
            } catch (err) {
                console.error('Failed to load cached analysis:', err);
            }
        };

        loadCachedAnalysis();
    }, [user]);

    /**
     * Perform skill gap analysis
     */
    const analyze = async (role = targetRole) => {
        if (!user || !userProfile) {
            setError('Must be authenticated with complete profile');
            return;
        }

        if (!role) {
            setError('Target role is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Get user's current skills with comprehensive null checking
            const userSkills = userProfile?.skills || [];

            // Validate user has added skills
            if (userSkills.length === 0) {
                setError('Please add skills to your profile first');
                toast.error('Please add skills to your profile before analyzing gaps');
                setLoading(false);
                return;
            }

            console.log('User skills for analysis:', userSkills);

            // Get market requirements for the role
            const trendingSkills = await getTrendingSkills(role);
            const marketRequirements = trendingSkills.slice(0, 20).map(s => s.skill);

            console.log('Market requirements:', marketRequirements);

            // Analyze gaps using Gemini - pass correct parameters
            const gapsData = await detectSkillGaps({
                userSkills,
                marketRequirements,
                targetRole: role,
            });

            console.log('Detected gaps:', gapsData);

            // Save to Firestore
            await setDocument(COLLECTIONS.SKILL_GAPS, user.uid, {
                userId: user.uid,
                targetRole: role,
                gaps: gapsData,
                generatedAt: new Date().toISOString(),
            });

            setGaps(gapsData);
            setLastAnalysis(new Date().toISOString());
            setLoading(false);

            return gapsData;
        } catch (err) {
            console.error('Skill gap analysis error:', err);
            setError(err.message);
            setLoading(false);

            // Provide helpful error message and fallback to demo data
            if (err.message.includes('404')) {
                toast.warning('Using demo data - AI service configuration needed');

                // Provide sample gaps for demonstration
                const mockGaps = [
                    {
                        skillName: 'React Advanced Patterns',
                        priority: 'critical',
                        timeToLearn: '2-3 months',
                        marketDemand: 85,
                        reasoning: 'Essential for senior-level positions and modern frontend architecture'
                    },
                    {
                        skillName: 'TypeScript',
                        priority: 'critical',
                        timeToLearn: '1-2 months',
                        marketDemand: 90,
                        reasoning: 'Industry standard for type-safe JavaScript development'
                    },
                    {
                        skillName: 'System Design',
                        priority: 'important',
                        timeToLearn: '3-6 months',
                        marketDemand: 75,
                        reasoning: 'Critical for architecting scalable applications'
                    },
                    {
                        skillName: 'Docker & Kubernetes',
                        priority: 'important',
                        timeToLearn: '2-3 months',
                        marketDemand: 80,
                        reasoning: 'Standard for containerization and orchestration'
                    },
                    {
                        skillName: 'GraphQL',
                        priority: 'nice-to-have',
                        timeToLearn: '1 month',
                        marketDemand: 60,
                        reasoning: 'Modern API query language gaining adoption'
                    }
                ];

                setGaps(mockGaps);
                setLoading(false);
                return mockGaps;
            } else {
                toast.error('Failed to analyze skill gaps. ' + err.message);
            }

            throw err;
        }
    };

    /**
     * Clear cached gaps
     */
    const clearGaps = () => {
        setGaps([]);
        setLastAnalysis(null);
    };

    return {
        gaps,
        loading,
        error,
        lastAnalysis,
        analyze,
        clearGaps,
    };
};

export default useSkillGapAnalysis;
