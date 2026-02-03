// ✅ Gemini Client - Calls Express Microservice
// Frontend client that communicates with the Express backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/gemini';

/**
 * ✅ Helper function to call backend API
 */
async function callAPI(endpoint, data, retries = 3) {
    let lastError;

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `API error: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error('API returned unsuccessful response');
            }

            console.log(`✅ API success: ${endpoint}`);
            return result.data;

        } catch (error) {
            lastError = error;
            console.error(`❌ Attempt ${attempt + 1} failed:`, error.message);

            if (attempt < retries - 1) {
                const delay = Math.pow(2, attempt) * 1000;
                console.log(`⏳ Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw new Error(`API failed after ${retries} attempts: ${lastError?.message}`);
}

/**
 * ✅ Analyze skill gaps
 */
export const analyzeSkillGaps = async ({ userSkills, marketRequirements, targetRole }) => {
    if (!userSkills || !Array.isArray(userSkills)) {
        throw new Error('User skills must be provided as an array');
    }

    if (!targetRole) {
        throw new Error('Target role is required');
    }

    return await callAPI('/analyze-skills', {
        userSkills,
        marketRequirements,
        targetRole
    });
};

export const detectSkillGaps = analyzeSkillGaps;

/**
 * ✅ Generate career roadmap
 */
export const generateCareerRoadmap = async ({ currentSkills, targetRole, timeframe, experienceLevel }) => {
    if (!targetRole) {
        throw new Error('Target role is required');
    }

    return await callAPI('/generate-roadmap', {
        currentSkills,
        targetRole,
        timeframe,
        experienceLevel
    });
};

/**
 * ✅ Generate learning recommendations
 */
export const generateLearningRecommendations = async (skillGaps, preferences = {}) => {
    return await callAPI('/learning-recommendations', {
        skillGaps,
        preferences
    });
};

/**
 * ✅ Score a resume
 */
export const scoreResume = async (resumeText, targetRole = '') => {
    if (!resumeText) {
        throw new Error('Resume text is required');
    }

    return await callAPI('/score-resume', {
        resumeText,
        targetRole
    });
};

export default {
    analyzeSkillGaps,
    detectSkillGaps,
    generateCareerRoadmap,
    generateLearningRecommendations,
    scoreResume,
};
