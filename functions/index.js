/**
 * ✅ Firebase Cloud Functions for Gemini API Proxy
 * 
 * This function acts as a secure backend proxy between your React frontend
 * and the Gemini v1 API, solving the v1beta deprecation issue.
 */

const functions = require('firebase-functions');
const fetch = require('node-fetch');

// ✅ Gemini v1 API endpoint (NOT v1beta)
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

/**
 * ✅ callGemini - Cloud Function to proxy Gemini API calls
 * 
 * Frontend calls this function, which then calls Gemini API securely
 */
exports.callGemini = functions.https.onCall(async (data, context) => {
    // ✅ Get API key from Firebase environment config
    const apiKey = functions.config().gemini.key;

    if (!apiKey) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'Gemini API key not configured. Run: firebase functions:config:set gemini.key="YOUR_KEY"'
        );
    }

    // ✅ Validate input
    if (!data.prompt) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Prompt is required'
        );
    }

    try {
        // ✅ Call Gemini v1 API
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: data.prompt
                    }]
                }],
                generationConfig: {
                    temperature: data.temperature || 0.7,
                    topK: data.topK || 40,
                    topP: data.topP || 0.95,
                    maxOutputTokens: data.maxOutputTokens || 2048,
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', errorText);
            throw new functions.https.HttpsError(
                'internal',
                `Gemini API error: ${response.status} ${response.statusText}`
            );
        }

        const result = await response.json();

        // ✅ Extract text from response
        if (!result.candidates || !result.candidates[0]?.content?.parts?.[0]?.text) {
            throw new functions.https.HttpsError(
                'internal',
                'Invalid response format from Gemini API'
            );
        }

        return {
            success: true,
            text: result.candidates[0].content.parts[0].text
        };

    } catch (error) {
        console.error('Error calling Gemini:', error);

        if (error instanceof functions.https.HttpsError) {
            throw error;
        }

        throw new functions.https.HttpsError(
            'internal',
            `Failed to call Gemini API: ${error.message}`
        );
    }
});

/**
 * ✅ CORS-enabled HTTP endpoint (alternative to callable function)
 * Use this if you prefer REST API over Firebase callable functions
 */
exports.geminiProxy = functions.https.onRequest(async (req, res) => {
    // ✅ Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const apiKey = functions.config().gemini.key;

    if (!apiKey) {
        res.status(500).json({
            error: 'Gemini API key not configured'
        });
        return;
    }

    const { prompt, temperature, topK, topP, maxOutputTokens } = req.body;

    if (!prompt) {
        res.status(400).json({ error: 'Prompt is required' });
        return;
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: temperature || 0.7,
                    topK: topK || 40,
                    topP: topP || 0.95,
                    maxOutputTokens: maxOutputTokens || 2048,
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', errorText);
            res.status(response.status).json({
                error: `Gemini API error: ${response.statusText}`
            });
            return;
        }

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            res.status(500).json({ error: 'Invalid response from Gemini' });
            return;
        }

        res.status(200).json({
            success: true,
            text
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: error.message
        });
    }
});
