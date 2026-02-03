// Shared constants for HireHuntAI application

// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  SKILL_GAPS: 'skillGaps',
  CAREER_ROADMAPS: 'careerRoadmaps',
  LEARNING_RECOMMENDATIONS: 'learningRecommendations',
  JOB_MARKET_CACHE: 'jobMarketCache',
};

// User roles
export const USER_ROLES = {
  LEARNER: 'learner',
  RECRUITER: 'recruiter',
};

// Skill categories
export const SKILL_CATEGORIES = {
  FRONTEND: 'Frontend Development',
  BACKEND: 'Backend Development',
  MOBILE: 'Mobile Development',
  DEVOPS: 'DevOps & Cloud',
  DATABASE: 'Database Management',
  DATA_SCIENCE: 'Data Science & ML',
  SOFT_SKILLS: 'Soft Skills',
  DESIGN: 'UI/UX Design',
  TESTING: 'Testing & QA',
  SECURITY: 'Security',
  PROJECT_MANAGEMENT: 'Project Management',
  OTHER: 'Other',
};

// Proficiency levels
export const PROFICIENCY_LEVELS = {
  BEGINNER: { value: 1, label: 'Beginner', description: 'Learning the basics' },
  INTERMEDIATE: { value: 2, label: 'Intermediate', description: 'Can work with guidance' },
  COMPETENT: { value: 3, label: 'Competent', description: 'Can work independently' },
  PROFICIENT: { value: 4, label: 'Proficient', description: 'Advanced knowledge' },
  EXPERT: { value: 5, label: 'Expert', description: 'Can teach others' },
};

// Skill gap priorities
export const GAP_PRIORITIES = {
  CRITICAL: { value: 'critical', label: 'Critical', color: 'red' },
  IMPORTANT: { value: 'important', label: 'Important', color: 'orange' },
  NICE_TO_HAVE: { value: 'nice-to-have', label: 'Nice to Have', color: 'blue' },
};

// Industry sectors
export const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'E-commerce',
  'Education',
  'Manufacturing',
  'Media & Entertainment',
  'Consulting',
  'Government',
  'Non-profit',
  'Other',
];

// Experience levels
export const EXPERIENCE_LEVELS = [
  'Entry Level (0-2 years)',
  'Mid Level (3-5 years)',
  'Senior Level (6-10 years)',
  'Lead Level (10+ years)',
  'Executive Level',
];

// Common job roles
export const JOB_ROLES = [
  'Full-Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'UI/UX Designer',
  'Product Manager',
  'QA Engineer',
  'Security Engineer',
  'Cloud Architect',
  'Database Administrator',
  'System Administrator',
  'Technical Lead',
  'Engineering Manager',
];

// Supabase storage buckets
export const STORAGE_BUCKETS = {
  RESUMES: 'resumes',
  PORTFOLIOS: 'portfolios',
  CERTIFICATES: 'certificates',
};

// Resume score dimensions
export const RESUME_SCORE_DIMENSIONS = {
  COMPLETENESS: 'Completeness',
  RELEVANCE: 'Relevance',
  FORMATTING: 'Formatting',
  KEYWORDS: 'Keyword Optimization',
  ATS_COMPATIBILITY: 'ATS Compatibility',
};

// Learning resource types
export const RESOURCE_TYPES = {
  COURSE: 'Online Course',
  CERTIFICATION: 'Certification',
  BOOK: 'Book',
  PROJECT: 'Hands-on Project',
  TUTORIAL: 'Tutorial',
  BOOTCAMP: 'Bootcamp',
  WORKSHOP: 'Workshop',
};

// Job readiness factors
export const READINESS_FACTORS = {
  SKILLS: 'Skills Match',
  EXPERIENCE: 'Experience Level',
  EDUCATION: 'Education',
  PROJECTS: 'Portfolio Projects',
  CERTIFICATIONS: 'Certifications',
};

// Cache duration (in milliseconds)
export const CACHE_DURATION = {
  JOB_MARKET_DATA: 24 * 60 * 60 * 1000, // 24 hours
  SKILL_TRENDS: 12 * 60 * 60 * 1000, // 12 hours
  SALARY_DATA: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Adzuna API locations
export const LOCATIONS = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'in', label: 'India' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
];

// Default prompts for Gemini API
export const GEMINI_PROMPTS = {
  SKILL_GAP_ANALYSIS: `You are an AI career advisor. Analyze the user's current skills against the job market requirements and identify skill gaps. Return a JSON array of gaps with: skillName, priority (critical/important/nice-to-have), timeToLearn, marketDemand (0-100), and reasoning.`,
  
  CAREER_ROADMAP: `You are an AI career strategist. Generate a personalized career roadmap as a JSON array of milestones. Each milestone should have: title, description, skills (array), estimatedDuration, prerequisites, and resources. Order by priority and progression.`,
  
  RESUME_SCORING: `You are an expert resume reviewer. Analyze this resume and provide a detailed score (0-100) with breakdown by: completeness, relevance, formatting, keywords, and atsCompatibility. Also provide 3-5 actionable improvement suggestions. Return as JSON.`,
  
  LEARNING_RECOMMENDATIONS: `You are a learning advisor. Based on the identified skill gaps, recommend specific online courses, certifications, books, and projects. For each recommendation, include: title, type, provider, duration, cost estimate, and why it's relevant. Return as JSON array.`,
};
