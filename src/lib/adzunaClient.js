// Adzuna Job Search API Client
// Updated to use Express microservice backend

import { CACHE_DURATION } from './constants';

const API_BASE_URL = 'http://localhost:3001';

// In-memory cache for API responses
const cache = new Map();

/**
 * Check if cached data is still valid
 * @param {string} key - Cache key
 * @param {number} duration - Cache duration in ms
 * @returns {any|null} - Cached data or null
 */
const getCachedData = (key, duration) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < duration) {
        return cached.data;
    }
    return null;
};

/**
 * Store data in cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
const setCachedData = (key, data) => {
    cache.set(key, { data, timestamp: Date.now() });
};

/**
 * Helper function to call backend API
 */
async function callAPI(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/adzuna${endpoint}`, {
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

        return result.data;
    } catch (error) {
        console.error(`❌ Adzuna API error:`, error.message);
        throw error;
    }
}

/**
 * Search jobs via backend server
 * @param {object} params
 * @param {string} params.query - Search query (job title or keywords)
 * @param {string} params.location - Location code (e.g., 'us', 'gb', 'in')
 * @param {number} params.resultsPerPage - Number of results (default 20)
 * @param {number} params.page - Page number (default 1)
 * @returns {Promise<object>} - Job search results
 */
export const searchJobs = async ({ query, location = 'us', resultsPerPage = 20, page = 1 }) => {
    // Check cache first
    const cacheKey = `jobs_${query}_${location}_${page}`;
    const cached = getCachedData(cacheKey, CACHE_DURATION.JOB_MARKET_DATA);
    if (cached) {
        console.log('✅ Returning cached job data');
        return cached;
    }

    try {
        const data = await callAPI('/search-jobs', {
            query,
            location,
            resultsPerPage,
            page
        });

        // Cache the result
        setCachedData(cacheKey, data);

        return data;
    } catch (error) {
        console.error('Job search error:', error);
        // Fallback to mock data
        return getMockJobData(query);
    }
};

/**
 * Extract skills from job descriptions
 * @param {Array} jobs - Array of job postings
 * @returns {Array} - Aggregated skills with frequency
 */
export const extractSkillsFromJobs = (jobs) => {
    const skillsMap = new Map();

    // Common tech skills to look for
    const commonSkills = [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#',
        'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
        'Git', 'CI/CD', 'REST API', 'GraphQL', 'HTML', 'CSS', 'Vue.js', 'Angular',
        'Express', 'Django', 'Flask', 'Spring Boot', 'Machine Learning', 'TensorFlow',
        'PyTorch', 'Data Science', 'DevOps', 'Agile', 'Scrum', 'Leadership',
        'Communication', 'Problem Solving', 'Team Collaboration', 'UI/UX', 'Figma',
    ];

    jobs.forEach(job => {
        const text = `${job.title || ''} ${job.description || ''}`.toLowerCase();

        commonSkills.forEach(skill => {
            if (text.includes(skill.toLowerCase())) {
                const count = skillsMap.get(skill) || 0;
                skillsMap.set(skill, count + 1);
            }
        });
    });

    // Convert to array and sort by frequency
    return Array.from(skillsMap.entries())
        .map(([skill, count]) => ({
            skill,
            frequency: count,
            percentage: Math.round((count / jobs.length) * 100),
        }))
        .sort((a, b) => b.frequency - a.frequency);
};

/**
 * Get salary statistics for a role
 * @param {string} role - Job role
 * @param {string} location - Location code
 * @returns {Promise<object>} - Salary statistics
 */
export const getSalaryStats = async (role, location = 'us') => {
    const cacheKey = `salary_${role}_${location}`;
    const cached = getCachedData(cacheKey, CACHE_DURATION.SALARY_DATA);
    if (cached) {
        return cached;
    }

    try {
        const data = await callAPI('/salary-stats', { role, location });
        setCachedData(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Salary stats error:', error);
        return getMockSalaryData(role);
    }
};

/**
 * Get trending skills for a role
 * @param {string} role - Job role
 * @param {string} location - Location code
 * @returns {Promise<Array>} - Trending skills with demand metrics
 */
export const getTrendingSkills = async (role, location = 'us') => {
    const cacheKey = `trending_${role}_${location}`;
    const cached = getCachedData(cacheKey, CACHE_DURATION.SKILL_TRENDS);
    if (cached) {
        return cached;
    }

    try {
        const skills = await callAPI('/trending-skills', { role, location });
        setCachedData(cacheKey, skills);
        return skills;
    } catch (error) {
        console.error('Trending skills error:', error);
        return [];
    }
};

/**
 * Mock job data for testing/fallback
 */
const getMockJobData = (query) => ({
    results: [
        {
            id: '1',
            title: `Senior ${query}`,
            description: `We are seeking an experienced ${query} with skills in JavaScript, React, Node.js, TypeScript, AWS, Docker, and strong communication skills.`,
            company: { display_name: 'Tech Corp' },
            location: { display_name: 'San Francisco, CA' },
            salary_min: 120000,
            salary_max: 180000,
            created: new Date().toISOString(),
        },
        {
            id: '2',
            title: `${query} - Remote`,
            description: `Join our team as a ${query}. Requirements include Python, Django, PostgreSQL, REST API, Git, and CI/CD experience.`,
            company: { display_name: 'StartupXYZ' },
            location: { display_name: 'Remote' },
            salary_min: 100000,
            salary_max: 150000,
            created: new Date().toISOString(),
        },
    ],
    count: 2,
});

/**
 * Mock salary data
 */
const getMockSalaryData = (role) => ({
    role,
    location: 'us',
    average: 125000,
    min: 80000,
    max: 180000,
    trend: 'rising',
});

/**
 * Get skill trends for job market dashboard
 * @param {string} skillQuery - Skill or job title to analyze
 * @param {string} location - Location code
 * @returns {Promise<Array>} - Trend data with monthly job counts
 */
export const getSkillTrends = async (skillQuery, location = 'us') => {
    const cacheKey = `skill_trends_${skillQuery}_${location}`;
    const cached = getCachedData(cacheKey, CACHE_DURATION.SKILL_TRENDS);
    if (cached) {
        return cached;
    }

    // For now, return mock trend data
    // In production, this would query historical job data
    const trends = [
        { month: 'Jan', count: Math.floor(Math.random() * 1000) + 500 },
        { month: 'Feb', count: Math.floor(Math.random() * 1000) + 600 },
        { month: 'Mar', count: Math.floor(Math.random() * 1000) + 700 },
        { month: 'Apr', count: Math.floor(Math.random() * 1000) + 650 },
        { month: 'May', count: Math.floor(Math.random() * 1000) + 800 },
        { month: 'Jun', count: Math.floor(Math.random() * 1000) + 900 },
    ];

    setCachedData(cacheKey, trends);
    return trends;
};

/**
 * Get salary benchmark data
 * @param {string} skillQuery - Skill or job title
 * @param {string} location - Location code
 * @returns {Promise<object>} - Salary min, max, median
 */
export const getSalaryBenchmark = async (skillQuery, location = 'us') => {
    const cacheKey = `salary_benchmark_${skillQuery}_${location}`;
    const cached = getCachedData(cacheKey, CACHE_DURATION.SALARY_DATA);
    if (cached) {
        return cached;
    }

    // Use existing getSalaryStats function
    const salaryData = await getSalaryStats(skillQuery, location);

    const benchmark = {
        min: salaryData.min || 70000,
        max: salaryData.max || 160000,
        median: salaryData.average || 110000,
    };

    setCachedData(cacheKey, benchmark);
    return benchmark;
};

/**
 * Get job recommendations based on user skills
 */
export const getJobRecommendations = async ({ skills, targetRole, location = 'us', experienceLevel }) => {
    const cacheKey = `recommendations_${targetRole}_${location}`;
    const cached = getCachedData(cacheKey, CACHE_DURATION.JOB_MARKET_DATA);
    if (cached) {
        return cached;
    }

    try {
        const data = await callAPI('/job-recommendations', {
            skills,
            targetRole,
            location,
            experienceLevel
        });
        setCachedData(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Job recommendations error:', error);
        return [];
    }
};

/**
 * Get market insights for a role
 */
export const getMarketInsights = async (role, location = 'us') => {
    const cacheKey = `insights_${role}_${location}`;
    const cached = getCachedData(cacheKey, CACHE_DURATION.JOB_MARKET_DATA);
    if (cached) {
        return cached;
    }

    try {
        const data = await callAPI('/market-insights', { role, location });
        setCachedData(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Market insights error:', error);
        return null;
    }
};

export default {
    searchJobs,
    extractSkillsFromJobs,
    getSalaryStats,
    getTrendingSkills,
    getSkillTrends,
    getSalaryBenchmark,
    getJobRecommendations,
    getMarketInsights,
};

