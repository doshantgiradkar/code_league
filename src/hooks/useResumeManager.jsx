// Custom hook for resume management (Supabase + Firestore)

import { useState } from 'react';
import { uploadFile, deleteFile } from '../firebase/helperFunction';
import { updateDocument } from '../firebase/helperFunction';
import { useAuth } from './useAuth';
import { STORAGE_BUCKETS, COLLECTIONS } from '../lib/constants';
import { scoreResume } from '../lib/geminiClient';

export const useResumeManager = () => {
    const { user, userProfile, updateUserProfile } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    /**
     * Extract text from PDF (simplified - in production use pdf-parse or similar)
     * @param {File} file
     * @returns {Promise<string>}
     */
    const extractTextFromPDF = async (file) => {
        // For now, return placeholder. In production, use a library like pdf-parse
        return `Resume content from ${file.name}. This is a placeholder for actual PDF text extraction.`;
    };

    /**
     * Upload resume to Supabase and score with Gemini
     * @param {File} file - Resume file (PDF/DOCX)
     * @param {string} targetRole - Optional target role for scoring
     * @returns {Promise<object>} - Resume metadata and score
     */
    const uploadResume = async (file, targetRole = '') => {
        if (!user) {
            throw new Error('Must be authenticated to upload resume');
        }

        try {
            setUploading(true);
            setError(null);
            setProgress(10);

            // Validate file
            const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                throw new Error('Only PDF and DOCX files are supported');
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                throw new Error('File size must be less than 5MB');
            }

            setProgress(20);

            // Delete old resume if exists
            if (userProfile?.resume?.supabasePath) {
                try {
                    await deleteFile({
                        bucket: STORAGE_BUCKETS.RESUMES,
                        filePath: userProfile.resume.supabasePath,
                    });
                } catch (err) {
                    console.warn('Failed to delete old resume:', err);
                }
            }

            setProgress(40);

            // Upload to Supabase
            const { path, fileName } = await uploadFile({
                file,
                bucket: STORAGE_BUCKETS.RESUMES,
                userId: user.uid,
                folder: 'resumes',
                upsert: true,
            });

            setProgress(60);

            // Extract text from resume
            const resumeText = await extractTextFromPDF(file);

            setProgress(70);

            // Score resume with Gemini
            const scoreData = await scoreResume(resumeText, targetRole);

            setProgress(90);

            // Update user profile in Firestore
            const resumeMetadata = {
                fileName: file.name,
                supabasePath: path,
                uploadDate: new Date().toISOString(),
                score: scoreData.overallScore,
                scoreBreakdown: scoreData.breakdown,
                suggestions: scoreData.suggestions,
                strengths: scoreData.strengths,
                weaknesses: scoreData.weaknesses,
            };

            await updateUserProfile({ resume: resumeMetadata });

            setProgress(100);
            setUploading(false);

            return resumeMetadata;
        } catch (err) {
            console.error('Resume upload error:', err);
            setError(err.message);
            setUploading(false);
            setProgress(0);

            // Provide specific error messages
            if (err.message?.includes('Bucket not found') || err.message?.includes('bucket')) {
                const helpfulError = 'Supabase storage not configured. Please ensure the "uploads" bucket exists in your Supabase dashboard and has proper permissions.';
                setError(helpfulError);
                throw new Error(helpfulError);
            }

            throw err;
        }
    };

    /**
     * Delete resume from Supabase and Firestore
     */
    const deleteResume = async () => {
        if (!user || !userProfile?.resume) {
            return;
        }

        try {
            setUploading(true);

            await deleteFile({
                bucket: STORAGE_BUCKETS.RESUMES,
                filePath: userProfile.resume.supabasePath,
            });

            await updateUserProfile({ resume: null });

            setUploading(false);
        } catch (err) {
            setError(err.message);
            setUploading(false);
            throw err;
        }
    };

    return {
        uploadResume,
        deleteResume,
        resumeData: userProfile?.resume || null,
        uploading,
        progress,
        error,
    };
};

export default useResumeManager;
