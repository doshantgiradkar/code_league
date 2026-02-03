// ✅ Express Microservice for Gemini API Integration
// Production-ready REST API server using Google GenAI SDK

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Gemini API Configuration - FIXED: Use GEMINI_API_KEY (not VITE_)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash-lite';

// Validate API key on startup
if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is not set in .env file');
    process.exit(1);
}

// ✅ Initialize Google GenAI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ✅ Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

// ✅ Middleware
app.use(helmet());
app.use(cors({
    origin: '*', // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// ✅ Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ✅ Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Gemini AI Microservice',
        model: GEMINI_MODEL,
        version: '2.0.0',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// ✅ HELPER FUNCTIONS
// ============================================

/**
 * Call Gemini API using GoogleGenAI SDK
 */
async function callGeminiAPI(prompt, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            if (!text) {
                throw new Error('Empty response from Gemini API');
            }

            console.log('✅ Gemini API success');
            return text;

        } catch (error) {
            console.error(`❌ Attempt ${attempt + 1} failed:`, error.message);

            if (attempt < retries - 1) {
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
}

/**
 * Parse JSON from Gemini response (handles markdown code blocks)
 */
function parseGeminiJSON(text) {
    try {
        console.log('📄 Raw Gemini response:', text.substring(0, 200) + '...');

        // Try to extract JSON from various formats
        let cleanedText = text.trim();

        // Remove markdown code blocks
        cleanedText = cleanedText
            .replace(/```json\s*/gi, '')
            .replace(/```javascript\s*/gi, '')
            .replace(/```\s*/g, '')
            .trim();

        // Try to find JSON array or object
        const jsonMatch = cleanedText.match(/[\[{][\s\S]*[\]}]/);
        if (jsonMatch) {
            cleanedText = jsonMatch[0];
        }

        const parsed = JSON.parse(cleanedText);
        console.log('✅ JSON parsed successfully:', Array.isArray(parsed) ? `Array with ${parsed.length} items` : 'Object');
        return parsed;
    } catch (error) {
        console.error('❌ Failed to parse JSON:', error);
        console.error('📄 Original text:', text);
        throw new Error(`Invalid JSON response from Gemini: ${error.message}`);
    }
}

/**
 * Extract text from PDF buffer
 */
async function extractPDFText(buffer) {
    try {
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        console.error('PDF parsing error:', error);
        throw new Error('Failed to parse PDF file');
    }
}

// ============================================
// ✅ API ROUTES
// ============================================

/**
 * POST /api/gemini/analyze-skills
 * Analyze skill gaps for a target role
 */
app.post('/api/gemini/analyze-skills', async (req, res) => {
    try {
        const { userSkills, marketRequirements, targetRole } = req.body;

        if (!targetRole) {
            return res.status(400).json({ error: 'Target role is required' });
        }

        const prompt = `Analyze skill gaps for the following:

Target Role: ${targetRole}

User's Current Skills:
${userSkills?.length > 0 ? userSkills.map(s => `- ${s.name} (Proficiency: ${s.proficiency || 3}/5)`).join('\n') : 'No skills added yet'}

Market Requirements:
${marketRequirements?.length > 0 ? marketRequirements.join(', ') : 'General market skills'}

Return a JSON array with this structure:
[
  {
    "skillName": "string",
    "priority": "critical" | "important" | "nice-to-have",
    "timeToLearn": "string",
    "marketDemand": number (0-100),
    "reasoning": "string"
  }
]

Return ONLY the JSON array, no additional text or markdown.`;

        const response = await callGeminiAPI(prompt);
        const skillGaps = parseGeminiJSON(response);

        res.json({ success: true, data: skillGaps });

    } catch (error) {
        console.error('Error in analyze-skills:', error);
        res.status(500).json({
            error: 'Failed to analyze skills',
            message: error.message
        });
    }
});

/**
 * POST /api/gemini/generate-roadmap
 * Generate career roadmap
 */
app.post('/api/gemini/generate-roadmap', async (req, res) => {
    try {
        const { currentSkills, targetRole, timeframe, experienceLevel } = req.body;

        if (!targetRole) {
            return res.status(400).json({ error: 'Target role is required' });
        }

        const prompt = `Generate a career roadmap:

Target Role: ${targetRole}
Timeframe: ${timeframe || '12 months'}
Experience Level: ${experienceLevel || 'Intermediate'}

Current Skills:
${currentSkills?.length > 0 ? currentSkills.map(s => `- ${s.name || s}`).join('\n') : 'Beginner level'}

Return a JSON array:
[
  {
    "title": "string",
    "description": "string",
    "skills": ["skill1", "skill2"],
    "estimatedDuration": "string",
    "prerequisites": ["prereq1"],
    "resources": ["resource1"]
  }
]

Return ONLY the JSON array, no markdown.`;

        const response = await callGeminiAPI(prompt);
        const roadmap = parseGeminiJSON(response);

        res.json({ success: true, data: roadmap });

    } catch (error) {
        console.error('Error in generate-roadmap:', error);
        res.status(500).json({
            error: 'Failed to generate roadmap',
            message: error.message
        });
    }
});

/**
 * POST /api/gemini/learning-recommendations
 * Generate learning recommendations
 */
app.post('/api/gemini/learning-recommendations', async (req, res) => {
    try {
        const { skillGaps, preferences } = req.body;

        const prompt = `Generate learning recommendations:

Skill Gaps:
${skillGaps?.length > 0 ? skillGaps.map(g => `- ${g.skillName} (${g.priority})`).join('\n') : 'General learning'}

Preferences:
- Style: ${preferences?.preferredLearningStyle || 'Any'}
- Budget: ${preferences?.budget || 'Mixed'}

Return a JSON array:
[
  {
    "title": "string",
    "type": "Online Course" | "Certification" | "Book" | "Project",
    "provider": "string",
    "duration": "string",
    "costEstimate": "string",
    "skillsCovered": ["skill1"],
    "relevance": "string",
    "url": "string"
  }
]

Return ONLY the JSON array, no markdown.`;

        const response = await callGeminiAPI(prompt);
        const recommendations = parseGeminiJSON(response);

        res.json({ success: true, data: recommendations });

    } catch (error) {
        console.error('Error in learning-recommendations:', error);
        res.status(500).json({
            error: 'Failed to generate recommendations',
            message: error.message
        });
    }
});

/**
 * POST /api/gemini/learning-resources
 * Fetch best learning resources from internet based on search query
 */
app.post('/api/gemini/learning-resources', async (req, res) => {
    try {
        const { searchQuery, targetRole } = req.body;

        if (!searchQuery && !targetRole) {
            return res.status(400).json({ error: 'Search query or target role is required' });
        }

        const query = searchQuery || targetRole;

        const prompt = `Find and recommend the BEST learning resources from the internet for: "${query}"

Search for and recommend:
- Online courses (Udemy, Coursera, Frontend Masters, Pluralsight, etc.)
- Certifications (AWS, Google, Azure, CompTIA, etc.)
- Books and ebooks
- Free tutorials and documentation
- Projects and hands-on learning
- YouTube channels
- Bootcamps

For each resource, provide CURRENT, REAL information about actual resources that exist on the internet.

Return a JSON array with this exact structure:
[
  {
    "title": "string - exact course/resource title",
    "type": "Online Course" | "Certification" | "Book" | "Tutorial" | "Project" | "Bootcamp" | "Workshop" | "YouTube Channel",
    "provider": "string - exact platform/author name",
    "duration": "string - estimated time (e.g., '30 hours', '3 months')",
    "costEstimate": "string - price (e.g., '$49.99', 'Free', '$99/month')",
    "skillsCovered": ["skill1", "skill2", "skill3"],
    "relevance": "string - why this resource is good for the user (2-3 sentences)",
    "difficulty": "Beginner" | "Intermediate" | "Advanced",
    "url": "string - real URL to the resource"
  }
]

IMPORTANT:
- Only recommend REAL resources that actually exist
- Include direct links to resources
- Vary the providers and types
- Focus on quality and relevance
- Return minimum 5-10 resources
- No markdown, explanations, or extra text
- Return ONLY the JSON array`;

        const response = await callGeminiAPI(prompt);
        const resources = parseGeminiJSON(response);

        res.json({ success: true, data: resources });

    } catch (error) {
        console.error('Error in learning-resources:', error);
        res.status(500).json({
            error: 'Failed to fetch learning resources',
            message: error.message
        });
    }
});

/**
 * POST /api/gemini/parse-resume
 * Upload and parse PDF resume with AI extraction
 */
app.post('/api/gemini/parse-resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No resume file uploaded' });
        }

        // Extract text from PDF
        const resumeText = await extractPDFText(req.file.buffer);

        // AI prompt for structured extraction
        const prompt = `You are an information extraction engine.

Extract structured data from a raw resume text, calculate an ATS score, and return ONLY one valid JSON document matching the schema below.

🎯 Target JSON Schema (STRICT)
{
  "resume": {
    "socials": [
      { "name": "", "url": "" }
    ],
    "education": [
      {
        "eduType": "",
        "instituteName": "",
        "course": "",
        "score": 0,
        "isCGPA": false,
        "yearOfComp": 0
      }
    ],
    "certifications": [
      {
        "name": "",
        "provider": "",
        "url": "",
        "yearOfComp": 0
      }
    ],
    "experience": [
      {
        "jobTitle": "",
        "jobDesc": ""
      }
    ],
    "atsScore": 0,
    "skills": [""]
  },
  "address": {
    "line": "",
    "city": "",
    "state": "",
    "pinCode": "",
    "country": ""
  },
  "dateOfBirth": "",
  "totalExperienceDuration": 0
}

🔒 Mandatory Rules
- Output ONLY valid JSON
- ❌ No markdown, explanations, or extra text
- ❌ No extra fields
- Missing values: string → "", number → 0, boolean → false, array → []
- Numbers must be numbers, not strings
- Never guess or hallucinate data

📌 Field Rules
Socials:
- name ∈ leetcode | linkedin | github | others
- If platform present but URL missing → don't add that social media to the array
- If the url contains scheme (http://, https://) remove that from the url string

Education:
- eduType ∈ SSC | HSC | UG | PG | Diploma
- Percentage → isCGPA: false
- CGPA → isCGPA: true

Experience:
- Only professional jobs
- ❌ Exclude projects, hackathons, academics

Skills:
- Array of strings
- Normalize casing, remove duplicates

totalExperienceDuration → years (number), else 0

📊 ATS Score (0–100)
Weights:
- Skills & Keyword Match — 30
- Relevant Experience & Projects — 25
- Role Fit & Impact — 15
- Resume Completeness & Structure — 15
- Education — 10
- Certifications — 5

Calibration:
- Strong entry-level: 75–85
- Excellent profiles: 85–95

Rules:
- Integer only
- Max 100
- No explanation

📊 Address
Stores only the address of the resume holder.
If not provided, initialize with empty strings.

TEXT:
${resumeText}`;

        const response = await callGeminiAPI(prompt);
        const extractedData = parseGeminiJSON(response);

        res.json({
            success: true,
            data: extractedData,
            rawText: resumeText
        });

    } catch (error) {
        console.error('Error in parse-resume:', error);
        res.status(500).json({
            error: 'Failed to parse resume',
            message: error.message
        });
    }
});

/**
 * POST /api/gemini/score-resume
 * Score resume text (existing endpoint kept for compatibility)
 */
app.post('/api/gemini/score-resume', async (req, res) => {
    try {
        const { resumeText, targetRole } = req.body;

        if (!resumeText) {
            return res.status(400).json({ error: 'Resume text is required' });
        }

        const prompt = `Analyze this resume:

${targetRole ? `Target Role: ${targetRole}\n` : ''}
Resume:
${resumeText}

Return a JSON object:
{
  "overallScore": number (0-100),
  "breakdown": {
    "completeness": number,
    "relevance": number,
    "formatting": number,
    "keywords": number,
    "atsCompatibility": number
  },
  "strengths": ["strength1"],
  "suggestions": ["suggestion1"],
  "weaknesses": ["weakness1"]
}

Return ONLY the JSON object, no markdown.`;

        const response = await callGeminiAPI(prompt);
        const score = parseGeminiJSON(response);

        res.json({ success: true, data: score });

    } catch (error) {
        console.error('Error in score-resume:', error);
        res.status(500).json({
            error: 'Failed to score resume',
            message: error.message
        });
    }
});

// ============================================
// ✅ ADZUNA JOB MARKET API ROUTES
// ============================================

// Adzuna API Configuration
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY;

/**
 * Helper function to call Adzuna API
 */
async function callAdzunaAPI(endpoint, params = {}) {
    if (!ADZUNA_APP_ID || !ADZUNA_API_KEY) {
        throw new Error('Adzuna API credentials not configured');
    }

    const queryParams = new URLSearchParams({
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_API_KEY,
        ...params
    });

    const url = `https://api.adzuna.com/v1/api/${endpoint}?${queryParams}`;

    console.log(`🔗 Calling Adzuna API: ${endpoint}`);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Adzuna API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

/**
 * POST /api/adzuna/search-jobs
 * Search for jobs
 */
app.post('/api/adzuna/search-jobs', async (req, res) => {
    try {
        const { query, location = 'us', page = 1, resultsPerPage = 20 } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const data = await callAdzunaAPI(`jobs/${location}/search/${page}`, {
            what: query,
            results_per_page: resultsPerPage
        });

        res.json({
            success: true,
            data: {
                results: data.results || [],
                count: data.count || 0,
                mean: data.mean || 0
            }
        });

    } catch (error) {
        console.error('Error in search-jobs:', error);
        res.status(500).json({
            error: 'Failed to search jobs',
            message: error.message
        });
    }
});

/**
 * POST /api/adzuna/job-recommendations
 * Get personalized job recommendations based on skills and preferences
 */
app.post('/api/adzuna/job-recommendations', async (req, res) => {
    try {
        const { skills, targetRole, location = 'us', experienceLevel } = req.body;

        if (!targetRole) {
            return res.status(400).json({ error: 'Target role is required' });
        }

        // Search for jobs matching the target role
        const jobData = await callAdzunaAPI(`jobs/${location}/search/1`, {
            what: targetRole,
            results_per_page: 30
        });

        let jobs = jobData.results || [];

        // If user has skills, filter/rank jobs based on skill matching
        if (skills && skills.length > 0) {
            jobs = jobs.map(job => {
                const description = `${job.title} ${job.description}`.toLowerCase();
                const matchedSkills = skills.filter(skill =>
                    description.includes(skill.toLowerCase())
                );

                return {
                    ...job,
                    matchScore: matchedSkills.length,
                    matchedSkills
                };
            }).sort((a, b) => b.matchScore - a.matchScore);
        }

        res.json({
            success: true,
            data: jobs.slice(0, 20) // Return top 20 recommendations
        });

    } catch (error) {
        console.error('Error in job-recommendations:', error);
        res.status(500).json({
            error: 'Failed to get job recommendations',
            message: error.message
        });
    }
});

/**
 * POST /api/adzuna/trending-skills
 * Get trending skills by analyzing job postings
 */
app.post('/api/adzuna/trending-skills', async (req, res) => {
    try {
        const { role, location = 'us' } = req.body;

        if (!role) {
            return res.status(400).json({ error: 'Role is required' });
        }

        // Fetch recent job postings
        const jobData = await callAdzunaAPI(`jobs/${location}/search/1`, {
            what: role,
            results_per_page: 50
        });

        // Extract skills from job descriptions
        const skillsMap = new Map();
        const commonSkills = [
            'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#',
            'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
            'Git', 'CI/CD', 'REST API', 'GraphQL', 'HTML', 'CSS', 'Vue.js', 'Angular',
            'Express', 'Django', 'Flask', 'Spring Boot', 'Machine Learning', 'TensorFlow',
            'PyTorch', 'Data Science', 'DevOps', 'Agile', 'Scrum', 'Leadership',
            'Communication', 'Problem Solving', 'Team Collaboration', 'UI/UX', 'Figma'
        ];

        const jobs = jobData.results || [];

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
        const trendingSkills = Array.from(skillsMap.entries())
            .map(([skill, count]) => ({
                skill,
                frequency: count,
                percentage: Math.round((count / jobs.length) * 100),
                demand: count > jobs.length * 0.5 ? 'high' : count > jobs.length * 0.25 ? 'medium' : 'low'
            }))
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, 20);

        res.json({ success: true, data: trendingSkills });

    } catch (error) {
        console.error('Error in trending-skills:', error);
        res.status(500).json({
            error: 'Failed to get trending skills',
            message: error.message
        });
    }
});

/**
 * POST /api/adzuna/salary-stats
 * Get salary statistics for a role
 */
app.post('/api/adzuna/salary-stats', async (req, res) => {
    try {
        const { role, location = 'us' } = req.body;

        if (!role) {
            return res.status(400).json({ error: 'Role is required' });
        }

        // Search jobs to get salary data
        const jobData = await callAdzunaAPI(`jobs/${location}/search/1`, {
            what: role,
            results_per_page: 50
        });

        const jobs = jobData.results || [];
        const salaries = jobs
            .filter(job => job.salary_min && job.salary_max)
            .map(job => ({
                min: job.salary_min,
                max: job.salary_max,
                avg: (job.salary_min + job.salary_max) / 2
            }));

        if (salaries.length === 0) {
            return res.json({
                success: true,
                data: {
                    role,
                    location,
                    average: null,
                    min: null,
                    max: null,
                    median: null,
                    sampleSize: 0
                }
            });
        }

        const avgSalaries = salaries.map(s => s.avg).sort((a, b) => a - b);
        const minSalaries = salaries.map(s => s.min).sort((a, b) => a - b);
        const maxSalaries = salaries.map(s => s.max).sort((a, b) => a - b);

        const stats = {
            role,
            location,
            average: Math.round(avgSalaries.reduce((a, b) => a + b, 0) / avgSalaries.length),
            min: Math.round(minSalaries[0]),
            max: Math.round(maxSalaries[maxSalaries.length - 1]),
            median: Math.round(avgSalaries[Math.floor(avgSalaries.length / 2)]),
            sampleSize: salaries.length
        };

        res.json({ success: true, data: stats });

    } catch (error) {
        console.error('Error in salary-stats:', error);
        res.status(500).json({
            error: 'Failed to get salary statistics',
            message: error.message
        });
    }
});

/**
 * POST /api/adzuna/market-insights
 * Get comprehensive market insights (combines multiple data points)
 */
app.post('/api/adzuna/market-insights', async (req, res) => {
    try {
        const { role, location = 'us' } = req.body;

        if (!role) {
            return res.status(400).json({ error: 'Role is required' });
        }

        // Fetch job data
        const jobData = await callAdzunaAPI(`jobs/${location}/search/1`, {
            what: role,
            results_per_page: 50
        });

        const jobs = jobData.results || [];

        // Calculate various insights
        const insights = {
            role,
            location,
            totalJobs: jobData.count || 0,

            // Remote work analysis
            remoteJobs: jobs.filter(j =>
                j.title?.toLowerCase().includes('remote') ||
                j.description?.toLowerCase().includes('remote')
            ).length,

            // Company size distribution
            companies: [...new Set(jobs.map(j => j.company?.display_name).filter(Boolean))].length,

            // Top hiring companies
            topCompanies: Object.entries(
                jobs.reduce((acc, job) => {
                    const company = job.company?.display_name || 'Unknown';
                    acc[company] = (acc[company] || 0) + 1;
                    return acc;
                }, {})
            )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([name, count]) => ({ name, openings: count })),

            // Location distribution
            topLocations: Object.entries(
                jobs.reduce((acc, job) => {
                    const loc = job.location?.display_name || 'Unknown';
                    acc[loc] = (acc[loc] || 0) + 1;
                    return acc;
                }, {})
            )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([location, count]) => ({ location, count })),

            // Growth indicator
            growthIndicator: jobData.count > 100 ? 'high' : jobData.count > 50 ? 'medium' : 'low'
        };

        res.json({ success: true, data: insights });

    } catch (error) {
        console.error('Error in market-insights:', error);
        res.status(500).json({
            error: 'Failed to get market insights',
            message: error.message
        });
    }
});



// ✅ 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ✅ Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   🚀 Gemini AI Microservice Started       ║
╠════════════════════════════════════════════╣
║   Port: ${PORT}                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                 ║
║   Gemini Model: ${GEMINI_MODEL}     ║
║   SDK: @google/genai ✅                   ║
╚════════════════════════════════════════════╝

Available Routes:
  GET  /health
  
  Gemini AI:
  POST /api/gemini/analyze-skills
  POST /api/gemini/generate-roadmap
  POST /api/gemini/learning-recommendations
  POST /api/gemini/parse-resume (PDF Upload)
  POST /api/gemini/score-resume
  
  Adzuna Job Market:
  POST /api/adzuna/search-jobs
  POST /api/adzuna/job-recommendations
  POST /api/adzuna/trending-skills
  POST /api/adzuna/salary-stats
  POST /api/adzuna/market-insights
`);
});

module.exports = app;
