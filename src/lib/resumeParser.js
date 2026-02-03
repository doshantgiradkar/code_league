// ✅ Resume Upload Helper for Frontend
// Handles file upload to Express microservice

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/gemini';

/**
 * ✅ Upload and parse PDF resume
 * @param {File} file - PDF file object
 * @returns {Promise<object>} - Extracted resume data
 */
export const uploadAndParseResume = async (file) => {
    try {
        // Validate file
        if (!file) {
            throw new Error('No file provided');
        }

        if (file.type !== 'application/pdf') {
            throw new Error('Only PDF files are supported');
        }

        if (file.size > 10 * 1024 * 1024) {
            throw new Error('File size must be less than 10MB');
        }

        // Create FormData
        const formData = new FormData();
        formData.append('resume', file);

        console.log('📤 Uploading resume:', file.name);

        // Upload to server
        const response = await fetch(`${API_BASE_URL}/parse-resume`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `Upload failed: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error('Resume parsing failed');
        }

        console.log('✅ Resume parsed successfully');
        console.log('ATS Score:', result.data.resume.atsScore);

        return result.data;

    } catch (error) {
        console.error('❌ Resume upload error:', error);
        throw error;
    }
};

/**
 * ✅ Example usage in a React component:
 * 
 * import { uploadAndParseResume } from './lib/resumeParser';
 * 
 * const handleFileUpload = async (event) => {
 *     const file = event.target.files[0];
 *     
 *     try {
 *         setLoading(true);
 *         const resumeData = await uploadAndParseResume(file);
 *         
 *         console.log('Resume Data:', resumeData);
 *         console.log('ATS Score:', resumeData.resume.atsScore);
 *         console.log('Skills:', resumeData.resume.skills);
 *         console.log('Experience:', resumeData.resume.experience);
 *         
 *         // Update your state with the parsed data
 *         setResumeData(resumeData);
 *         
 *     } catch (error) {
 *         toast.error(error.message);
 *     } finally {
 *         setLoading(false);
 *     }
 * };
 * 
 * return (
 *     <input
 *         type="file"
 *         accept=".pdf"
 *         onChange={handleFileUpload}
 *     />
 * );
 */
